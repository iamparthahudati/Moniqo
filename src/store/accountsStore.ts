import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import { generateId, initDatabase } from '../db/database';
import * as bankRepo from '../db/repositories/bankRepository';
import * as cardRepo from '../db/repositories/cardRepository';
import * as cashRepo from '../db/repositories/cashRepository';
import * as investmentRepo from '../db/repositories/investmentRepository';
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

// ── Load initial state from SQLite ────────────────────────────────────────────

function loadInitialState(): AccountsState {
  initDatabase();
  return {
    bankAccounts: bankRepo.getAllBanks(),
    cardAccounts: cardRepo.getAllCards(),
    investments: investmentRepo.getAllInvestments(),
    cashEntries: cashRepo.getAllCash(),
  };
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AccountsProvider(props: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, rawDispatch] = useReducer(
    accountsReducer,
    undefined,
    loadInitialState,
  );

  const dispatch = useCallback((action: AccountsAction) => {
    // Persist to SQLite, generating IDs for new entities
    switch (action.type) {
      case 'ADD_BANK': {
        const payload = {
          ...action.payload,
          id: action.payload.id || generateId(),
          created_at: action.payload.created_at ?? Date.now(),
        };
        bankRepo.insertBank(payload);
        rawDispatch({ type: 'ADD_BANK', payload });
        return;
      }
      case 'UPDATE_BANK':
        bankRepo.updateBank(action.payload);
        break;
      case 'DELETE_BANK':
        bankRepo.deleteBank(action.payload.id);
        break;
      case 'ADJUST_BANK_BALANCE':
        bankRepo.updateBankBalance(action.payload.id, action.payload.delta);
        break;

      case 'ADD_CARD': {
        const payload = {
          ...action.payload,
          id: action.payload.id || generateId(),
          created_at: action.payload.created_at ?? Date.now(),
        };
        cardRepo.insertCard(payload);
        rawDispatch({ type: 'ADD_CARD', payload });
        return;
      }
      case 'UPDATE_CARD':
        cardRepo.updateCard(action.payload);
        break;
      case 'DELETE_CARD':
        cardRepo.deleteCard(action.payload.id);
        break;
      case 'ADJUST_CARD_BALANCE':
        cardRepo.updateCardDue(action.payload.id, action.payload.delta);
        break;

      case 'ADD_INVESTMENT': {
        const payload = {
          ...action.payload,
          id: action.payload.id || generateId(),
          created_at: action.payload.created_at ?? Date.now(),
        };
        investmentRepo.insertInvestment(payload);
        rawDispatch({ type: 'ADD_INVESTMENT', payload });
        return;
      }
      case 'UPDATE_INVESTMENT':
        investmentRepo.updateInvestment(action.payload);
        break;
      case 'DELETE_INVESTMENT':
        investmentRepo.deleteInvestment(action.payload.id);
        break;
      case 'ADJUST_INVESTMENT_BALANCE':
        investmentRepo.updateInvestmentAmount(
          action.payload.id,
          action.payload.delta,
        );
        break;

      case 'ADD_CASH': {
        const payload = {
          ...action.payload,
          id: action.payload.id || generateId(),
          created_at: action.payload.created_at ?? Date.now(),
        };
        cashRepo.insertCash(payload);
        rawDispatch({ type: 'ADD_CASH', payload });
        return;
      }
      case 'UPDATE_CASH':
        cashRepo.updateCash(action.payload);
        break;
      case 'DELETE_CASH':
        cashRepo.deleteCash(action.payload.id);
        break;
      case 'ADJUST_CASH_BALANCE':
        cashRepo.updateCashBalance(action.payload.id, action.payload.delta);
        break;
    }
    rawDispatch(action);
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
