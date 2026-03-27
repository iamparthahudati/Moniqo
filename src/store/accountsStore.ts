import React, { createContext, useContext, useReducer } from 'react';
import {
  BANK_ACCOUNTS,
  CARD_ACCOUNTS,
  CASH_ENTRIES,
  INVESTMENTS,
} from '../data/mockData';
import { BankAccount, CardAccount, CashEntry, Investment } from '../types';

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
  | { type: 'ADD_CARD'; payload: CardAccount }
  | { type: 'UPDATE_CARD'; payload: CardAccount }
  | { type: 'DELETE_CARD'; payload: { id: string } }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: Investment }
  | { type: 'DELETE_INVESTMENT'; payload: { id: string } }
  | { type: 'ADD_CASH'; payload: CashEntry }
  | { type: 'UPDATE_CASH'; payload: CashEntry }
  | { type: 'DELETE_CASH'; payload: { id: string } };

// ── Initial state ─────────────────────────────────────────────────────────────

const initialState: AccountsState = {
  bankAccounts: BANK_ACCOUNTS,
  cardAccounts: CARD_ACCOUNTS,
  investments: INVESTMENTS,
  cashEntries: CASH_ENTRIES,
};

// ── Reducer ───────────────────────────────────────────────────────────────────

function accountsReducer(
  state: AccountsState,
  action: AccountsAction,
): AccountsState {
  switch (action.type) {
    // Bank accounts
    case 'ADD_BANK':
      return {
        ...state,
        bankAccounts: [
          ...state.bankAccounts,
          { ...action.payload, id: Date.now().toString() },
        ],
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

    // Card accounts
    case 'ADD_CARD':
      return {
        ...state,
        cardAccounts: [
          ...state.cardAccounts,
          { ...action.payload, id: Date.now().toString() },
        ],
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

    // Investments
    case 'ADD_INVESTMENT':
      return {
        ...state,
        investments: [
          ...state.investments,
          { ...action.payload, id: Date.now().toString() },
        ],
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

    // Cash entries
    case 'ADD_CASH':
      return {
        ...state,
        cashEntries: [
          ...state.cashEntries,
          { ...action.payload, id: Date.now().toString() },
        ],
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

// ── Provider ──────────────────────────────────────────────────────────────────

export function AccountsProvider(props: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, dispatch] = useReducer(accountsReducer, initialState);
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
  return bankTotal + investmentTotal + cashTotal;
}
