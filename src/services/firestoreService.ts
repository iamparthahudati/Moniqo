import firestore from '@react-native-firebase/firestore';
import {
  AppCategory,
  BankAccount,
  CardAccount,
  CashEntry,
  Investment,
  MembershipTier,
  Transaction,
  UserProfile,
} from '../types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const REFERRAL_REWARD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const COL = {
  BANK: 'accounts_bank',
  CARD: 'accounts_card',
  CASH: 'accounts_cash',
  INVESTMENT: 'accounts_investment',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
} as const;

// ---------------------------------------------------------------------------
// Default categories
// ---------------------------------------------------------------------------

type DefaultCategoryDef = Omit<AppCategory, 'id' | 'created_at'>;

const DEFAULT_CATEGORIES: DefaultCategoryDef[] = [
  // expense
  {
    name: 'Food',
    emoji: '🍴',
    type: 'expense',
    color: '#EF4444',
    isDefault: true,
    sortOrder: 0,
  },
  {
    name: 'Shopping',
    emoji: '🛒',
    type: 'expense',
    color: '#3B82F6',
    isDefault: true,
    sortOrder: 1,
  },
  {
    name: 'Transport',
    emoji: '🚗',
    type: 'expense',
    color: '#F97316',
    isDefault: true,
    sortOrder: 2,
  },
  {
    name: 'Bills',
    emoji: '🧾',
    type: 'expense',
    color: '#8B5CF6',
    isDefault: true,
    sortOrder: 3,
  },
  {
    name: 'Health',
    emoji: '🏥',
    type: 'expense',
    color: '#14B8A6',
    isDefault: true,
    sortOrder: 4,
  },
  {
    name: 'Entertainment',
    emoji: '🎫',
    type: 'expense',
    color: '#EC4899',
    isDefault: true,
    sortOrder: 5,
  },
  {
    name: 'Utilities',
    emoji: '⚡',
    type: 'expense',
    color: '#F59E0B',
    isDefault: true,
    sortOrder: 6,
  },
  {
    name: 'Others',
    emoji: '📋',
    type: 'expense',
    color: '#94A3B8',
    isDefault: true,
    sortOrder: 7,
  },
  // income
  {
    name: 'Salary',
    emoji: '💰',
    type: 'income',
    color: '#22C55E',
    isDefault: true,
    sortOrder: 0,
  },
  {
    name: 'Freelance',
    emoji: '💻',
    type: 'income',
    color: '#3B82F6',
    isDefault: true,
    sortOrder: 1,
  },
  {
    name: 'Investment',
    emoji: '📈',
    type: 'income',
    color: '#8B5CF6',
    isDefault: true,
    sortOrder: 2,
  },
  {
    name: 'Gift',
    emoji: '🎁',
    type: 'income',
    color: '#EC4899',
    isDefault: true,
    sortOrder: 3,
  },
  {
    name: 'Others',
    emoji: '📋',
    type: 'income',
    color: '#94A3B8',
    isDefault: true,
    sortOrder: 4,
  },
];

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

