import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import type {
  Product,
  ProductSubscription,
  Purchase,
  PurchaseError,
} from 'react-native-iap';
import {
  endConnection,
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  restorePurchases,
} from 'react-native-iap';
import { MembershipApiService, MembershipSku } from '../services/membershipApiService';
import { ErrorReportService } from '../services/errorReportService';

// ---------------------------------------------------------------------------
// SKU constants
// ---------------------------------------------------------------------------

export const SUBSCRIPTION_SKUS: string[] = [
  'moniqo_lite_monthly',
  'moniqo_lite_annual',
  'moniqo_full_monthly',
  'moniqo_full_annual',
];

export const ONETIME_SKUS: string[] = ['moniqo_full_lifetime'];

export const ALL_SKUS: string[] = [...SUBSCRIPTION_SKUS, ...ONETIME_SKUS];

const VALID_SKUS = new Set<string>([...SUBSCRIPTION_SKUS, ...ONETIME_SKUS]);

const FALLBACK_PRICES: Record<string, string> = {
  moniqo_lite_monthly:  '₹49/mo',
  moniqo_lite_annual:   '₹399/yr',
  moniqo_full_monthly:  '₹149/mo',
  moniqo_full_annual:   '₹999/yr',
  moniqo_full_lifetime: '₹2,499',
};

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------

export interface IAPState {
  connected: boolean;
  subscriptions: ProductSubscription[];
  products: Product[];
  purchasing: string | null;
  restoring: boolean;
  error: string | null;
}

const INITIAL_STATE: IAPState = {
  connected:     false,
  subscriptions: [],
  products:      [],
  purchasing:    null,
  restoring:     false,
  error:         null,
};

// ---------------------------------------------------------------------------
// Helper — extract offerToken for Android (Google Play Billing v5+)
// ---------------------------------------------------------------------------

