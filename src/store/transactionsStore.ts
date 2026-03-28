import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import { generateId, initDatabase } from '../db/database';
import * as txRepo from '../db/repositories/transactionRepository';
import { Transaction } from '../types';

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

// ── Reducer ───────────────────────────────────────────────────────────────────

function transactionsReducer(
  state: TransactionsState,
  action: TransactionsAction,
): TransactionsState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        transactions: [action.payload, ...state.transactions],
      };
    case 'UPDATE_TRANSACTION':
      return {
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        transactions: state.transactions.filter(
          t => t.id !== action.payload.id,
        ),
      };
    case 'SET_TRANSACTIONS':
      return { transactions: action.payload };
    default:
      return state;
  }
}

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
  const [state, rawDispatch] = useReducer(
    transactionsReducer,
    undefined,
    () => {
      initDatabase();
      return {
        transactions: txRepo.getAllTransactions(),
      };
    },
  );

  const dispatch = useCallback((action: TransactionsAction) => {
    switch (action.type) {
      case 'ADD_TRANSACTION': {
        const payload = {
          ...action.payload,
          id: action.payload.id || generateId(),
          created_at: action.payload.created_at ?? Date.now(),
        };
        try {
          txRepo.insertTransaction(payload);
        } catch (e) {
          console.error('[TransactionsStore] insertTransaction failed:', e);
        }
        rawDispatch({ type: 'ADD_TRANSACTION', payload });
        return;
      }
      case 'UPDATE_TRANSACTION':
        try {
          txRepo.updateTransaction(action.payload);
        } catch (e) {
          console.error('[TransactionsStore] updateTransaction failed:', e);
        }
        break;
      case 'DELETE_TRANSACTION':
        try {
          txRepo.deleteTransaction(action.payload.id);
        } catch (e) {
          console.error('[TransactionsStore] deleteTransaction failed:', e);
        }
        break;
    }
    rawDispatch(action);
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
