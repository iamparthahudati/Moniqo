import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  addBank,
  addCard,
  addCash,
  addInvestment,
  deleteBank,
  deleteCard,
  deleteCash,
  deleteInvestment,
  incrementBankBalance,
  incrementCardDue,
  incrementCashBalance,
  incrementInvestmentAmount,
  subscribeToBanks,
  subscribeToCards,
  subscribeToCash,
  subscribeToInvestments,
  updateBank,
  updateCard,
  updateCash,
  updateInvestment,
} from '../services/firestoreService';
import { BankAccount, CardAccount, CashEntry, Investment } from '../types';
import { useAuth } from './authStore';

// ── State ─────────────────────────────────────────────────────────────────────

export interface AccountsState {
  bankAccounts: BankAccount[];
  cardAccounts: CardAccount[];
  investments: Investment[];
  cashEntries: CashEntry[];
}

// ── Actions ───────────────────────────────────────────────────────────────────

export type AccountsAction =
  | { type: 'ADD_BANK'; payload: BankAccount }
  | { type: 'UPDATE_BANK'; payload: BankAccount }
  | { type: 'DELETE_BANK'; payload: { id: string } }
  | { type: 'ADJUST_BANK_BALANCE'; payload: { id: string; delta: number } }
  | { type: 'ADD_CARD'; payload: CardAccount }
  | { type: 'UPDATE_CARD'; payload: CardAccount }
  | { type: 'DELETE_CARD'; payload: { id: string } }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: Investment }
  | { type: 'DELETE_INVESTMENT'; payload: { id: string } }
  | { type: 'ADD_CASH'; payload: CashEntry }
  | { type: 'UPDATE_CASH'; payload: CashEntry }
  | { type: 'DELETE_CASH'; payload: { id: string } }
  | { type: 'ADJUST_CASH_BALANCE'; payload: { id: string; delta: number } }
  | { type: 'ADJUST_CARD_BALANCE'; payload: { id: string; delta: number } }
  | {
      type: 'ADJUST_INVESTMENT_BALANCE';
      payload: { id: string; delta: number };
    };

