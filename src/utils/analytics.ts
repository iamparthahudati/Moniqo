import {
  AppCategory,
  MonthlyData,
  SpendingCategory,
  Transaction,
} from '../types';

// ---------------------------------------------------------------------------
// Fallback metadata for categories when no AppCategory list is provided
// ---------------------------------------------------------------------------
interface CategoryMeta {
  emoji: string;
  color: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  dining: { emoji: '🍽️', color: '#FF6B6B' },
  food: { emoji: '🍔', color: '#FF6B6B' },
  shopping: { emoji: '🛍️', color: '#4ECDC4' },
  transport: { emoji: '🚗', color: '#45B7D1' },
  bills: { emoji: '📄', color: '#96CEB4' },
  salary: { emoji: '💼', color: '#88D8A3' },
  entertainment: { emoji: '🎬', color: '#DDA0DD' },
  fun: { emoji: '🎉', color: '#DDA0DD' },
  health: { emoji: '🏥', color: '#F7DC6F' },
  utilities: { emoji: '💡', color: '#82E0AA' },
  transfer: { emoji: '↔️', color: '#BDC3C7' },
  other: { emoji: '📦', color: '#AEB6BF' },
  others: { emoji: '📦', color: '#AEB6BF' },
};

const DEFAULT_META: CategoryMeta = { emoji: '📦', color: '#AEB6BF' };

