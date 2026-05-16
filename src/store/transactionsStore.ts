import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Transaction } from '../types';
import { useAuth } from './authStore';
import { TransactionsRepository } from '../db/repositories/transactionsRepository';
import apiClient from '../services/apiClient';

// ── State ─────────────────────────────────────────────────────────────────────

export interface TransactionsState {
  transactions: Transaction[];
}

// ── Actions ───────────────────────────────────────────────────────────────────

export type TransactionsAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: { id: string } }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] };

// ── Context ───────────────────────────────────────────────────────────────────

interface TransactionsContextValue {
  state: TransactionsState;
  dispatch: React.Dispatch<TransactionsAction>;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(
  undefined,
);

// ── Provider ──────────────────────────────────────────────────────────────────

export function TransactionsProvider(props: {
  children: React.ReactNode;
}): React.JSX.Element {
  const { user } = useAuth();
  const [state, setState] = useState<TransactionsState>({ transactions: [] });

  useEffect(() => {
    if (!user) {
      setState({ transactions: [] });
      return;
    }
    TransactionsRepository.init();
    setState({ transactions: TransactionsRepository.getAll() });
  }, [user]);

  const dispatch = useCallback((action: TransactionsAction) => {
    switch (action.type) {

      case 'ADD_TRANSACTION': {
        const tx: Transaction = {
          ...action.payload,
          created_at: action.payload.created_at || Date.now(),
        };
        TransactionsRepository.insert(tx);
        setState(prev => ({ transactions: [tx, ...prev.transactions] }));
        apiClient.post('/transactions', {
          id: tx.id, title: tx.title, subtitle: tx.subtitle, amount: tx.amount,
          type: tx.type, category: tx.category, account_id: tx.account_id,
          account_type: tx.account_type, date: tx.date, time: tx.time,
          note: tx.note, created_at: tx.created_at,
        }).catch(() => {});
        break;
      }

      case 'UPDATE_TRANSACTION': {
        TransactionsRepository.update(action.payload);
        setState(prev => ({
          transactions: prev.transactions.map(t =>
            t.id === action.payload.id ? action.payload : t,
          ),
        }));
        apiClient.put(`/transactions/${action.payload.id}`, {
          title: action.payload.title, subtitle: action.payload.subtitle,
          amount: action.payload.amount, type: action.payload.type,
          category: action.payload.category, account_id: action.payload.account_id,
          account_type: action.payload.account_type, date: action.payload.date,
          time: action.payload.time, note: action.payload.note,
        }).catch(() => {});
        break;
      }

      case 'DELETE_TRANSACTION': {
        TransactionsRepository.delete(action.payload.id);
        setState(prev => ({
          transactions: prev.transactions.filter(t => t.id !== action.payload.id),
        }));
        apiClient.delete(`/transactions/${action.payload.id}`).catch(() => {});
        break;
      }

      case 'SET_TRANSACTIONS':
        setState({ transactions: action.payload });
        break;
    }
  }, []);

  return React.createElement(
    TransactionsContext.Provider,
    { value: { state, dispatch } },
    props.children,
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTransactions(): TransactionsContextValue {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error(
      'useTransactions must be used within a TransactionsProvider',
    );
  }
  return context;
}
