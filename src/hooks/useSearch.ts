import { useMemo, useState } from 'react';
import { Transaction } from '../types';

type FilterType = 'all' | 'income' | 'expense' | 'transfer';

function useSearch(transactions: Transaction[]): {
  query: string;
  setQuery: (q: string) => void;
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  results: Transaction[];
  hasQuery: boolean;
} {
  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    return transactions.filter(tx => {
      if (filter !== 'all' && tx.type !== filter) {
        return false;
      }

      if (trimmed.length === 0) {
        return true;
      }

      return (
        tx.title.toLowerCase().includes(trimmed) ||
        tx.subtitle.toLowerCase().includes(trimmed) ||
        tx.category.toLowerCase().includes(trimmed) ||
        (tx.note?.toLowerCase().includes(trimmed) ?? false)
      );
    });
  }, [transactions, query, filter]);

  const hasQuery = query.trim().length > 0 || filter !== 'all';

  return { query, setQuery, filter, setFilter, results, hasQuery };
}

export default useSearch;
