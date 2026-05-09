import React from 'react';
import { Text, View } from 'react-native';
import Button from '../../ui/Button';
import { useMembership } from '../../../store/membershipStore';
import { styles } from './styles';

interface Props {
  onUpgradePress: () => void;
}

const FREE_CHIPS = [
  'Remove All Ads',
  'Support Development',
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
            {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left
            ad-free. Upgrade to stay Premium.
          </Text>

          <Button
            variant="white"
            title="Upgrade Now"
            onPress={onUpgradePress}
            activeOpacity={0.85}
          />
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

          <Button
            variant="ghost-dark"
            title="Upgrade to Full"
            onPress={onUpgradePress}
            activeOpacity={0.85}
          />
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

        <Text style={styles.title}>Enjoying Moniqo?</Text>
        <Text style={styles.subtitle}>
          Go Premium to remove all ads and support the app.
        </Text>

        <View style={styles.featureRow}>
          {FREE_CHIPS.map(label => (
            <View key={label} style={styles.featureChip}>
              <Text style={styles.featureText}>{label}</Text>
            </View>
          ))}
        </View>

        <Button
          variant="white"
          title="View Plans"
          onPress={onUpgradePress}
          activeOpacity={0.85}
        />
      </View>
    </View>
  );
};

export default PremiumBanner;
