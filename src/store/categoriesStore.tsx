import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppCategory } from '../types';
import { CategoriesRepository } from '../db/repositories/categoriesRepository';
import { CategoriesApiService } from '../services/categoriesApiService';

interface CategoriesContextValue {
  expenseCategories: AppCategory[];
  incomeCategories: AppCategory[];
  addCategory: (cat: Omit<AppCategory, 'id' | 'created_at'>) => void;
  deleteCategory: (id: string) => void;
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [categories, setCategories] = useState<AppCategory[]>([]);

  useEffect(() => {
    CategoriesRepository.init();
    if (!CategoriesRepository.isSeeded()) {
      CategoriesRepository.seedDefaults();
    }
    setCategories(CategoriesRepository.getAll());
  }, []);

  const addCategory = useCallback(
    (cat: Omit<AppCategory, 'id' | 'created_at'>) => {
      const newCat: AppCategory = { ...cat, id: generateId(), created_at: Date.now() };
      CategoriesRepository.insert(newCat);
      setCategories(CategoriesRepository.getAll());
      CategoriesApiService.createCategory(newCat).catch(() => {});
    },
    [],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      CategoriesRepository.delete(id);
      setCategories(CategoriesRepository.getAll());
      CategoriesApiService.deleteCategory(id).catch(() => {});
    },
    [],
  );

  const value = useMemo<CategoriesContextValue>(
    () => ({
      expenseCategories: categories.filter(c => c.type === 'expense'),
      incomeCategories:  categories.filter(c => c.type === 'income'),
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
