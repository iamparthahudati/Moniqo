import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useMembership } from '../../store/membershipStore';
import { styles } from './PremiumBanner.styles';

interface Props {
  onUpgradePress: () => void;
}

const FREE_CHIPS = [
  'Unlimited Budgets',
  'Cloud Sync',
  'CSV Export',
  'Splitwise',
];

const PremiumBanner: React.FC<Props> = ({ onUpgradePress }) => {
  const { tier, isTrialActive, trialDaysLeft } = useMembership();

  if (isTrialActive) {
    return (
      <View style={styles.card}>
        <View style={styles.gradient}>
          <View style={styles.topRow}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>TRIAL ACTIVE</Text>
              </View>
            </View>
          </View>

          <Text style={styles.title}>Premium Full — Trial</Text>
          <Text style={styles.subtitle}>
            {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left in your
            free trial. Upgrade to keep access.
          </Text>

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={onUpgradePress}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (tier === 'premium_lite') {
    return (
      <View style={styles.card}>
        <View style={styles.gradientDark}>
          <View style={styles.topRow}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>PREMIUM LITE</Text>
              </View>
            </View>
          </View>

          <Text style={styles.title}>Premium Lite</Text>
          <Text style={styles.subtitle}>
            You have access to cloud sync, unlimited budgets and more.
          </Text>

          <TouchableOpacity
            style={styles.ctaBtnDark}
            onPress={onUpgradePress}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnDarkText}>Upgrade to Full</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (tier === 'premium_full') {
    return (
      <View style={styles.card}>
        <View style={styles.gradientDark}>
          <View style={styles.topRow}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>PREMIUM FULL</Text>
              </View>
            </View>
          </View>

          <Text style={styles.title}>Premium Full</Text>
          <Text style={styles.subtitle}>
            You have access to all features. Thank you for supporting Moniqo.
          </Text>

          <View style={styles.checkRow}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <Text style={styles.checkLabel}>All features unlocked</Text>
          </View>
        </View>
      </View>
    );
  }

  // FREE tier (default)
  return (
    <View style={styles.card}>
      <View style={styles.gradient}>
        <View style={styles.topRow}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>FREE PLAN</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Unlock Pro Features</Text>
        <Text style={styles.subtitle}>
          Get unlimited budgets, cloud sync, CSV export and more.
        </Text>

        <View style={styles.featureRow}>
          {FREE_CHIPS.map(label => (
            <View key={label} style={styles.featureChip}>
              <Text style={styles.featureText}>{label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={onUpgradePress}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>View Plans</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PremiumBanner;
