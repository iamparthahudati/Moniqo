import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { generateId, initDatabase } from '../db/database';
import {
  AppCategory,
  deleteCategory as dbDeleteCategory,
  getAllCategories,
  insertCategory,
  seedCategoriesIfEmpty,
} from '../db/repositories/categoryRepository';

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

  useEffect(() => {
    try {
      initDatabase();
      seedCategoriesIfEmpty();
      const rows = getAllCategories();
      setCategories(rows);
    } catch (error) {
      console.error(
        '[CategoriesProvider] Failed to initialise categories:',
        error,
      );
    }
  }, []);

  const addCategory = useCallback(
    (cat: Omit<AppCategory, 'id' | 'created_at'>) => {
      const newCategory: AppCategory = {
        ...cat,
        id: generateId(),
        created_at: Date.now(),
      };
      try {
        insertCategory(newCategory);
        setCategories(prev => [...prev, newCategory]);
      } catch (error) {
        console.error('[CategoriesProvider] Failed to add category:', error);
      }
    },
    [],
  );

  const deleteCategory = useCallback((id: string) => {
    try {
      dbDeleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('[CategoriesProvider] Failed to delete category:', error);
    }
  }, []);

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
