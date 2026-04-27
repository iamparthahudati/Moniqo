import { db } from '../database';

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly';
  created_at: number;
}

function mapRow(row: Record<string, unknown>): Budget {
  return {
    id: row.id as string,
    categoryId: row.category_id as string,
    amount: row.amount as number,
    period: 'monthly',
    created_at: row.created_at as number,
  };
}

export function getAllBudgets(): Budget[] {
  const result = db.executeSync(
    'SELECT * FROM budgets ORDER BY created_at ASC',
  );
  return ((result.rows ?? []) as any[]).map(mapRow);
}

export function upsertBudget(budget: Budget): void {
  db.executeSync(
    `INSERT INTO budgets (id, category_id, amount, period, created_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET amount = excluded.amount`,
    [
      budget.id,
      budget.categoryId,
      budget.amount,
      budget.period,
      budget.created_at,
    ],
  );
}

export function deleteBudget(id: string): void {
  db.executeSync('DELETE FROM budgets WHERE id = ?', [id]);
}
