import React from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../store/authStore';
import { useMembership } from '../store/membershipStore';
import type { MembershipTier } from '../types/index';
import { styles } from './PaywallScreen.styles';

// ── Types ──────────────────────────────────────────────────────────────────

interface TierData {
  id: MembershipTier;
  name: string;
  priceMonthly: string;
  priceAnnual: string | null;
  priceLifetime: string | null;
  features: string[];
  ctaLabel: string | null;
  recommended: boolean;
}

interface PaywallScreenProps {
  visible: boolean;
  onClose: () => void;
}

// ── Static tier data ───────────────────────────────────────────────────────

const TIERS: TierData[] = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: 'Free forever',
    priceAnnual: null,
    priceLifetime: null,
    features: [
      'Unlimited transactions',
      'All account types',
      '1 active budget',
      'Up to 5 custom categories',
      '3 months analytics history',
    ],
    ctaLabel: null,
    recommended: false,
  },
  {
    id: 'premium_lite',
    name: 'Premium Lite',
    priceMonthly: 'Rs.49 / month',
    priceAnnual: 'Rs.399 / year',
    priceLifetime: null,
    features: [
      'Everything in Free',
      'Unlimited budgets & categories',
      'Cloud sync & backup',
      'App lock (biometrics / PIN)',
      'Recurring transactions',
    ],
    ctaLabel: 'Upgrade to Lite',
    recommended: false,
  },
  {
    id: 'premium_full',
    name: 'Premium Full',
    priceMonthly: 'Rs.149 / month',
    priceAnnual: 'Rs.999 / year',
    priceLifetime: 'Rs.2499 lifetime',
    features: [
      'Everything in Lite',
      'Zero ads',
      'CSV export',
      'Splitwise expense splitting',
      'SMS auto-parsing (Android)',
      'Multi-currency',
      'Home screen widget',
    ],
    ctaLabel: 'Upgrade to Full',
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
  onUpgrade: (label: string) => void;
}

const TierCard: React.FC<TierCardProps> = ({
  tier,
  currentTier,
  onUpgrade,
}) => {
  const isActive = currentTier === tier.id;
  const isFree = tier.id === 'free';

  const cardStyle = [
    styles.card,
    isActive && styles.cardActive,
    tier.recommended && !isActive && styles.cardRecommended,
  ];

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

          <View style={styles.priceBlock}>
            <Text style={isFree ? styles.priceFree : styles.priceMain}>
              {isFree ? tier.priceMonthly : tier.priceMonthly.split(' ')[0]}
            </Text>
            {!isFree && (
              <Text style={styles.priceAnnual}>
                {tier.priceMonthly.split(' ').slice(1).join(' ')}
              </Text>
            )}
            {tier.priceAnnual && (
              <Text style={styles.priceAnnual}>{tier.priceAnnual}</Text>
            )}
            {tier.priceLifetime && (
              <Text style={styles.priceLifetime}>{tier.priceLifetime}</Text>
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

        {/* CTA */}
        {tier.ctaLabel ? (
          <TouchableOpacity
            style={[
              styles.ctaButton,
              tier.id === 'premium_lite' && styles.ctaButtonLite,
            ]}
            onPress={() => onUpgrade(tier.ctaLabel as string)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.ctaButtonText,
                tier.id === 'premium_lite' && styles.ctaButtonTextLite,
              ]}
            >
              {tier.ctaLabel}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.currentPlanRow}>
            <View style={styles.currentPlanCheck}>
              <Text style={styles.currentPlanCheckText}>{'v'}</Text>
            </View>
            <Text style={styles.currentPlanText}>Your current plan</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// ── Main screen ────────────────────────────────────────────────────────────

const PaywallScreen: React.FC<PaywallScreenProps> = ({ visible, onClose }) => {
  const { tier, isTrialActive, trialDaysLeft } = useMembership();
  const { isGuest } = useAuth();

  const handleUpgrade = (_label: string) => {
    Alert.alert(
      'Coming Soon',
      'In-app purchases will be available in the next update.',
      [{ text: 'OK', style: 'default' }],
    );
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
                    onUpgrade={handleUpgrade}
                  />
                ))}
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