function getCategoryMeta(
  categoryKey: string,
  categories?: AppCategory[],
): CategoryMeta {
  if (categories) {
    const found = categories.find(
      c =>
        c.id === categoryKey ||
        c.name.toLowerCase() === categoryKey.toLowerCase(),
    );
    if (found) return { emoji: found.emoji, color: found.color };
  }
  return CATEGORY_META[categoryKey.toLowerCase()] ?? DEFAULT_META;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true when the transaction should be excluded from income/expense aggregations. */
function isTransfer(tx: Transaction): boolean {
  return tx.category === 'transfer' || tx.type === 'transfer';
}

/** Returns true when date string is within [from, to] (inclusive, ISO YYYY-MM-DD). */
function inRange(date: string, from: string, to: string): boolean {
  return date >= from && date <= to;
}

/**
 * Builds an ordered list of ISO date strings for the 7-day window [from, to].
 * Assumes to - from === 6 days (7 entries).
 */
function buildDateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(from + 'T00:00:00');
  const end = new Date(to + 'T00:00:00');
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

/** Returns a short day label for a given ISO date string. */
function dayLabel(isoDate: string, todayIso: string): string {
  if (isoDate === todayIso) return 'Today';
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' }); // 'Mon', 'Tue', …
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Groups transactions by date for the 7-day window [from, to].
 * Days with no transactions still appear with zero values.
 * Excludes transfers.
 */
export function getDailyTotals(
  transactions: Transaction[],
  from: string,
  to: string,
): MonthlyData[] {
  const todayIso = new Date().toISOString().slice(0, 10);
  const dates = buildDateRange(from, to);

  // Initialise all days with zero
  const map: Record<string, MonthlyData> = {};
  for (const d of dates) {
    map[d] = { month: dayLabel(d, todayIso), income: 0, expense: 0 };
  }

  for (const tx of transactions) {
    if (isTransfer(tx)) continue;
    if (!inRange(tx.date, from, to)) continue;
    if (!map[tx.date]) continue; // outside the built range (shouldn't happen)

    if (tx.type === 'income') {
      map[tx.date].income += tx.amount;
    } else if (tx.type === 'expense') {
      map[tx.date].expense += Math.abs(tx.amount);
    }
  }

  return dates.map(d => map[d]);
}

/**
 * Buckets transactions into W1–W4 for the given year/month.
 * Week bucket = Math.min(Math.ceil(day / 7), 4).
 * Always returns exactly 4 items.
 * Excludes transfers.
 */
export function getWeeklyTotals(
  transactions: Transaction[],
  year: number,
  month: number,
): MonthlyData[] {
  const result: MonthlyData[] = [
    { month: 'W1', income: 0, expense: 0 },
    { month: 'W2', income: 0, expense: 0 },
    { month: 'W3', income: 0, expense: 0 },
    { month: 'W4', income: 0, expense: 0 },
  ];

  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}-`;

  for (const tx of transactions) {
    if (isTransfer(tx)) continue;
    if (!tx.date.startsWith(prefix)) continue;

    const day = parseInt(tx.date.slice(8, 10), 10);
    const weekIndex = Math.min(Math.ceil(day / 7), 4) - 1; // 0-based

    if (tx.type === 'income') {
      result[weekIndex].income += tx.amount;
    } else if (tx.type === 'expense') {
      result[weekIndex].expense += Math.abs(tx.amount);
    }
  }

  return result;
}

/**
 * Groups transactions by month for the given year.
 * Only includes months that have at least one non-transfer transaction.
 * Returns items with month = 'Jan', 'Feb', etc.
 * Excludes transfers.
 */
export function getMonthlyTotals(
  transactions: Transaction[],
  year: number,
): MonthlyData[] {
  const map: Record<number, MonthlyData> = {};

  for (const tx of transactions) {
    if (isTransfer(tx)) continue;
    if (!tx.date.startsWith(`${year}-`)) continue;

    const monthIndex = parseInt(tx.date.slice(5, 7), 10) - 1; // 0-based
    if (!map[monthIndex]) {
      map[monthIndex] = {
        month: MONTH_LABELS[monthIndex],
        income: 0,
        expense: 0,
      };
    }

    if (tx.type === 'income') {
      map[monthIndex].income += tx.amount;
    } else if (tx.type === 'expense') {
      map[monthIndex].expense += Math.abs(tx.amount);
    }
  }

  // Return in calendar order, only months with data
  return Object.keys(map)
    .map(Number)
    .sort((a, b) => a - b)
    .map(idx => map[idx]);
}

/**
 * Filters expense transactions in [from, to], groups by category,
 * computes percentage share of total spend.
 * Excludes transfers.
 * Uses categories param for emoji/color lookup, falls back to CATEGORY_META.
 */
export function getSpendingByCategory(
  transactions: Transaction[],
  from: string,
  to: string,
  categories?: AppCategory[],
): SpendingCategory[] {
  const totals: Record<string, number> = {};

  for (const tx of transactions) {
    if (isTransfer(tx)) continue;
    if (tx.type !== 'expense') continue;
    if (!inRange(tx.date, from, to)) continue;

    const key = tx.category ?? 'other';
    totals[key] = (totals[key] ?? 0) + Math.abs(tx.amount);
  }

  const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .map(([categoryKey, amount]) => {
      const meta = getCategoryMeta(categoryKey, categories);
      const percentage =
        grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0;

      // Prefer display name from AppCategory list if available
      const appCat = categories?.find(
        c =>
          c.id === categoryKey ||
          c.name.toLowerCase() === categoryKey.toLowerCase(),
      );
      const label =
        appCat?.name ??
        categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);

      return {
        id: categoryKey,
        label,
        amount,
        percentage,
        color: meta.color,
        emoji: meta.emoji,
      } satisfies SpendingCategory;
    });
}

/**
 * Sum of income transaction amounts in [from, to], excluding transfers.
 */
export function getIncomeTotalForRange(
  transactions: Transaction[],
  from: string,
  to: string,
): number {
  return transactions.reduce((sum, tx) => {
    if (isTransfer(tx)) return sum;
    if (tx.type !== 'income') return sum;
    if (!inRange(tx.date, from, to)) return sum;
    return sum + tx.amount;
  }, 0);
}

/**
 * Sum of ABS(amount) of expense transactions in [from, to], excluding transfers.
 */
export function getExpenseTotalForRange(
  transactions: Transaction[],
  from: string,
  to: string,
): number {
  return transactions.reduce((sum, tx) => {
    if (isTransfer(tx)) return sum;
    if (tx.type !== 'expense') return sum;
    if (!inRange(tx.date, from, to)) return sum;
    return sum + Math.abs(tx.amount);
  }, 0);
}

/**
 * Savings rate = (income - expense) / income * 100, rounded to nearest integer.
 * Returns 0 if income <= 0.
 */
export function getSavingsRate(
  transactions: Transaction[],
  from: string,
  to: string,
): number {
  const income = getIncomeTotalForRange(transactions, from, to);
  if (income <= 0) return 0;
  const expense = getExpenseTotalForRange(transactions, from, to);
  return Math.round(((income - expense) / income) * 100);
}

/**
 * Returns the top N expense transactions by ABS(amount) descending.
 * Excludes transfers. Optionally filtered to [from, to] date range.
 */
export function getTopExpenses(
  transactions: Transaction[],
  limit: number,
  from?: string,
  to?: string,
): Transaction[] {
  return transactions
    .filter(tx => {
      if (isTransfer(tx)) return false;
      if (tx.type !== 'expense') return false;
      if (from && to && !inRange(tx.date, from, to)) return false;
      return true;
    })
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, limit);
}
