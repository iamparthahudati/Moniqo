import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Budget } from '../types';
import { useAuth } from './authStore';
import { BudgetRepository } from '../db/repositories/budgetRepository';
import apiClient from '../services/apiClient';

export type { Budget };

// ── State ─────────────────────────────────────────────────────────────────────

export interface BudgetState {
  budgets: Budget[];
}

// ── Actions ───────────────────────────────────────────────────────────────────

export type BudgetAction =
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'UPSERT_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: { id: string } };

// ── Context ───────────────────────────────────────────────────────────────────

interface BudgetContextValue {
  state: BudgetState;
  dispatch: React.Dispatch<BudgetAction>;
}

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

export function BudgetProvider(props: {
  children: React.ReactNode;
}): React.JSX.Element {
  const { user } = useAuth();
  const [state, setState] = useState<BudgetState>({ budgets: [] });
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!user) {
      setState({ budgets: [] });
      return;
    }
    BudgetRepository.init();
    setState({ budgets: BudgetRepository.getAll() });
  }, [user]);

  const dispatch = useCallback(
    (action: BudgetAction) => {
      switch (action.type) {

        case 'SET_BUDGETS':
          setState({ budgets: action.payload });
          break;

        case 'UPSERT_BUDGET': {
          const now = Date.now();
          const payload: Budget = {
            ...action.payload,
            id:         action.payload.id || now.toString(36),
            created_at: action.payload.created_at || now,
          };
          BudgetRepository.upsert(payload);
          setState(prev => {
            const exists = prev.budgets.some(b => b.id === payload.id);
            return {
              budgets: exists
                ? prev.budgets.map(b => (b.id === payload.id ? payload : b))
                : [...prev.budgets, payload],
            };
          });
          apiClient.post('/budgets', {
            category_id: payload.categoryId,
            amount:      payload.amount,
            period:      payload.period,
          }).catch(() => {});
          break;
        }

        case 'DELETE_BUDGET': {
          const { id } = action.payload;
          BudgetRepository.delete(id);
          setState(prev => ({
            budgets: prev.budgets.filter(b => b.id !== id),
          }));
          apiClient.delete(`/budgets/${id}`).catch(() => {});
          break;
        }
      }
    },
    [],
  );

  return React.createElement(
    BudgetContext.Provider,
    { value: { state, dispatch } },
    props.children,
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useBudgets(): BudgetContextValue {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
}
