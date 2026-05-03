import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addCategory as fsAddCategory,
  deleteCategory as fsDeleteCategory,
  seedDefaultCategories,
  subscribeToCategories,
} from '../services/firestoreService';
import { AppCategory } from '../types';
import { useAuth } from './authStore';

interface CategoriesContextValue {
  expenseCategories: AppCategory[];
  incomeCategories: AppCategory[];
  addCategory: (cat: Omit<AppCategory, 'id' | 'created_at'>) => void;
  deleteCategory: (id: string) => void;
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [categories, setCategories] = useState<AppCategory[]>([]);
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  useEffect(() => {
    if (!uid) {
      setCategories([]);
      return;
    }

    seedDefaultCategories(uid).catch(err =>
      console.error('[CategoriesProvider] seedDefaultCategories failed:', err),
    );

    const unsubscribe = subscribeToCategories(uid, setCategories);
    return () => {
      unsubscribe();
    };
  }, [uid]);

  const addCategory = useCallback(
    (cat: Omit<AppCategory, 'id' | 'created_at'>) => {
      if (!uid) {
        return;
      }
      fsAddCategory(uid, { ...cat, created_at: Date.now() }).catch(err =>
        console.error('[CategoriesProvider] Failed to add category:', err),
      );
    },
    [uid],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      if (!uid) {
        return;
      }
      fsDeleteCategory(uid, id).catch(err =>
        console.error('[CategoriesProvider] Failed to delete category:', err),
      );
    },
    [uid],
  );

  const value = useMemo<CategoriesContextValue>(
    () => ({
      expenseCategories: categories.filter(c => c.type === 'expense'),
      incomeCategories: categories.filter(c => c.type === 'income'),
      addCategory,
      deleteCategory,
    }),
    [categories, addCategory, deleteCategory],
  );

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories(): CategoriesContextValue {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return ctx;
}