// ── Reducer ───────────────────────────────────────────────────────────────────
// Kept for reference and potential offline/optimistic-update use.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function accountsReducer(
  state: AccountsState,
  action: AccountsAction,
): AccountsState {
  switch (action.type) {
    // Bank accounts
    case 'ADD_BANK':
      return {
        ...state,
        bankAccounts: [...state.bankAccounts, action.payload],
      };
    case 'UPDATE_BANK':
      return {
        ...state,
        bankAccounts: state.bankAccounts.map(item =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case 'DELETE_BANK':
      return {
        ...state,
        bankAccounts: state.bankAccounts.filter(
          item => item.id !== action.payload.id,
        ),
      };
    case 'ADJUST_BANK_BALANCE':
      return {
        ...state,
        bankAccounts: state.bankAccounts.map(item =>
          item.id === action.payload.id
            ? { ...item, balance: item.balance + action.payload.delta }
            : item,
        ),
      };

    // Card accounts
    case 'ADD_CARD':
      return {
        ...state,
        cardAccounts: [...state.cardAccounts, action.payload],
      };
    case 'UPDATE_CARD':
      return {
        ...state,
        cardAccounts: state.cardAccounts.map(item =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case 'DELETE_CARD':
      return {
        ...state,
        cardAccounts: state.cardAccounts.filter(
          item => item.id !== action.payload.id,
        ),
      };

    case 'ADJUST_CARD_BALANCE':
      return {
        ...state,
        cardAccounts: state.cardAccounts.map(item =>
          item.id === action.payload.id
            ? { ...item, dueAmount: item.dueAmount + action.payload.delta }
            : item,
        ),
      };

    // Investments
    case 'ADD_INVESTMENT':
      return {
        ...state,
        investments: [...state.investments, action.payload],
      };
    case 'UPDATE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map(item =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case 'DELETE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.filter(
          item => item.id !== action.payload.id,
        ),
      };
    case 'ADJUST_INVESTMENT_BALANCE':
      return {
        ...state,
        investments: state.investments.map(item =>
          item.id === action.payload.id
            ? { ...item, amount: item.amount + action.payload.delta }
            : item,
        ),
      };

    // Cash entries
    case 'ADD_CASH':
      return {
        ...state,
        cashEntries: [...state.cashEntries, action.payload],
      };
    case 'UPDATE_CASH':
      return {
        ...state,
        cashEntries: state.cashEntries.map(item =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    case 'DELETE_CASH':
      return {
        ...state,
        cashEntries: state.cashEntries.filter(
          item => item.id !== action.payload.id,
        ),
      };
    case 'ADJUST_CASH_BALANCE':
      return {
        ...state,
        cashEntries: state.cashEntries.map(item =>
          item.id === action.payload.id
            ? { ...item, amount: item.amount + action.payload.delta }
            : item,
        ),
      };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface AccountsContextValue {
  state: AccountsState;
  dispatch: React.Dispatch<AccountsAction>;
}

const AccountsContext = createContext<AccountsContextValue | undefined>(
  undefined,
);

// ── Empty state ───────────────────────────────────────────────────────────────

const EMPTY_STATE: AccountsState = {
  bankAccounts: [],
  cardAccounts: [],
  investments: [],
  cashEntries: [],
};

// ── Provider ──────────────────────────────────────────────────────────────────

export function AccountsProvider(props: {
  children: React.ReactNode;
}): React.JSX.Element {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [state, setState] = useState<AccountsState>(EMPTY_STATE);

  // Keep uid in a ref so the dispatch closure always sees the latest value
  // without needing to be recreated on every uid change.
  const uidRef = useRef<string | null>(uid);
  useEffect(() => {
    uidRef.current = uid;
  }, [uid]);

  // ── Firestore onSnapshot subscriptions ──────────────────────────────────────

  useEffect(() => {
    if (!uid) {
      setState(EMPTY_STATE);
      return;
    }

    const unsubBanks = subscribeToBanks(uid, bankAccounts =>
      setState(prev => ({ ...prev, bankAccounts })),
    );

    const unsubCards = subscribeToCards(uid, cardAccounts =>
      setState(prev => ({ ...prev, cardAccounts })),
    );

    const unsubCash = subscribeToCash(uid, cashEntries =>
      setState(prev => ({ ...prev, cashEntries })),
    );

    const unsubInvestments = subscribeToInvestments(uid, investments =>
      setState(prev => ({ ...prev, investments })),
    );

    return () => {
      unsubBanks();
      unsubCards();
      unsubCash();
      unsubInvestments();
    };
  }, [uid]);

  // ── Dispatch — maps actions to Firestore writes (fire-and-forget) ────────────

  const dispatch = useCallback((action: AccountsAction) => {
    const currentUid = uidRef.current;
    if (!currentUid) {
      return; // guest mode — no-op
    }

    switch (action.type) {
      // Bank
      case 'ADD_BANK': {
        const { id: _id, ...rest } = action.payload;
        addBank(currentUid, rest);
        break;
      }
      case 'UPDATE_BANK':
        updateBank(currentUid, action.payload);
        break;
      case 'DELETE_BANK':
        deleteBank(currentUid, action.payload.id);
        break;
      case 'ADJUST_BANK_BALANCE':
        incrementBankBalance(
          currentUid,
          action.payload.id,
          action.payload.delta,
        );
        break;

      // Card
      case 'ADD_CARD': {
        const { id: _id, ...rest } = action.payload;
        addCard(currentUid, rest);
        break;
      }
      case 'UPDATE_CARD':
        updateCard(currentUid, action.payload);
        break;
      case 'DELETE_CARD':
        deleteCard(currentUid, action.payload.id);
        break;
      case 'ADJUST_CARD_BALANCE':
        incrementCardDue(currentUid, action.payload.id, action.payload.delta);
        break;

      // Cash
      case 'ADD_CASH': {
        const { id: _id, ...rest } = action.payload;
        addCash(currentUid, rest);
        break;
      }
      case 'UPDATE_CASH':
        updateCash(currentUid, action.payload);
        break;
      case 'DELETE_CASH':
        deleteCash(currentUid, action.payload.id);
        break;
      case 'ADJUST_CASH_BALANCE':
        incrementCashBalance(
          currentUid,
          action.payload.id,
          action.payload.delta,
        );
        break;

      // Investment
      case 'ADD_INVESTMENT': {
        const { id: _id, ...rest } = action.payload;
        addInvestment(currentUid, rest);
        break;
      }
      case 'UPDATE_INVESTMENT':
        updateInvestment(currentUid, action.payload);
        break;
      case 'DELETE_INVESTMENT':
        deleteInvestment(currentUid, action.payload.id);
        break;
      case 'ADJUST_INVESTMENT_BALANCE':
        incrementInvestmentAmount(
          currentUid,
          action.payload.id,
          action.payload.delta,
        );
        break;
    }
  }, []);

  return React.createElement(
    AccountsContext.Provider,
    { value: { state, dispatch } },
    props.children,
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAccounts(): AccountsContextValue {
  const context = useContext(AccountsContext);
  if (context === undefined) {
    throw new Error('useAccounts must be used within an AccountsProvider');
  }
  return context;
}

// ── Selectors ─────────────────────────────────────────────────────────────────

export function computeTotalBalance(state: AccountsState): number {
  const bankTotal = state.bankAccounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );
  const investmentTotal = state.investments.reduce(
    (sum, investment) => sum + investment.amount,
    0,
  );
  const cashTotal = state.cashEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );
  const cardTotal = state.cardAccounts.reduce(
    (sum, card) => sum + card.dueAmount,
    0,
  );
  return bankTotal + investmentTotal + cashTotal - cardTotal;
}
