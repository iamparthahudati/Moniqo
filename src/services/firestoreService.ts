import firestore from '@react-native-firebase/firestore';
import { MembershipTier, UserProfile } from '../types';

const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const REFERRAL_REWARD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateReferralCode(uid: string): string {
  const uidSuffix = uid.slice(-6).toUpperCase();
  const random = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `MNQ-${uidSuffix}${random}`.slice(0, 10);
}

function userDoc(uid: string) {
  return firestore().collection('users').doc(uid);
}

function mapDocToProfile(uid: string, data: Record<string, any>): UserProfile {
  return {
    uid,
    displayName: data.displayName ?? '',
    phone: data.phone ?? '',
    email: data.email,
    membership: data.membership as MembershipTier,
    trialUsed: data.trialUsed ?? false,
    trialExpiry: data.trialExpiry,
    membershipExpiry: data.membershipExpiry,
    referralCode: data.referralCode ?? '',
    referredBy: data.referredBy,
    createdAt: data.createdAt ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Creates a user profile document if one does not already exist.
 * New users receive a 3-day premium trial (membership='premium_full', trialUsed=true).
 * Returns the profile (existing or newly created).
 */
export async function ensureUserProfile(
  uid: string,
  displayName: string,
  phone: string,
  email?: string,
): Promise<UserProfile> {
  try {
    const ref = userDoc(uid);
    const snapshot = await ref.get();

    if (snapshot.exists()) {
      return mapDocToProfile(uid, snapshot.data()!);
    }

    const now = Date.now();
    const profileData: Omit<UserProfile, 'uid'> = {
      displayName,
      phone,
      ...(email !== undefined ? { email } : {}),
      membership: 'premium_full',
      trialUsed: true,
      trialExpiry: now + TRIAL_DURATION_MS,
      referralCode: generateReferralCode(uid),
      createdAt: now,
    };

    await ref.set(profileData);

    return { uid, ...profileData };
  } catch (error) {
    console.error('[firestoreService] ensureUserProfile failed:', error);
    throw error;
  }
}

/**
 * Fetches the current user profile from Firestore.
 * Returns null if the document does not exist.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snapshot = await userDoc(uid).get();

    if (!snapshot.exists()) {
      return null;
    }

    return mapDocToProfile(uid, snapshot.data()!);
  } catch (error) {
    console.error('[firestoreService] getUserProfile failed:', error);
    throw error;
  }
}

/**
 * Subscribes to real-time updates on the user profile document.
 * Calls onChange(null) when the document does not exist.
 * Returns the unsubscribe function.
 */
export function subscribeToUserProfile(
  uid: string,
  onChange: (profile: UserProfile | null) => void,
): () => void {
  const unsubscribe = userDoc(uid).onSnapshot(
    snapshot => {
      if (!snapshot.exists()) {
        onChange(null);
        return;
      }
      onChange(mapDocToProfile(uid, snapshot.data()!));
    },
    error => {
      console.error(
        '[firestoreService] subscribeToUserProfile snapshot error:',
        error,
      );
      onChange(null);
    },
  );

  return unsubscribe;
}

/**
 * Updates the membership tier and optional expiry timestamp on the user profile.
 */
export async function updateMembership(
  uid: string,
  tier: MembershipTier,
  expiryMs?: number,
): Promise<void> {
  try {
    const update: Record<string, unknown> = { membership: tier };

    if (expiryMs !== undefined) {
      update.membershipExpiry = expiryMs;
    }

    await userDoc(uid).update(update);
  } catch (error) {
    console.error('[firestoreService] updateMembership failed:', error);
    throw error;
  }
}

/**
 * Applies a referral code entered by a new user.
 * - Finds the referrer whose referralCode matches.
 * - Sets referredBy on the new user's profile.
 * - Extends the referrer's membership to premium_full for 30 days.
 * Returns true if the code was valid and successfully applied, false otherwise.
 */
export async function applyReferralCode(
  newUserUid: string,
  referralCode: string,
): Promise<boolean> {
  try {
    const trimmedCode = referralCode.trim().toUpperCase();

    const querySnapshot = await firestore()
      .collection('users')
      .where('referralCode', '==', trimmedCode)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return false;
    }

    const referrerDoc = querySnapshot.docs[0];
    const referrerUid = referrerDoc.id;

    if (referrerUid === newUserUid) {
      // Users cannot apply their own referral code
      return false;
    }

    const now = Date.now();
    const batch = firestore().batch();

    batch.update(userDoc(newUserUid), { referredBy: trimmedCode });

    batch.update(userDoc(referrerUid), {
      membership: 'premium_full' as MembershipTier,
      membershipExpiry: now + REFERRAL_REWARD_MS,
    });

    await batch.commit();

    return true;
  } catch (error) {
    console.error('[firestoreService] applyReferralCode failed:', error);
    return false;
  }
}
