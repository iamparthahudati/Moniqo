import { MonthlyData, SpendingCategory, Transaction } from '../../types';
import { db } from '../database';
import { AppCategory } from './categoryRepository';

const MONTH_SHORT = [
  '',
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

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  dining: { emoji: '\uD83C\uDF74', color: '#EF4444' },
  food: { emoji: '\uD83C\uDF74', color: '#EF4444' },
  shopping: { emoji: '\uD83D\uDED2', color: '#3B82F6' },
  transport: { emoji: '\uD83D\uDE97', color: '#F97316' },
  bills: { emoji: '\uD83E\uDDFE', color: '#8B5CF6' },
  salary: { emoji: '\uD83D\uDCB0', color: '#22C55E' },
  entertainment: { emoji: '\uD83C\uDFAB', color: '#EC4899' },
  fun: { emoji: '\uD83C\uDFAB', color: '#EC4899' },
  health: { emoji: '\uD83C\uDFE5', color: '#14B8A6' },
  utilities: { emoji: '\u26A1', color: '#F59E0B' },
  transfer: { emoji: '\u21C5', color: '#6366F1' },
  other: { emoji: '\u2022\u2022\u2022', color: '#94A3B8' },
  others: { emoji: '\u2022\u2022\u2022', color: '#94A3B8' },
};

export function getDailyTotals(from: string, to: string): MonthlyData[] {
  const result = db.executeSync(
    `SELECT date,
            SUM(CASE WHEN type='income' AND category != 'transfer' THEN amount ELSE 0 END) as income,
            SUM(CASE WHEN type='expense' AND category != 'transfer' THEN ABS(amount) ELSE 0 END) as expense
     FROM transactions
     WHERE date BETWEEN ? AND ?
     GROUP BY date
     ORDER BY date ASC`,
    [from, to],
  );

  // Build a full 7-day map so days with no transactions still appear
  const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const map: Record<string, { income: number; expense: number }> = {};
  ((result.rows ?? []) as any[]).forEach(row => {
    map[row.date as string] = {
      income: (row.income as number) ?? 0,
      expense: (row.expense as number) ?? 0,
    };
  });

  const days: MonthlyData[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const label = i === 0 ? 'Today' : DAY_SHORT[d.getDay()];
    days.push({
      month: label,
      income: map[iso]?.income ?? 0,
      expense: map[iso]?.expense ?? 0,
    });
  }
  return days;
}

export function getWeeklyTotals(year: number, month: number): MonthlyData[] {
  const monthStr = month.toString().padStart(2, '0');
  const result = db.executeSync(
    `SELECT date,
            SUM(CASE WHEN type='income' AND category != 'transfer' THEN amount ELSE 0 END) as income,
            SUM(CASE WHEN type='expense' AND category != 'transfer' THEN ABS(amount) ELSE 0 END) as expense
     FROM transactions
     WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?
     GROUP BY date
     ORDER BY date ASC`,
    [year.toString(), monthStr],
  );

  // Bucket by week-of-month (1–5)
  const weeks: Record<number, { income: number; expense: number }> = {
    1: { income: 0, expense: 0 },
    2: { income: 0, expense: 0 },
    3: { income: 0, expense: 0 },
    4: { income: 0, expense: 0 },
  };

  ((result.rows ?? []) as any[]).forEach(row => {
    const day = parseInt((row.date as string).split('-')[2], 10);
    const week = Math.min(Math.ceil(day / 7), 4);
    weeks[week].income += (row.income as number) ?? 0;
    weeks[week].expense += (row.expense as number) ?? 0;
  });

  return Object.entries(weeks).map(([w, v]) => ({
    month: `W${w}`,
    income: v.income,
    expense: v.expense,
  }));
}

