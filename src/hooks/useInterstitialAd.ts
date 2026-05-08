import { useCallback, useEffect, useRef } from 'react';
import {
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../config/adConfig';
import { useMembership } from '../store/membershipStore';

const SHOW_EVERY_N = 3;
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export function useInterstitialAd() {
  const { canAccess } = useMembership();
  const countRef = useRef(0);
  const lastShownRef = useRef(0);
  const adRef = useRef<InterstitialAd | null>(null);

  useEffect(() => {
    if (canAccess('zero_ads')) {
      return;
    }

    const ad = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial);
    adRef.current = ad;

    const unsubscribe = ad.addAdEventListener(AdEventType.CLOSED, () => {
      ad.load();
    });

    ad.load();

    return () => {
      unsubscribe();
    };
  }, [canAccess]);

  const recordTransaction = useCallback(() => {
    if (canAccess('zero_ads')) {
      return;
    }

    countRef.current += 1;

    if (countRef.current % SHOW_EVERY_N !== 0) {
      return;
    }

    const now = Date.now();
    if (now - lastShownRef.current < COOLDOWN_MS) {
      return;
    }

    const ad = adRef.current;
    if (ad?.loaded) {
      lastShownRef.current = now;
      ad.show();
    }
  }, [canAccess]);

  return { recordTransaction };
}
