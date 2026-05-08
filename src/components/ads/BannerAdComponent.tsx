import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../../config/adConfig';
import { useMembership } from '../../store/membershipStore';

interface BannerAdComponentProps {
  size?: BannerAdSize;
}

export function BannerAdComponent({
  size = BannerAdSize.BANNER,
}: BannerAdComponentProps): React.JSX.Element | null {
  const { canAccess, isLoading } = useMembership();
  const [adLoaded, setAdLoaded] = useState(false);

  if (isLoading || canAccess('zero_ads')) {
    return null;
  }

  return (
    <View style={[styles.container, !adLoaded && styles.hidden]}>
      <BannerAd
        unitId={AD_UNIT_IDS.banner}
        size={size}
        onAdLoaded={() => setAdLoaded(true)}
        onAdFailedToLoad={() => setAdLoaded(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  hidden: {
    height: 0,
    overflow: 'hidden',
  },
});
