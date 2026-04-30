import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  addTransaction,
  deleteTransaction,
  subscribeToTransactions,
  updateTransaction,
} from '../services/firestoreService';
import { Transaction } from '../types';
import { useAuth } from './authStore';

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

// ── Reducer (kept for type-contract parity; state is driven by onSnapshot) ────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [state, setState] = useState<TransactionsState>({ transactions: [] });

  // Keep uid in a ref so the dispatch callback never goes stale
  const uidRef = useRef(uid);
  useEffect(() => {
    uidRef.current = uid;
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setState({ transactions: [] });
      return;
    }

    const unsubscribe = subscribeToTransactions(
      uid,
      (transactions: Transaction[]) => {
        setState({ transactions });
      },
    );

    return () => {
      unsubscribe();
    };
  }, [uid]);

  const dispatch = useCallback<React.Dispatch<TransactionsAction>>(
    (action: TransactionsAction) => {
      const currentUid = uidRef.current;
      if (!currentUid) {
        return;
      }

      switch (action.type) {
        case 'ADD_TRANSACTION': {
          const { id: _id, ...rest } = action.payload;
          addTransaction(currentUid, rest).catch(e =>
            console.error('[TransactionsStore] addTransaction failed:', e),
          );
          break;
        }
        case 'UPDATE_TRANSACTION':
          updateTransaction(currentUid, action.payload).catch(e =>
            console.error('[TransactionsStore] updateTransaction failed:', e),
          );
          break;
        case 'DELETE_TRANSACTION':
          deleteTransaction(currentUid, action.payload.id).catch(e =>
            console.error('[TransactionsStore] deleteTransaction failed:', e),
          );
          break;
        case 'SET_TRANSACTIONS':
          // no-op: state is driven by onSnapshot
          break;
      }
    },
    [],
  );

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