export function getMonthlyTotals(year: number): MonthlyData[] {
  const result = db.executeSync(
    `SELECT strftime('%m', date) as month,
            SUM(CASE WHEN type='income' AND category != 'transfer' THEN amount ELSE 0 END) as income,
            SUM(CASE WHEN type='expense' AND category != 'transfer' THEN ABS(amount) ELSE 0 END) as expense
     FROM transactions
     WHERE strftime('%Y', date) = ?
     GROUP BY month
     ORDER BY month ASC`,
    [year.toString()],
  );

  return ((result.rows ?? []) as any[]).map(row => ({
    month: MONTH_SHORT[parseInt(row.month, 10)] || row.month,
    income: (row.income as number) ?? 0,
    expense: (row.expense as number) ?? 0,
  }));
}

export function getSpendingByCategory(
  from: string,
  to: string,
  categories?: AppCategory[],
): SpendingCategory[] {
  const result = db.executeSync(
    `SELECT category, SUM(ABS(amount)) as total
     FROM transactions
     WHERE type = 'expense' AND category != 'transfer' AND date BETWEEN ? AND ?
     GROUP BY category
     ORDER BY total DESC`,
    [from, to],
  );

  const rows = (result.rows ?? []) as any[];
  const grandTotal = rows.reduce(
    (sum: number, r: any) => sum + ((r.total as number) ?? 0),
    0,
  );

  // Build a lookup map from the live categories store when provided
  const categoryMap = new Map<string, { emoji: string; color: string }>();
  if (categories) {
    for (const c of categories) {
      categoryMap.set(c.name.toLowerCase(), { emoji: c.emoji, color: c.color });
    }
  }

  return rows.map(row => {
    const cat = row.category as string;
    const total = (row.total as number) ?? 0;
    const pct = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0;
    const meta =
      categoryMap.get(cat.toLowerCase()) ??
      CATEGORY_META[cat.toLowerCase()] ??
      CATEGORY_META.other;
    return {
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      amount: total,
      percentage: pct,
      color: meta.color,
      emoji: meta.emoji,
    };
  });
}

export function getIncomeTotalForRange(from: string, to: string): number {
  const result = db.executeSync(
    `SELECT COALESCE(SUM(amount), 0) as total
     FROM transactions
     WHERE type = 'income' AND category != 'transfer' AND date BETWEEN ? AND ?`,
    [from, to],
  );
  return ((result.rows as any[])?.[0]?.total as number) ?? 0;
}

export function getExpenseTotalForRange(from: string, to: string): number {
  const result = db.executeSync(
    `SELECT COALESCE(SUM(ABS(amount)), 0) as total
     FROM transactions
     WHERE type = 'expense' AND category != 'transfer' AND date BETWEEN ? AND ?`,
    [from, to],
  );
  return ((result.rows as any[])?.[0]?.total as number) ?? 0;
}

export function getSavingsRate(from: string, to: string): number {
  const income = getIncomeTotalForRange(from, to);
  const expense = getExpenseTotalForRange(from, to);
  if (income <= 0) {
    return 0;
  }
  return Math.round(((income - expense) / income) * 100);
}

export function getTopExpenses(
  limit: number,
  from?: string,
  to?: string,
): Transaction[] {
  const result =
    from && to
      ? db.executeSync(
          `SELECT * FROM transactions
         WHERE type = 'expense' AND category != 'transfer' AND date BETWEEN ? AND ?
         ORDER BY ABS(amount) DESC
         LIMIT ?`,
          [from, to, limit],
        )
      : db.executeSync(
          `SELECT * FROM transactions
         WHERE type = 'expense' AND category != 'transfer'
         ORDER BY ABS(amount) DESC
         LIMIT ?`,
          [limit],
        );
  return ((result.rows ?? []) as any[]).map(row => ({
    id: row.id as string,
    title: row.title as string,
    subtitle: row.subtitle as string,
    amount: row.amount as number,
    type: row.type as 'income' | 'expense',
    category: row.category as string,
    account_id: (row.account_id as string) ?? undefined,
    account_type:
      (row.account_type as 'bank' | 'card' | 'cash' | 'investment') ??
      undefined,
    date: row.date as string,
    time: row.time as string,
    note: (row.note as string) ?? undefined,
    created_at: row.created_at as number,
  }));
}
