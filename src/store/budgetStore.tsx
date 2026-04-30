import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Budget,
  deleteBudget as fsDeleteBudget,
  upsertBudget as fsUpsertBudget,
  subscribeToBudgets,
} from '../services/firestoreService';
import { useAuth } from './authStore';

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
  const uid = user?.uid ?? null;

  const [state, setState] = useState<BudgetState>({ budgets: [] });
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!uid) {
      setState({ budgets: [] });
      return;
    }

    const unsubscribe = subscribeToBudgets(uid, budgets => {
      setState({ budgets });
    });

    return unsubscribe;
  }, [uid]);

  const dispatch = useCallback(
    (action: BudgetAction) => {
      switch (action.type) {
        case 'SET_BUDGETS':
          // no-op: Firestore subscription drives state
          break;

        case 'UPSERT_BUDGET': {
          const now = Date.now();
          const payload: Budget = {
            ...action.payload,
            id: action.payload.id || now.toString(36),
            created_at: action.payload.created_at || now,
          };

          if (uid) {
            fsUpsertBudget(uid, payload).catch(e =>
              console.error('[BudgetStore] upsertBudget failed:', e),
            );
          }

          setState(prev => {
            const exists = prev.budgets.some(b => b.id === payload.id);
            return {
              budgets: exists
                ? prev.budgets.map(b => (b.id === payload.id ? payload : b))
                : [...prev.budgets, payload],
            };
          });
          break;
        }

        case 'DELETE_BUDGET': {
          const { id } = action.payload;

          if (uid) {
            fsDeleteBudget(uid, id).catch(e =>
              console.error('[BudgetStore] deleteBudget failed:', e),
            );
          }

          setState(prev => ({
            budgets: prev.budgets.filter(b => b.id !== id),
          }));
          break;
        }
      }
    },
    [uid],
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
