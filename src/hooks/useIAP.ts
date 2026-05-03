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
import { updateMembership } from '../services/firestoreService';
import type { MembershipTier } from '../types';

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

// ---------------------------------------------------------------------------
// SKU → tier + expiry mapping
// ---------------------------------------------------------------------------

interface SkuMapping {
  tier: MembershipTier;
  days?: number; // undefined = lifetime
}

const SKU_MAP: Record<string, SkuMapping> = {
  moniqo_lite_monthly: { tier: 'premium_lite', days: 31 },
  moniqo_lite_annual: { tier: 'premium_lite', days: 366 },
  moniqo_full_monthly: { tier: 'premium_full', days: 31 },
  moniqo_full_annual: { tier: 'premium_full', days: 366 },
  moniqo_full_lifetime: { tier: 'premium_full', days: undefined },
};

const FALLBACK_PRICES: Record<string, string> = {
  moniqo_lite_monthly: '₹49/mo',
  moniqo_lite_annual: '₹399/yr',
  moniqo_full_monthly: '₹149/mo',
  moniqo_full_annual: '₹999/yr',
  moniqo_full_lifetime: '₹2,499',
};

function resolveExpiryMs(days: number | undefined): number | undefined {
  if (days === undefined) return undefined;
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

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
  connected: false,
  subscriptions: [],
  products: [],
  purchasing: null,
  restoring: false,
  error: null,
};

// ---------------------------------------------------------------------------
// Helper — extract offerToken from a subscription for Android
// Google Play Billing v5+ requires an offerToken to initiate a subscription purchase.
// We pick the first available offer token from the subscription's offers list.
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

  // react-native-iap v14 exposes subscriptionOffers on Android
  const offers = (
    sub as { subscriptionOffers?: Array<{ offerToken?: string }> }
  ).subscriptionOffers;
  if (offers && offers.length > 0 && offers[0].offerToken) {
    return offers[0].offerToken;
  }

  // Fallback: oneTimePurchaseOfferDetailsAndroid
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
  const errorListenerRef = useRef<{ remove(): void } | null>(null);

  // Stable refs so listener callbacks always see the latest uid / onSuccess / state
  const uidRef = useRef(uid);
  const onSuccessRef = useRef(onSuccess);
  const stateRef = useRef(state);

  useEffect(() => {
    uidRef.current = uid;
  }, [uid]);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // -------------------------------------------------------------------------
  // Mount / unmount
  // -------------------------------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      try {
        await initConnection();
        if (!mounted) return;

        setState(prev => ({ ...prev, connected: true }));

        // Fetch subscriptions and one-time products
        await Promise.all([
          fetchProducts({ skus: SUBSCRIPTION_SKUS, type: 'subs' }),
          fetchProducts({ skus: ONETIME_SKUS, type: 'in-app' }),
        ]);

        // Purchase success listener
        purchaseListenerRef.current = purchaseUpdatedListener(
          async (purchase: Purchase) => {
            try {
              await finishTransaction({ purchase, isConsumable: false });

              const mapping = SKU_MAP[purchase.productId];
              if (mapping && uidRef.current) {
                const expiryMs = resolveExpiryMs(mapping.days);
                await updateMembership(uidRef.current, mapping.tier, expiryMs);
              }

              setState(prev => ({ ...prev, purchasing: null, error: null }));
              onSuccessRef.current?.();
            } catch (err) {
              const message =
                err instanceof Error
                  ? err.message
                  : 'Purchase completion failed';
              setState(prev => ({ ...prev, purchasing: null, error: message }));
            }
          },
        );

        // Purchase error listener
        errorListenerRef.current = purchaseErrorListener(
          (error: PurchaseError) => {
            // Code 2 = user cancelled — don't show as error
            const cancelled =
              (error as { code?: number | string }).code === 2 ||
              (error as { code?: number | string }).code === 'E_USER_CANCELLED';
            setState(prev => ({
              ...prev,
              purchasing: null,
              error: cancelled ? null : error.message ?? 'Purchase failed',
            }));
          },
        );
      } catch (err) {
        if (!mounted) return;
        const message =
          err instanceof Error ? err.message : 'Failed to connect to store';
        setState(prev => ({ ...prev, error: message }));
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
        // Android requires offerToken for Google Play Billing v5+
        const offerToken = getOfferTokenForSku(
          stateRef.current.subscriptions,
          sku,
        );

        await requestPurchase({
          type: 'subs',
          request: {
            apple: { sku },
            google: {
              skus: [sku],
              ...(offerToken ? { offerToken } : {}),
            },
          },
        });
      } else {
        await requestPurchase({
          type: 'in-app',
          request: {
            apple: { sku },
            google: { skus: [sku] },
          },
        });
      }
      // purchasing is cleared inside purchaseUpdatedListener on success
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Purchase failed';
      setState(prev => ({ ...prev, purchasing: null, error: message }));
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
        const mapping = SKU_MAP[p.productId];
        if (mapping && uidRef.current) {
          const expiryMs = resolveExpiryMs(mapping.days);
          await updateMembership(uidRef.current, mapping.tier, expiryMs);
        }
      }

      setState(prev => ({ ...prev, restoring: false }));
      onSuccessRef.current?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Restore failed';
      setState(prev => ({ ...prev, restoring: false, error: message }));
    }
  };

  // -------------------------------------------------------------------------
  // getPrice
  // -------------------------------------------------------------------------

  const getPrice = (sku: string): string => {
    // react-native-iap v14 uses `id` and `displayPrice` on ProductCommon
    const sub = state.subscriptions.find(
      s =>
        (s as { id?: string; productId?: string }).id === sku ||
        (s as { productId?: string }).productId === sku,
    );
    if (sub) {
      const price =
        (sub as { displayPrice?: string; localizedPrice?: string })
          .displayPrice ?? (sub as { localizedPrice?: string }).localizedPrice;
      if (price) return price;
    }

    const product = state.products.find(
      p =>
        (p as { id?: string; productId?: string }).id === sku ||
        (p as { productId?: string }).productId === sku,
    );
    if (product) {
      const price =
        (product as { displayPrice?: string; localizedPrice?: string })
          .displayPrice ??
        (product as { localizedPrice?: string }).localizedPrice;
      if (price) return price;
    }

    return FALLBACK_PRICES[sku] ?? '';
  };

  return { state, purchase, restore, getPrice };
}
