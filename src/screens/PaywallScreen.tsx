import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIAP } from '../hooks/useIAP';
import { useAuth } from '../store/authStore';
import { useMembership } from '../store/membershipStore';
import type { MembershipTier } from '../types/index';
import { styles } from './PaywallScreen.styles';

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

// ── Static tier data ───────────────────────────────────────────────────────

const TIERS: TierData[] = [
  {
    id: 'free',
    name: 'Free',
    features: [
      'Unlimited transactions',
      'All account types',
      '1 active budget',
      'Up to 5 custom categories',
      '3 months analytics history',
    ],
    recommended: false,
  },
  {
    id: 'premium_lite',
    name: 'Premium Lite',
    features: [
      'Everything in Free',
      'Unlimited budgets & categories',
      'Cloud sync & backup',
      'App lock (biometrics / PIN)',
      'Recurring transactions',
    ],
    recommended: false,
  },
  {
    id: 'premium_full',
    name: 'Premium Full',
    features: [
      'Everything in Lite',
      'Zero ads',
      'CSV export',
      'Splitwise expense splitting',
      'SMS auto-parsing (Android)',
      'Multi-currency',
      'Home screen widget',
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
        <View style={{ gap: 8, marginTop: 4 }}>
          {(
            [
              { sku: LITE_SKUS.monthly, label: 'Monthly' },
              { sku: LITE_SKUS.annual, label: 'Annual' },
            ] as const
          ).map(({ sku, label }) => {
            const isPurchasing = purchasing === sku;
            return (
              <TouchableOpacity
                key={sku}
                style={[
                  styles.ctaButton,
                  styles.ctaButtonLite,
                  isDisabled && { opacity: 0.6 },
                ]}
                onPress={() => onPurchase(sku)}
                disabled={isDisabled}
                activeOpacity={0.8}
              >
                {isPurchasing ? (
                  <ActivityIndicator size="small" color="#2B3FE8" />
                ) : (
                  <Text
                    style={[styles.ctaButtonText, styles.ctaButtonTextLite]}
                  >
                    {`${label}  ${getPrice(sku)}`}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    if (tier.id === 'premium_full') {
      return (
        <View style={{ gap: 8, marginTop: 4 }}>
          {(
            [
              { sku: FULL_SKUS.monthly, label: 'Monthly', isLifetime: false },
              { sku: FULL_SKUS.annual, label: 'Annual', isLifetime: false },
              { sku: FULL_SKUS.lifetime, label: 'Lifetime', isLifetime: true },
            ] as const
          ).map(({ sku, label, isLifetime }) => {
            const isPurchasing = purchasing === sku;
            return (
              <TouchableOpacity
                key={sku}
                style={[
                  styles.ctaButton,
                  isLifetime && {
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: '#22C55E',
                  },
                  isDisabled && { opacity: 0.6 },
                ]}
                onPress={() => onPurchase(sku)}
                disabled={isDisabled}
                activeOpacity={0.8}
              >
                {isPurchasing ? (
                  <ActivityIndicator
                    size="small"
                    color={isLifetime ? '#22C55E' : '#FFFFFF'}
                  />
                ) : (
                  <Text
                    style={[
                      styles.ctaButtonText,
                      isLifetime && { color: '#22C55E' },
                    ]}
                  >
                    {`${label}  ${getPrice(sku)}`}
                  </Text>
                )}
              </TouchableOpacity>
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
        {/* Header row */}
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

        {/* Feature list */}
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

        {/* Purchase buttons */}
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.closeButtonText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Upgrade Moniqo</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Trial banner */}
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

            {/* Guest prompt */}
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
                <TouchableOpacity
                  style={styles.guestSignInButton}
                  onPress={handleSignIn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.guestSignInText}>Sign In / Register</Text>
                </TouchableOpacity>
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

                {/* IAP error */}
                {iapState.error ? (
                  <Text
                    style={{
                      color: '#EF4444',
                      fontSize: 13,
                      textAlign: 'center',
                      marginTop: 8,
                      marginHorizontal: 16,
                    }}
                  >
                    {iapState.error}
                  </Text>
                ) : null}

                {/* Restore purchases */}
                <TouchableOpacity
                  onPress={restore}
                  disabled={iapState.restoring}
                  activeOpacity={0.7}
                  style={{
                    alignItems: 'center',
                    paddingVertical: 12,
                    marginTop: 4,
                  }}
                >
                  {iapState.restoring ? (
                    <ActivityIndicator size="small" color="#94A3B8" />
                  ) : (
                    <Text
                      style={{
                        color: '#94A3B8',
                        fontSize: 13,
                        textDecorationLine: 'underline',
                      }}
                    >
                      Restore Purchases
                    </Text>
                  )}
                </TouchableOpacity>

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
