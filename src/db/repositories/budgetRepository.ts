import { getDb } from '../database';
import { Budget } from '../../types';

export const BudgetRepository = {
  init(): void {
    getDb().executeSync(`
      CREATE TABLE IF NOT EXISTS budgets (
        id          TEXT    PRIMARY KEY,
        category_id TEXT    NOT NULL UNIQUE,
        amount      REAL    NOT NULL,
        period      TEXT    NOT NULL DEFAULT 'monthly',
        created_at  INTEGER NOT NULL
      )
    `);
  },

  getAll(): Budget[] {
    const result = getDb().executeSync(
      'SELECT * FROM budgets ORDER BY created_at DESC',
    );
    return result.rows.map(row => ({
      id:         row.id as string,
      categoryId: row.category_id as string,
      amount:     row.amount as number,
      period:     row.period as 'monthly',
      created_at: row.created_at as number,
    }));
  },

  upsert(budget: Budget): void {
    getDb().executeSync(
      `INSERT INTO budgets (id, category_id, amount, period, created_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(category_id) DO UPDATE SET amount = excluded.amount, period = excluded.period`,
      [budget.id, budget.categoryId, budget.amount, budget.period, budget.created_at],
    );
  },

  delete(id: string): void {
    getDb().executeSync('DELETE FROM budgets WHERE id = ?', [id]);
  },
};
