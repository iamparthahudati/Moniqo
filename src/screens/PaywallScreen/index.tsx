import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import IconButton from '../../components/ui/IconButton';
import { BackIcon } from '../../icons/Icons';
import { useIAP } from '../../hooks/useIAP';
import { useAuth } from '../../store/authStore';
import { useMembership } from '../../store/membershipStore';
import type { MembershipTier } from '../../types/index';
import { Colors } from '../../theme/colors';
import { styles } from './styles';

// ── Types ──────────────────────────────────────────────────────────────────

interface TierData {
  id: MembershipTier;
  name: string;
  features: string[];
  recommended: boolean;
}

interface PaywallScreenProps {
  visible: boolean;
  onClose: () => void;
}

// ── SKU maps ───────────────────────────────────────────────────────────────

const LITE_SKUS = {
  monthly: 'moniqo_lite_monthly',
  annual: 'moniqo_lite_annual',
} as const;

const FULL_SKUS = {
  monthly: 'moniqo_full_monthly',
  annual: 'moniqo_full_annual',
  lifetime: 'moniqo_full_lifetime',
} as const;

// ── Button configs ─────────────────────────────────────────────────────────

const LITE_BUTTON_CONFIGS = [
  { sku: LITE_SKUS.monthly, label: 'Monthly' },
  { sku: LITE_SKUS.annual, label: 'Annual' },
] as const;

const FULL_BUTTON_CONFIGS = [
  { sku: FULL_SKUS.monthly, label: 'Monthly', isLifetime: false },
  { sku: FULL_SKUS.annual, label: 'Annual', isLifetime: false },
  { sku: FULL_SKUS.lifetime, label: 'Lifetime', isLifetime: true },
] as const;

// ── Static tier data ───────────────────────────────────────────────────────

