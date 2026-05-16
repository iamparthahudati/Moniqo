import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BankAccount, CardAccount, CashEntry, Investment } from '../types';
import { BankRepository } from '../db/repositories/bankRepository';
import { CardRepository } from '../db/repositories/cardRepository';
import { CashRepository } from '../db/repositories/cashRepository';
import { InvestmentRepository } from '../db/repositories/investmentRepository';
import apiClient from '../services/apiClient';

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

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
  | { type: 'ADJUST_CARD_BALANCE'; payload: { id: string; delta: number } }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: Investment }
  | { type: 'DELETE_INVESTMENT'; payload: { id: string } }
  | { type: 'ADJUST_INVESTMENT_BALANCE'; payload: { id: string; delta: number } }
  | { type: 'ADD_CASH'; payload: CashEntry }
  | { type: 'UPDATE_CASH'; payload: CashEntry }
  | { type: 'DELETE_CASH'; payload: { id: string } }
  | { type: 'ADJUST_CASH_BALANCE'; payload: { id: string; delta: number } };

// ── Context ───────────────────────────────────────────────────────────────────

interface AccountsContextValue {
  state: AccountsState;
  dispatch: React.Dispatch<AccountsAction>;
}

const AccountsContext = createContext<AccountsContextValue | undefined>(undefined);

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
  const [state, setState] = useState<AccountsState>(EMPTY_STATE);

  const stateRef = useRef(state);

  useEffect(() => { stateRef.current = state; }, [state]);

  // Initialize tables and load all accounts from SQLite on mount
  useEffect(() => {
    BankRepository.init();
    CardRepository.init();
    CashRepository.init();
    InvestmentRepository.init();

    setState({
      bankAccounts: BankRepository.getAll(),
      cardAccounts: CardRepository.getAll(),
      investments:  InvestmentRepository.getAll(),
      cashEntries:  CashRepository.getAll(),
    });
  }, []);

  const dispatch = useCallback((action: AccountsAction) => {
    switch (action.type) {

      // ── Bank ────────────────────────────────────────────────────────────────

      case 'ADD_BANK': {
        const account: BankAccount = {
          ...action.payload,
          id:         action.payload.id || generateId(),
          created_at: action.payload.created_at || Date.now(),
        };
        BankRepository.insert(account);
        setState(prev => ({ ...prev, bankAccounts: [account, ...prev.bankAccounts] }));
        apiClient.post('/accounts/bank', {
          id: account.id, bank_name: account.bankName, account_type: account.accountType,
          balance: account.balance, color: account.color, icon: account.icon,
          status: account.status, note: account.note, created_at: account.created_at,
        }).catch(() => {});
        break;
      }
      case 'UPDATE_BANK': {
        BankRepository.update(action.payload);
        setState(prev => ({
          ...prev,
          bankAccounts: prev.bankAccounts.map(b =>
            b.id === action.payload.id ? action.payload : b,
          ),
        }));
        apiClient.put(`/accounts/bank/${action.payload.id}`, {
          bank_name: action.payload.bankName, account_type: action.payload.accountType,
          balance: action.payload.balance, color: action.payload.color,
          icon: action.payload.icon, status: action.payload.status, note: action.payload.note,
        }).catch(() => {});
        break;
      }
      case 'DELETE_BANK': {
        BankRepository.delete(action.payload.id);
        setState(prev => ({
          ...prev,
          bankAccounts: prev.bankAccounts.filter(b => b.id !== action.payload.id),
        }));
        apiClient.delete(`/accounts/bank/${action.payload.id}`).catch(() => {});
        break;
      }
      case 'ADJUST_BANK_BALANCE': {
        BankRepository.adjustBalance(action.payload.id, action.payload.delta);
        const current = stateRef.current.bankAccounts.find(b => b.id === action.payload.id);
        const newBalance = (current?.balance ?? 0) + action.payload.delta;
        setState(prev => ({
          ...prev,
          bankAccounts: prev.bankAccounts.map(b =>
            b.id === action.payload.id ? { ...b, balance: newBalance } : b,
          ),
        }));
        apiClient.put(`/accounts/bank/${action.payload.id}`, { balance: newBalance }).catch(() => {});
        break;
      }

      // ── Card ────────────────────────────────────────────────────────────────

      case 'ADD_CARD': {
        const account: CardAccount = {
          ...action.payload,
          id:         action.payload.id || generateId(),
          created_at: action.payload.created_at || Date.now(),
        };
        CardRepository.insert(account);
        setState(prev => ({ ...prev, cardAccounts: [account, ...prev.cardAccounts] }));
        apiClient.post('/accounts/card', {
          id: account.id, card_name: account.cardName, card_type: account.cardType,
          due_amount: account.dueAmount, due_label: account.dueLabel,
          color: account.color, note: account.note, created_at: account.created_at,
        }).catch(() => {});
        break;
      }
      case 'UPDATE_CARD': {
        CardRepository.update(action.payload);
        setState(prev => ({
          ...prev,
          cardAccounts: prev.cardAccounts.map(c =>
            c.id === action.payload.id ? action.payload : c,
          ),
        }));
        apiClient.put(`/accounts/card/${action.payload.id}`, {
          card_name: action.payload.cardName, card_type: action.payload.cardType,
          due_amount: action.payload.dueAmount, due_label: action.payload.dueLabel,
          color: action.payload.color, note: action.payload.note,
        }).catch(() => {});
        break;
      }
      case 'DELETE_CARD': {
        CardRepository.delete(action.payload.id);
        setState(prev => ({
          ...prev,
          cardAccounts: prev.cardAccounts.filter(c => c.id !== action.payload.id),
        }));
        apiClient.delete(`/accounts/card/${action.payload.id}`).catch(() => {});
        break;
      }
      case 'ADJUST_CARD_BALANCE': {
        CardRepository.adjustDue(action.payload.id, action.payload.delta);
        const current = stateRef.current.cardAccounts.find(c => c.id === action.payload.id);
        const newDue = (current?.dueAmount ?? 0) + action.payload.delta;
        setState(prev => ({
          ...prev,
          cardAccounts: prev.cardAccounts.map(c =>
            c.id === action.payload.id ? { ...c, dueAmount: newDue } : c,
          ),
        }));
        apiClient.put(`/accounts/card/${action.payload.id}`, { due_amount: newDue }).catch(() => {});
        break;
      }

      // ── Investment ──────────────────────────────────────────────────────────

      case 'ADD_INVESTMENT': {
        const account: Investment = {
          ...action.payload,
          id:         action.payload.id || generateId(),
          created_at: action.payload.created_at || Date.now(),
        };
        InvestmentRepository.insert(account);
        setState(prev => ({ ...prev, investments: [account, ...prev.investments] }));
        apiClient.post('/accounts/investment', {
          id: account.id, name: account.name, amount: account.amount,
          icon: account.icon, color: account.color, note: account.note,
          created_at: account.created_at,
        }).catch(() => {});
        break;
      }
      case 'UPDATE_INVESTMENT': {
        InvestmentRepository.update(action.payload);
        setState(prev => ({
          ...prev,
          investments: prev.investments.map(i =>
            i.id === action.payload.id ? action.payload : i,
          ),
        }));
        apiClient.put(`/accounts/investment/${action.payload.id}`, {
          name: action.payload.name, amount: action.payload.amount,
          icon: action.payload.icon, color: action.payload.color, note: action.payload.note,
        }).catch(() => {});
        break;
      }
      case 'DELETE_INVESTMENT': {
        InvestmentRepository.delete(action.payload.id);
        setState(prev => ({
          ...prev,
          investments: prev.investments.filter(i => i.id !== action.payload.id),
        }));
        apiClient.delete(`/accounts/investment/${action.payload.id}`).catch(() => {});
        break;
      }
      case 'ADJUST_INVESTMENT_BALANCE': {
        InvestmentRepository.adjustAmount(action.payload.id, action.payload.delta);
        const current = stateRef.current.investments.find(i => i.id === action.payload.id);
        const newAmount = (current?.amount ?? 0) + action.payload.delta;
        setState(prev => ({
          ...prev,
          investments: prev.investments.map(i =>
            i.id === action.payload.id ? { ...i, amount: newAmount } : i,
          ),
        }));
        apiClient.put(`/accounts/investment/${action.payload.id}`, { amount: newAmount }).catch(() => {});
        break;
      }

      // ── Cash ────────────────────────────────────────────────────────────────

      case 'ADD_CASH': {
        const entry: CashEntry = {
          ...action.payload,
          id:         action.payload.id || generateId(),
          created_at: action.payload.created_at || Date.now(),
        };
        CashRepository.insert(entry);
        setState(prev => ({ ...prev, cashEntries: [entry, ...prev.cashEntries] }));
        apiClient.post('/accounts/cash', {
          id: entry.id, label: entry.label, sublabel: entry.sublabel,
          amount: entry.amount, created_at: entry.created_at,
        }).catch(() => {});
        break;
      }
      case 'UPDATE_CASH': {
        CashRepository.update(action.payload);
        setState(prev => ({
          ...prev,
          cashEntries: prev.cashEntries.map(e =>
            e.id === action.payload.id ? action.payload : e,
          ),
        }));
        apiClient.put(`/accounts/cash/${action.payload.id}`, {
          label: action.payload.label, sublabel: action.payload.sublabel,
          amount: action.payload.amount,
        }).catch(() => {});
        break;
      }
      case 'DELETE_CASH': {
        CashRepository.delete(action.payload.id);
        setState(prev => ({
          ...prev,
          cashEntries: prev.cashEntries.filter(e => e.id !== action.payload.id),
        }));
        apiClient.delete(`/accounts/cash/${action.payload.id}`).catch(() => {});
        break;
      }
      case 'ADJUST_CASH_BALANCE': {
        CashRepository.adjustAmount(action.payload.id, action.payload.delta);
        const current = stateRef.current.cashEntries.find(e => e.id === action.payload.id);
        const newAmount = (current?.amount ?? 0) + action.payload.delta;
        setState(prev => ({
          ...prev,
          cashEntries: prev.cashEntries.map(e =>
            e.id === action.payload.id ? { ...e, amount: newAmount } : e,
          ),
        }));
        apiClient.put(`/accounts/cash/${action.payload.id}`, { amount: newAmount }).catch(() => {});
        break;
      }
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
  const bankTotal = state.bankAccounts.reduce((sum, a) => sum + a.balance, 0);
  const investmentTotal = state.investments.reduce((sum, i) => sum + i.amount, 0);
  const cashTotal = state.cashEntries.reduce((sum, e) => sum + e.amount, 0);
  const cardTotal = state.cardAccounts.reduce((sum, c) => sum + c.dueAmount, 0);
  return bankTotal + investmentTotal + cashTotal - cardTotal;
}