function subCol(uid: string, name: string) {
  return userDoc(uid).collection(name);
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

function mapDocToBank(data: Record<string, any>): BankAccount {
  return {
    id: data.id ?? '',
    bankName: data.bankName ?? '',
    accountType: data.accountType ?? '',
    balance: data.balance ?? 0,
    color: data.color ?? '',
    status: data.status ?? 'ACTIVE',
    icon: data.icon ?? 'bank',
    note: data.note,
    created_at: data.created_at ?? 0,
  };
}

function mapDocToCard(data: Record<string, any>): CardAccount {
  return {
    id: data.id ?? '',
    cardName: data.cardName ?? '',
    cardType: data.cardType ?? '',
    dueAmount: data.dueAmount ?? 0,
    dueLabel: data.dueLabel ?? '',
    color: data.color ?? '',
    note: data.note,
    created_at: data.created_at ?? 0,
  };
}

function mapDocToCash(data: Record<string, any>): CashEntry {
  return {
    id: data.id ?? '',
    label: data.label ?? '',
    sublabel: data.sublabel ?? '',
    amount: data.amount ?? 0,
    created_at: data.created_at ?? 0,
  };
}

function mapDocToInvestment(data: Record<string, any>): Investment {
  return {
    id: data.id ?? '',
    name: data.name ?? '',
    amount: data.amount ?? 0,
    icon: data.icon ?? 'other',
    color: data.color ?? '',
    note: data.note,
    created_at: data.created_at ?? 0,
  };
}

function mapDocToTransaction(data: Record<string, any>): Transaction {
  return {
    id: data.id ?? '',
    title: data.title ?? '',
    subtitle: data.subtitle ?? '',
    amount: data.amount ?? 0,
    type: data.type ?? 'expense',
    category: data.category ?? '',
    account_id: data.account_id,
    account_type: data.account_type,
    date: data.date ?? '',
    time: data.time ?? '',
    note: data.note,
    created_at: data.created_at ?? 0,
  };
}

function mapDocToCategory(data: Record<string, any>): AppCategory {
  return {
    id: data.id ?? '',
    name: data.name ?? '',
    emoji: data.emoji ?? '',
    type: data.type ?? 'expense',
    color: data.color ?? '',
    isDefault: data.isDefault ?? false,
    sortOrder: data.sortOrder ?? 0,
    created_at: data.created_at ?? 0,
  };
}

// ---------------------------------------------------------------------------
// User Profile
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
  return userDoc(uid).onSnapshot(
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

// ---------------------------------------------------------------------------
// Bank Accounts
// ---------------------------------------------------------------------------

export function subscribeToBanks(
  uid: string,
  onChange: (accounts: BankAccount[]) => void,
): () => void {
  return subCol(uid, COL.BANK).onSnapshot(
    snapshot => {
      const accounts = snapshot.docs.map(doc => mapDocToBank(doc.data()));
      onChange(accounts);
    },
    error => {
      console.error(
        '[firestoreService] subscribeToBanks snapshot error:',
        error,
      );
      onChange([]);
    },
  );
}

export async function addBank(
  uid: string,
  account: Omit<BankAccount, 'id'>,
): Promise<void> {
  try {
    const ref = subCol(uid, COL.BANK).doc();
    await ref.set({ ...account, id: ref.id });
  } catch (error) {
    console.error('[firestoreService] addBank failed:', error);
    throw error;
  }
}

export async function updateBank(
  uid: string,
  account: BankAccount,
): Promise<void> {
  try {
    await subCol(uid, COL.BANK).doc(account.id).set(account, { merge: true });
  } catch (error) {
    console.error('[firestoreService] updateBank failed:', error);
    throw error;
  }
}

export async function deleteBank(uid: string, id: string): Promise<void> {
  try {
    await subCol(uid, COL.BANK).doc(id).delete();
  } catch (error) {
    console.error('[firestoreService] deleteBank failed:', error);
    throw error;
  }
}

export async function incrementBankBalance(
  uid: string,
  id: string,
  delta: number,
): Promise<void> {
  try {
    await subCol(uid, COL.BANK)
      .doc(id)
      .update({
        balance: firestore.FieldValue.increment(delta),
      });
  } catch (error) {
    console.error('[firestoreService] incrementBankBalance failed:', error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Card Accounts
// ---------------------------------------------------------------------------

export function subscribeToCards(
  uid: string,
  onChange: (cards: CardAccount[]) => void,
): () => void {
  return subCol(uid, COL.CARD).onSnapshot(
    snapshot => {
      const cards = snapshot.docs.map(doc => mapDocToCard(doc.data()));
      onChange(cards);
    },
    error => {
      console.error(
        '[firestoreService] subscribeToCards snapshot error:',
        error,
      );
      onChange([]);
    },
  );
}

export async function addCard(
  uid: string,
  card: Omit<CardAccount, 'id'>,
): Promise<void> {
  try {
    const ref = subCol(uid, COL.CARD).doc();
    await ref.set({ ...card, id: ref.id });
  } catch (error) {
    console.error('[firestoreService] addCard failed:', error);
    throw error;
  }
}

export async function updateCard(
  uid: string,
  card: CardAccount,
): Promise<void> {
  try {
    await subCol(uid, COL.CARD).doc(card.id).set(card, { merge: true });
  } catch (error) {
    console.error('[firestoreService] updateCard failed:', error);
    throw error;
  }
}

export async function deleteCard(uid: string, id: string): Promise<void> {
  try {
    await subCol(uid, COL.CARD).doc(id).delete();
  } catch (error) {
    console.error('[firestoreService] deleteCard failed:', error);
    throw error;
  }
}

export async function incrementCardDue(
  uid: string,
  id: string,
  delta: number,
): Promise<void> {
  try {
    await subCol(uid, COL.CARD)
      .doc(id)
      .update({
        dueAmount: firestore.FieldValue.increment(delta),
      });
  } catch (error) {
    console.error('[firestoreService] incrementCardDue failed:', error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Cash Entries
// ---------------------------------------------------------------------------

export function subscribeToCash(
  uid: string,
  onChange: (entries: CashEntry[]) => void,
): () => void {
  return subCol(uid, COL.CASH).onSnapshot(
    snapshot => {
      const entries = snapshot.docs.map(doc => mapDocToCash(doc.data()));
      onChange(entries);
    },
    error => {
      console.error(
        '[firestoreService] subscribeToCash snapshot error:',
        error,
      );
      onChange([]);
    },
  );
}

export async function addCash(
  uid: string,
  entry: Omit<CashEntry, 'id'>,
): Promise<void> {
  try {
    const ref = subCol(uid, COL.CASH).doc();
    await ref.set({ ...entry, id: ref.id });
  } catch (error) {
    console.error('[firestoreService] addCash failed:', error);
    throw error;
  }
}

export async function updateCash(uid: string, entry: CashEntry): Promise<void> {
  try {
    await subCol(uid, COL.CASH).doc(entry.id).set(entry, { merge: true });
  } catch (error) {
    console.error('[firestoreService] updateCash failed:', error);
    throw error;
  }
}

export async function deleteCash(uid: string, id: string): Promise<void> {
  try {
    await subCol(uid, COL.CASH).doc(id).delete();
  } catch (error) {
    console.error('[firestoreService] deleteCash failed:', error);
    throw error;
  }
}

export async function incrementCashBalance(
  uid: string,
  id: string,
  delta: number,
): Promise<void> {
  try {
    await subCol(uid, COL.CASH)
      .doc(id)
      .update({
        amount: firestore.FieldValue.increment(delta),
      });
  } catch (error) {
    console.error('[firestoreService] incrementCashBalance failed:', error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Investments
// ---------------------------------------------------------------------------

export function subscribeToInvestments(
  uid: string,
  onChange: (investments: Investment[]) => void,
): () => void {
  return subCol(uid, COL.INVESTMENT).onSnapshot(
    snapshot => {
      const investments = snapshot.docs.map(doc =>
        mapDocToInvestment(doc.data()),
      );
      onChange(investments);
    },
    error => {
      console.error(
        '[firestoreService] subscribeToInvestments snapshot error:',
        error,
      );
      onChange([]);
    },
  );
}

export async function addInvestment(
  uid: string,
  inv: Omit<Investment, 'id'>,
): Promise<void> {
  try {
    const ref = subCol(uid, COL.INVESTMENT).doc();
    await ref.set({ ...inv, id: ref.id });
  } catch (error) {
    console.error('[firestoreService] addInvestment failed:', error);
    throw error;
  }
}

export async function updateInvestment(
  uid: string,
  inv: Investment,
): Promise<void> {
  try {
    await subCol(uid, COL.INVESTMENT).doc(inv.id).set(inv, { merge: true });
  } catch (error) {
    console.error('[firestoreService] updateInvestment failed:', error);
    throw error;
  }
}

export async function deleteInvestment(uid: string, id: string): Promise<void> {
  try {
    await subCol(uid, COL.INVESTMENT).doc(id).delete();
  } catch (error) {
    console.error('[firestoreService] deleteInvestment failed:', error);
    throw error;
  }
}

export async function incrementInvestmentAmount(
  uid: string,
  id: string,
  delta: number,
): Promise<void> {
  try {
    await subCol(uid, COL.INVESTMENT)
      .doc(id)
      .update({
        amount: firestore.FieldValue.increment(delta),
      });
  } catch (error) {
    console.error(
      '[firestoreService] incrementInvestmentAmount failed:',
      error,
    );
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

export function subscribeToTransactions(
  uid: string,
  onChange: (transactions: Transaction[]) => void,
): () => void {
  return subCol(uid, COL.TRANSACTIONS)
    .orderBy('date', 'desc')
    .orderBy('created_at', 'desc')
    .onSnapshot(
      snapshot => {
        const transactions = snapshot.docs.map(doc =>
          mapDocToTransaction(doc.data()),
        );
        onChange(transactions);
      },
      error => {
        console.error(
          '[firestoreService] subscribeToTransactions snapshot error:',
          error,
        );
        onChange([]);
      },
    );
}

export async function addTransaction(
  uid: string,
  tx: Omit<Transaction, 'id'>,
): Promise<void> {
  try {
    const ref = subCol(uid, COL.TRANSACTIONS).doc();
    await ref.set({ ...tx, id: ref.id });
  } catch (error) {
    console.error('[firestoreService] addTransaction failed:', error);
    throw error;
  }
}

export async function updateTransaction(
  uid: string,
  tx: Transaction,
): Promise<void> {
  try {
    await subCol(uid, COL.TRANSACTIONS).doc(tx.id).set(tx, { merge: true });
  } catch (error) {
    console.error('[firestoreService] updateTransaction failed:', error);
    throw error;
  }
}

export async function deleteTransaction(
  uid: string,
  id: string,
): Promise<void> {
  try {
    await subCol(uid, COL.TRANSACTIONS).doc(id).delete();
  } catch (error) {
    console.error('[firestoreService] deleteTransaction failed:', error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export function subscribeToCategories(
  uid: string,
  onChange: (categories: AppCategory[]) => void,
): () => void {
  return subCol(uid, COL.CATEGORIES)
    .orderBy('sortOrder', 'asc')
    .onSnapshot(
      snapshot => {
        const categories = snapshot.docs.map(doc =>
          mapDocToCategory(doc.data()),
        );
        onChange(categories);
      },
      error => {
        console.error(
          '[firestoreService] subscribeToCategories snapshot error:',
          error,
        );
        onChange([]);
      },
    );
}

export async function addCategory(
  uid: string,
  cat: Omit<AppCategory, 'id'>,
): Promise<void> {
  try {
    const ref = subCol(uid, COL.CATEGORIES).doc();
    await ref.set({ ...cat, id: ref.id });
  } catch (error) {
    console.error('[firestoreService] addCategory failed:', error);
    throw error;
  }
}

export async function deleteCategory(uid: string, id: string): Promise<void> {
  try {
    await subCol(uid, COL.CATEGORIES).doc(id).delete();
  } catch (error) {
    console.error('[firestoreService] deleteCategory failed:', error);
    throw error;
  }
}

/**
 * Seeds the default categories for a user only if the categories collection is empty.
 * Uses a batch write for all 13 default categories.
 */
export async function seedDefaultCategories(uid: string): Promise<void> {
  try {
    const col = subCol(uid, COL.CATEGORIES);
    const existing = await col.limit(1).get();

    if (!existing.empty) {
      return;
    }

    const now = Date.now();
    const batch = firestore().batch();

    for (const def of DEFAULT_CATEGORIES) {
      const ref = col.doc();
      const category: AppCategory = { ...def, id: ref.id, created_at: now };
      batch.set(ref, category);
    }

    await batch.commit();
  } catch (error) {
    console.error('[firestoreService] seedDefaultCategories failed:', error);
    throw error;
  }
}