const TIERS: TierData[] = [
  {
    id: 'free',
    name: 'Free',
    features: [
      'All features unlocked',
      'Unlimited budgets & categories',
      'Cloud sync & backup',
      'All account types',
      'Ads supported',
    ],
    recommended: false,
  },
  {
    id: 'premium_lite',
    name: 'Premium Lite',
    features: [
      'Everything in Free',
      'No ads',
      'Support development',
    ],
    recommended: false,
  },
  {
    id: 'premium_full',
    name: 'Premium Full',
    features: [
      'Everything in Free',
      'No ads',
      'Priority support',
      'Support development',
    ],
    recommended: true,
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

interface FeatureRowProps {
  text: string;
  isActive: boolean;
  isFree: boolean;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ text, isActive, isFree }) => {
  const bulletStyle = [
    styles.featureBullet,
    isActive && styles.featureBulletActive,
    isFree && !isActive && styles.featureBulletFree,
  ];
  const bulletTextStyle = [
    styles.featureBulletText,
    isActive && styles.featureBulletTextActive,
    isFree && !isActive && styles.featureBulletTextFree,
  ];

  return (
    <View style={styles.featureRow}>
      <View style={bulletStyle}>
        <Text style={bulletTextStyle}>{'+'}</Text>
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
};

interface TierCardProps {
  tier: TierData;
  currentTier: MembershipTier;
  onPurchase: (sku: string) => void;
  purchasing: string | null;
  getPrice: (sku: string) => string;
}

const TierCard: React.FC<TierCardProps> = ({
  tier,
  currentTier,
  onPurchase,
  purchasing,
  getPrice,
}) => {
  const isActive = currentTier === tier.id;
  const isFree = tier.id === 'free';
  const isDisabled = purchasing !== null;

  const cardStyle = [
    styles.card,
    isActive && styles.cardActive,
    tier.recommended && !isActive && styles.cardRecommended,
  ];

  const renderPurchaseButtons = () => {
    if (isFree) {
      return (
        <View style={styles.currentPlanRow}>
          <View style={styles.currentPlanCheck}>
            <Text style={styles.currentPlanCheckText}>{'v'}</Text>
          </View>
          <Text style={styles.currentPlanText}>Your current plan</Text>
        </View>
      );
    }

    if (tier.id === 'premium_lite') {
      return (
        <View style={styles.purchaseButtonsContainer}>
          {LITE_BUTTON_CONFIGS.map(({ sku, label }) => {
            const isPurchasing = purchasing === sku;
            return (
              <Button
                key={sku}
                variant="outline"
                title={`${label}  ${getPrice(sku)}`}
                onPress={() => onPurchase(sku)}
                disabled={isDisabled}
                loading={isPurchasing}
                style={(isPurchasing || isDisabled) ? styles.buttonDisabled : undefined}
              />
            );
          })}
        </View>
      );
    }

    if (tier.id === 'premium_full') {
      return (
        <View style={styles.purchaseButtonsContainer}>
          {FULL_BUTTON_CONFIGS.map(({ sku, label, isLifetime }) => {
            const isPurchasing = purchasing === sku;
            if (isLifetime) {
              return (
                <Button
                  key={sku}
                  variant="outline"
                  title={`${label}  ${getPrice(sku)}`}
                  onPress={() => onPurchase(sku)}
                  disabled={isDisabled}
                  loading={isPurchasing}
                  style={isPurchasing || isDisabled ? { ...styles.lifetimeButton, ...styles.buttonDisabled } : styles.lifetimeButton}
                  textStyle={styles.lifetimeButtonText}
                />
              );
            }
            return (
              <Button
                key={sku}
                variant="primary"
                title={`${label}  ${getPrice(sku)}`}
                onPress={() => onPurchase(sku)}
                disabled={isDisabled}
                loading={isPurchasing}
                shadow
                style={(isPurchasing || isDisabled) ? styles.buttonDisabled : undefined}
              />
            );
          })}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={cardStyle}>
      {tier.recommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
        </View>
      )}

      <View style={styles.cardBody}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.tierNameRow}>
            <Text style={styles.tierName}>{tier.name}</Text>
            {isActive && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Active</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.featureList}>
          {tier.features.map((feature, index) => (
            <FeatureRow
              key={index}
              text={feature}
              isActive={isActive}
              isFree={isFree}
            />
          ))}
        </View>

        {renderPurchaseButtons()}
      </View>
    </View>
  );
};

// ── Main screen ────────────────────────────────────────────────────────────

const PaywallScreen: React.FC<PaywallScreenProps> = ({ visible, onClose }) => {
  const { tier, isTrialActive, trialDaysLeft } = useMembership();
  const { user, isGuest } = useAuth();
  const {
    state: iapState,
    purchase,
    restore,
    getPrice,
  } = useIAP(user?.uid ?? null, onClose);

  const handleUpgrade = async (sku: string) => {
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to purchase.');
      return;
    }
    await purchase(sku);
  };

  const handleSignIn = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <IconButton
              onPress={onClose}
              size={36}
              style={styles.closeButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <BackIcon size={20} color={Colors.textPrimary} />
            </IconButton>
            <Text style={styles.headerTitle}>Upgrade Moniqo</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {isTrialActive && (
              <View style={styles.trialBanner}>
                <View style={styles.trialDot} />
                <Text style={styles.trialText}>
                  {`Your 3-day trial is active - ${trialDaysLeft} day${
                    trialDaysLeft === 1 ? '' : 's'
                  } left`}
                </Text>
              </View>
            )}

            {isGuest ? (
              <View style={styles.guestPrompt}>
                <View style={styles.guestIcon}>
                  <Text style={styles.guestIconText}>{'?'}</Text>
                </View>
                <Text style={styles.guestTitle}>Sign in to Upgrade</Text>
                <Text style={styles.guestSubtitle}>
                  {
                    'Create an account or sign in to unlock Premium features and keep your data safe across devices.'
                  }
                </Text>
                <Button
                  title="Sign In / Register"
                  onPress={handleSignIn}
                  style={styles.guestSignInButton}
                />
              </View>
            ) : (
              <>
                <Text style={styles.sectionLabel}>Choose your plan</Text>

                {TIERS.map(tierData => (
                  <TierCard
                    key={tierData.id}
                    tier={tierData}
                    currentTier={tier}
                    onPurchase={handleUpgrade}
                    purchasing={iapState.purchasing}
                    getPrice={getPrice}
                  />
                ))}

                {iapState.error ? (
                  <Text style={styles.errorText}>{iapState.error}</Text>
                ) : null}

                <Button
                  variant="ghost"
                  title={iapState.restoring ? '' : 'Restore Purchases'}
                  onPress={restore}
                  disabled={iapState.restoring}
                  style={styles.restoreButton}
                  textStyle={styles.restoreButtonText}
                />
                {iapState.restoring && (
                  <ActivityIndicator size="small" color={Colors.textMuted} style={styles.restoreIndicator} />
                )}

                <Text style={styles.footerNote}>
                  {
                    'Prices are in Indian Rupees (INR). Subscriptions renew automatically and can be cancelled anytime.'
                  }
                </Text>
              </>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PaywallScreen;
