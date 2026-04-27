import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import { generateId, initDatabase } from '../db/database';
import * as budgetRepo from '../db/repositories/budgetRepository';
import { Budget } from '../db/repositories/budgetRepository';

// ── State ─────────────────────────────────────────────────────────────────────

export interface BudgetState {
  budgets: Budget[];
}

// ── Actions ───────────────────────────────────────────────────────────────────

export type BudgetAction =
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'UPSERT_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: { id: string } };

// ── Reducer ───────────────────────────────────────────────────────────────────

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case 'SET_BUDGETS':
      return { budgets: action.payload };
    case 'UPSERT_BUDGET': {
      const exists = state.budgets.some(b => b.id === action.payload.id);
      return {
        budgets: exists
          ? state.budgets.map(b =>
              b.id === action.payload.id ? action.payload : b,
            )
          : [...state.budgets, action.payload],
      };
    }
    case 'DELETE_BUDGET':
      return {
        budgets: state.budgets.filter(b => b.id !== action.payload.id),
      };
    default:
      return state;
  }
}

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
  const [state, rawDispatch] = useReducer(
    budgetReducer,
    undefined,
    (): BudgetState => {
      initDatabase();
      return { budgets: budgetRepo.getAllBudgets() };
    },
  );

  const dispatch = useCallback((action: BudgetAction) => {
    switch (action.type) {
      case 'SET_BUDGETS':
        break;
      case 'UPSERT_BUDGET': {
        const payload: Budget = {
          ...action.payload,
          id: action.payload.id || generateId(),
          created_at: action.payload.created_at ?? Date.now(),
        };
        try {
          budgetRepo.upsertBudget(payload);
        } catch (e) {
          console.error('[BudgetStore] upsertBudget failed:', e);
        }
        rawDispatch({ type: 'UPSERT_BUDGET', payload });
        return;
      }
      case 'DELETE_BUDGET':
        try {
          budgetRepo.deleteBudget(action.payload.id);
        } catch (e) {
          console.error('[BudgetStore] deleteBudget failed:', e);
        }
        break;
    }
    rawDispatch(action);
  }, []);

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
