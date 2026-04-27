import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { subscribeToUserProfile } from '../services/firestoreService';
import { MembershipTier, PremiumFeature, UserProfile } from '../types';
import { useAuth } from './authStore';

// ---------------------------------------------------------------------------
// Feature access matrix
// ---------------------------------------------------------------------------

const PREMIUM_LITE_FEATURES = new Set<PremiumFeature>([
  'budget_unlimited',
  'categories_unlimited',
  'recurring_transactions',
  'cloud_sync',
  'app_lock',
]);

const PREMIUM_FULL_FEATURES = new Set<PremiumFeature>([
  'budget_unlimited',
  'categories_unlimited',
  'recurring_transactions',
  'cloud_sync',
  'app_lock',
  'csv_export',
  'splitwise',
  'sms_parsing',
  'multi_currency',
  'widget',
  'analytics_full_history',
]);

function resolveEffectiveTier(profile: UserProfile | null): {
  tier: MembershipTier;
  isTrialActive: boolean;
  trialDaysLeft: number;
} {
  if (!profile) {
    return { tier: 'free', isTrialActive: false, trialDaysLeft: 0 };
  }

  const now = Date.now();

  // Check if membership has expired
  if (
    profile.membershipExpiry !== undefined &&
    profile.membershipExpiry < now
  ) {
    return { tier: 'free', isTrialActive: false, trialDaysLeft: 0 };
  }

  // Check if trial is active
  const isTrialActive =
    profile.membership === 'premium_full' &&
    profile.trialUsed === true &&
    profile.trialExpiry !== undefined &&
    profile.trialExpiry > now;

  const trialDaysLeft = isTrialActive
    ? Math.ceil((profile.trialExpiry! - now) / (1000 * 60 * 60 * 24))
    : 0;

  // Trial counts as premium_full
  const tier: MembershipTier = isTrialActive
    ? 'premium_full'
    : profile.membership;

  return { tier, isTrialActive, trialDaysLeft };
}

function buildCanAccess(
  tier: MembershipTier,
  isTrialActive: boolean,
): (feature: PremiumFeature) => boolean {
  return (feature: PremiumFeature): boolean => {
    // Trial grants full access
    if (isTrialActive || tier === 'premium_full') {
      return PREMIUM_FULL_FEATURES.has(feature);
    }
    if (tier === 'premium_lite') {
      return PREMIUM_LITE_FEATURES.has(feature);
    }
    // free tier — no gated features accessible
    return false;
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface MembershipContextValue {
  profile: UserProfile | null;
  tier: MembershipTier;
  isTrialActive: boolean;
  trialDaysLeft: number;
  isLoading: boolean;
  canAccess: (feature: PremiumFeature) => boolean;
}

const MembershipContext = createContext<MembershipContextValue>({
  profile: null,
  tier: 'free',
  isTrialActive: false,
  trialDaysLeft: 0,
  isLoading: true,
  canAccess: () => false,
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface MembershipProviderProps {
  children: ReactNode;
}

export function MembershipProvider({
  children,
}: MembershipProviderProps): React.JSX.Element {
  const { user, isGuest } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!user || isGuest) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // subscribeToUserProfile calls onChange(null) on error internally
    const unsubscribe = subscribeToUserProfile(user.uid, snapshot => {
      setProfile(snapshot);
      setIsLoading(false);
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
      unsubscribeRef.current = null;
    };
  }, [user, isGuest]);

  const { tier, isTrialActive, trialDaysLeft } = resolveEffectiveTier(profile);

  const canAccess = useCallback(buildCanAccess(tier, isTrialActive), [
    tier,
    isTrialActive,
  ]);

  const value: MembershipContextValue = {
    profile,
    tier,
    isTrialActive,
    trialDaysLeft,
    isLoading,
    canAccess,
  };

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useMembership(): MembershipContextValue {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
}