function getOfferTokenForSku(
  subscriptions: ProductSubscription[],
  sku: string,
): string | undefined {
  if (Platform.OS !== 'android') return undefined;

  const sub = subscriptions.find(s => {
    const id =
      (s as { id?: string; productId?: string }).id ??
      (s as { productId?: string }).productId;
    return id === sku;
  });
  if (!sub) return undefined;

  const offers = (sub as { subscriptionOffers?: Array<{ offerToken?: string }> })
    .subscriptionOffers;
  if (offers && offers.length > 0 && offers[0].offerToken) {
    return offers[0].offerToken;
  }

  const oneTime = (
    sub as { oneTimePurchaseOfferDetailsAndroid?: { offerToken?: string } }
  ).oneTimePurchaseOfferDetailsAndroid;
  if (oneTime?.offerToken) return oneTime.offerToken;

  return undefined;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useIAP(
  uid: string | null,
  onSuccess?: () => void,
): {
  state: IAPState;
  purchase: (sku: string) => Promise<void>;
  restore: () => Promise<void>;
  getPrice: (sku: string) => string;
} {
  const [state, setState] = useState<IAPState>(INITIAL_STATE);

  const purchaseListenerRef = useRef<{ remove(): void } | null>(null);
  const errorListenerRef    = useRef<{ remove(): void } | null>(null);

  const uidRef       = useRef(uid);
  const onSuccessRef = useRef(onSuccess);
  const stateRef     = useRef(state);

  useEffect(() => { uidRef.current = uid; }, [uid]);
  useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);
  useEffect(() => { stateRef.current = state; }, [state]);

  // -------------------------------------------------------------------------
  // Mount / unmount
  // -------------------------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      try {
        await initConnection();
        if (!mounted) return;

        const [fetchedSubs, fetchedProducts] = await Promise.all([
          fetchProducts({ skus: SUBSCRIPTION_SKUS, type: 'subs' }),
          fetchProducts({ skus: ONETIME_SKUS, type: 'in-app' }),
        ]);

        if (!mounted) return;

        setState(prev => ({
          ...prev,
          connected:     true,
          subscriptions: fetchedSubs as ProductSubscription[],
          products:      fetchedProducts as Product[],
        }));

        // Purchase success listener
        purchaseListenerRef.current = purchaseUpdatedListener(
          async (purchase: Purchase) => {
            const sku = purchase.productId as MembershipSku;
            const token =
              (purchase as { purchaseToken?: string }).purchaseToken ??
              (purchase as { transactionReceipt?: string }).transactionReceipt ??
              '';

            try {
              // Finish the transaction first — this acknowledges it with Google Play
              await finishTransaction({ purchase, isConsumable: false });
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'finishTransaction failed';
              ErrorReportService.reportIapPurchaseFailed(sku ?? 'unknown', 'FINISH_TRANSACTION_FAILED', msg);
            }

            // Mark success immediately — the user has paid, don't hold them hostage to the API
            setState(prev => ({ ...prev, purchasing: null, error: null }));
            onSuccessRef.current?.();

            // Sync with PHP backend in the background (fire-and-forget)
            if (sku && token) {
              MembershipApiService.upgrade(sku, token).catch(err => {
                const msg = err instanceof Error ? err.message : 'Membership API sync failed';
                ErrorReportService.reportIapApiSyncFailed(sku, msg);
              });
            }
          },
        );

        // Purchase error listener
        errorListenerRef.current = purchaseErrorListener((error: PurchaseError) => {
          const code = (error as { code?: number | string }).code;
          const cancelled = code === 2 || code === 'E_USER_CANCELLED';

          if (!cancelled) {
            // Report non-cancellation errors to admin panel
            ErrorReportService.reportIapPurchaseFailed(
              stateRef.current.purchasing ?? 'unknown',
              String(code ?? 'UNKNOWN'),
              error.message ?? 'Purchase failed',
            );
          }

          setState(prev => ({
            ...prev,
            purchasing: null,
            error: cancelled ? null : (error.message ?? 'Purchase failed'),
          }));
        });

      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : 'Failed to connect to store';
        setState(prev => ({ ...prev, error: message }));
        ErrorReportService.reportIapConnectionFailed(message);
      }
    };

    setup();

    return () => {
      mounted = false;
      purchaseListenerRef.current?.remove();
      errorListenerRef.current?.remove();
      endConnection();
    };
  }, []);

  // -------------------------------------------------------------------------
  // purchase
  // -------------------------------------------------------------------------

  const purchase = async (sku: string): Promise<void> => {
    if (!uidRef.current) return;

    setState(prev => ({ ...prev, purchasing: sku, error: null }));

    try {
      const isSub = SUBSCRIPTION_SKUS.includes(sku);

      if (isSub) {
        const offerToken = getOfferTokenForSku(stateRef.current.subscriptions, sku);
        await requestPurchase({
          type: 'subs',
          request: {
            apple:  { sku },
            google: { skus: [sku], ...(offerToken ? { offerToken } : {}) },
          },
        });
      } else {
        await requestPurchase({
          type: 'in-app',
          request: {
            apple:  { sku },
            google: { skus: [sku] },
          },
        });
      }
      // purchasing cleared inside purchaseUpdatedListener on success
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Purchase failed';
      setState(prev => ({ ...prev, purchasing: null, error: message }));
      ErrorReportService.reportIapPurchaseFailed(sku, 'REQUEST_PURCHASE_FAILED', message);
    }
  };

  // -------------------------------------------------------------------------
  // restore
  // -------------------------------------------------------------------------

  const restore = async (): Promise<void> => {
    if (!uidRef.current) return;

    setState(prev => ({ ...prev, restoring: true, error: null }));

    try {
      await restorePurchases();
      const purchases = await getAvailablePurchases();

      for (const p of purchases) {
        const sku = p.productId as MembershipSku;
        const token =
          (p as { purchaseToken?: string }).purchaseToken ??
          (p as { transactionReceipt?: string }).transactionReceipt ??
          '';
        if (VALID_SKUS.has(sku) && token) {
          MembershipApiService.upgrade(sku, token).catch(err => {
            const msg = err instanceof Error ? err.message : 'Restore API sync failed';
            ErrorReportService.reportIapApiSyncFailed(sku, msg);
          });
        }
      }

      setState(prev => ({ ...prev, restoring: false }));
      onSuccessRef.current?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Restore failed';
      setState(prev => ({ ...prev, restoring: false, error: message }));
      ErrorReportService.reportIapRestoreFailed(message);
    }
  };

  // -------------------------------------------------------------------------
  // getPrice
  // -------------------------------------------------------------------------

  const getPrice = (sku: string): string => {
    const sub = state.subscriptions.find(
      s =>
        (s as { id?: string; productId?: string }).id === sku ||
        (s as { productId?: string }).productId === sku,
    );
    if (sub) {
      const price =
        (sub as { displayPrice?: string; localizedPrice?: string }).displayPrice ??
        (sub as { localizedPrice?: string }).localizedPrice;
      if (price) return price;
    }

    const product = state.products.find(
      p =>
        (p as { id?: string; productId?: string }).id === sku ||
        (p as { productId?: string }).productId === sku,
    );
    if (product) {
      const price =
        (product as { displayPrice?: string; localizedPrice?: string }).displayPrice ??
        (product as { localizedPrice?: string }).localizedPrice;
      if (price) return price;
    }

    return FALLBACK_PRICES[sku] ?? '';
  };

  return { state, purchase, restore, getPrice };
}
