import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthApiService, AuthUser } from '../services/authApiService';
import { MembershipTier, PremiumFeature, UserProfile } from '../types';
import { useAuth } from './authStore';

// ---------------------------------------------------------------------------
// Map PHP API response → internal UserProfile
// PHP stores membership_expiry and trial_expiry as Unix seconds;
// UserProfile uses milliseconds for consistency with created_at.
// ---------------------------------------------------------------------------

function mapApiUser(u: AuthUser): UserProfile {
  return {
    uid:              u.id,
    displayName:      u.display_name,
    phone:            u.phone,
    email:            u.email,
    membership:       u.membership,
    trialUsed:        u.trial_used ?? false,
    trialExpiry:      u.trial_expiry ? u.trial_expiry * 1000 : undefined,
    membershipExpiry: u.membership_expiry ? u.membership_expiry * 1000 : undefined,
    referralCode:     u.referral_code,
    referredBy:       u.referred_by,
    createdAt:        u.created_at,
  };
}

// ---------------------------------------------------------------------------
// Feature access
// ---------------------------------------------------------------------------

function resolveEffectiveTier(profile: UserProfile | null): {
  tier: MembershipTier;
  isTrialActive: boolean;
  trialDaysLeft: number;
} {
  if (!profile) {
    return { tier: 'free', isTrialActive: false, trialDaysLeft: 0 };
  }

  const now = Date.now();

  // Paid plan has a set expiry and it has passed → downgrade to free
  if (profile.membershipExpiry !== undefined && profile.membershipExpiry < now) {
    return { tier: 'free', isTrialActive: false, trialDaysLeft: 0 };
  }

  // Server is authoritative: if the user holds a paid tier (and it hasn't expired above),
  // return it directly. Lifetime plans have no membershipExpiry — that's intentional.
  if (profile.membership === 'premium_lite' || profile.membership === 'premium_full') {
    return { tier: profile.membership, isTrialActive: false, trialDaysLeft: 0 };
  }

  // Free user — check whether an active trial grants premium_full access
  const isTrialActive =
    profile.trialExpiry !== undefined && profile.trialExpiry > now;

  const trialDaysLeft = isTrialActive
    ? Math.ceil((profile.trialExpiry! - now) / (1000 * 60 * 60 * 24))
    : 0;

  const tier: MembershipTier = isTrialActive ? 'premium_full' : 'free';
  return { tier, isTrialActive, trialDaysLeft };
}

function buildCanAccess(
  tier: MembershipTier,
  isTrialActive: boolean,
): (feature: PremiumFeature) => boolean {
  return (feature: PremiumFeature): boolean => {
    if (feature === 'zero_ads') {
      return isTrialActive || tier === 'premium_lite' || tier === 'premium_full';
    }
    return true;
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
  refreshProfile: () => Promise<void>;
}

const MembershipContext = createContext<MembershipContextValue>({
  profile: null,
  tier: 'free',
  isTrialActive: false,
  trialDaysLeft: 0,
  isLoading: true,
  canAccess: () => false,
  refreshProfile: async () => {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function MembershipProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { user, isGuest } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async () => {
    try {
      const apiUser = await AuthApiService.getProfile();
      setProfile(mapApiUser(apiUser));
    } catch {
      // Network error — keep whatever profile we had
    }
  }, []);

  useEffect(() => {
    if (!user || isGuest) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    // Seed from MMKV immediately so premium users aren't shown as free
    // while the API call is in flight or if it fails
    setProfile(prev => prev ?? {
      uid:          user.id,
      displayName:  user.display_name,
      phone:        user.phone,
      membership:   user.membership,
      trialUsed:    user.trial_used ?? false,
      referralCode: user.referral_code ?? '',
      createdAt:    user.created_at ?? 0,
    });

    setIsLoading(true);
    fetchProfile().finally(() => setIsLoading(false));
  }, [user, isGuest, fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user || isGuest) return;
    await fetchProfile();
  }, [user, isGuest, fetchProfile]);

  const { tier, isTrialActive, trialDaysLeft } = resolveEffectiveTier(profile);

  const canAccess = useCallback(
    (feature: PremiumFeature) => buildCanAccess(tier, isTrialActive)(feature),
    [tier, isTrialActive],
  );

  return (
    <MembershipContext.Provider
      value={{ profile, tier, isTrialActive, trialDaysLeft, isLoading, canAccess, refreshProfile }}>
      {children}
    </MembershipContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useMembership(): MembershipContextValue {
  return useContext(MembershipContext);
}
