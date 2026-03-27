import {MonthlyData, SpendingCategory, Transaction} from '../../types';
import {db} from '../database';

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

const CATEGORY_META: Record<string, {emoji: string; color: string}> = {
  dining: {emoji: '\uD83C\uDF74', color: '#EF4444'},
  food: {emoji: '\uD83C\uDF74', color: '#EF4444'},
  shopping: {emoji: '\uD83D\uDED2', color: '#3B82F6'},
  transport: {emoji: '\uD83D\uDE97', color: '#F97316'},
  bills: {emoji: '\uD83E\uDDFE', color: '#8B5CF6'},
  salary: {emoji: '\uD83D\uDCB0', color: '#22C55E'},
  entertainment: {emoji: '\uD83C\uDFAB', color: '#EC4899'},
  fun: {emoji: '\uD83C\uDFAB', color: '#EC4899'},
  health: {emoji: '\uD83C\uDFE5', color: '#14B8A6'},
  utilities: {emoji: '\u26A1', color: '#F59E0B'},
  transfer: {emoji: '\u21C5', color: '#6366F1'},
  other: {emoji: '\u2022\u2022\u2022', color: '#94A3B8'},
  others: {emoji: '\u2022\u2022\u2022', color: '#94A3B8'},
};

export function getMonthlyTotals(year: number): MonthlyData[] {
  const result = db.executeSync(
    `SELECT strftime('%m', date) as month,
            SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
            SUM(CASE WHEN type='expense' THEN ABS(amount) ELSE 0 END) as expense
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
): SpendingCategory[] {
  const result = db.executeSync(
    `SELECT category, SUM(ABS(amount)) as total
     FROM transactions
     WHERE type = 'expense' AND date BETWEEN ? AND ?
     GROUP BY category
     ORDER BY total DESC`,
    [from, to],
  );

  const rows = (result.rows ?? []) as any[];
  const grandTotal = rows.reduce(
    (sum: number, r: any) => sum + ((r.total as number) ?? 0),
    0,
  );

  return rows.map(row => {
    const cat = row.category as string;
    const total = (row.total as number) ?? 0;
    const meta = CATEGORY_META[cat] ?? CATEGORY_META.other;
    const pct = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0;
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
     WHERE type = 'income' AND date BETWEEN ? AND ?`,
    [from, to],
  );
  return ((result.rows as any[])?.[0]?.total as number) ?? 0;
}

export function getExpenseTotalForRange(from: string, to: string): number {
  const result = db.executeSync(
    `SELECT COALESCE(SUM(ABS(amount)), 0) as total
     FROM transactions
     WHERE type = 'expense' AND date BETWEEN ? AND ?`,
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

export function getTopExpenses(limit: number): Transaction[] {
  const result = db.executeSync(
    `SELECT * FROM transactions
     WHERE type = 'expense'
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
    account_type: (row.account_type as 'bank' | 'card' | 'cash' | 'investment') ?? undefined,
    date: row.date as string,
    time: row.time as string,
    note: (row.note as string) ?? undefined,
    created_at: row.created_at as number,
  }));
}
