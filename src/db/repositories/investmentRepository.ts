import { getDb } from '../database';
import { Investment } from '../../types';

export const InvestmentRepository = {
  init(): void {
    getDb().executeSync(`
      CREATE TABLE IF NOT EXISTS accounts_investment (
        id         TEXT    PRIMARY KEY,
        name       TEXT    NOT NULL,
        amount     REAL    NOT NULL DEFAULT 0,
        icon       TEXT    NOT NULL DEFAULT 'trend',
        color      TEXT    NOT NULL,
        note       TEXT,
        created_at INTEGER NOT NULL
      )
    `);
  },

  getAll(): Investment[] {
    const result = getDb().executeSync(
      'SELECT * FROM accounts_investment ORDER BY created_at DESC',
    );
    return result.rows.map(row => ({
      id:        row.id as string,
      name:      row.name as string,
      amount:    row.amount as number,
      icon:      row.icon as 'trend' | 'bitcoin' | 'gold' | 'other',
      color:     row.color as string,
      note:      (row.note ?? undefined) as string | undefined,
      created_at: row.created_at as number,
    }));
  },

  insert(investment: Investment): void {
    getDb().executeSync(
      `INSERT OR IGNORE INTO accounts_investment
         (id, name, amount, icon, color, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        investment.id, investment.name, investment.amount, investment.icon,
        investment.color, investment.note ?? null, investment.created_at,
      ],
    );
  },

  update(investment: Investment): void {
    getDb().executeSync(
      `UPDATE accounts_investment
       SET name = ?, amount = ?, icon = ?, color = ?, note = ?
       WHERE id = ?`,
      [
        investment.name, investment.amount, investment.icon,
        investment.color, investment.note ?? null, investment.id,
      ],
    );
  },

  delete(id: string): void {
    getDb().executeSync('DELETE FROM accounts_investment WHERE id = ?', [id]);
  },

  adjustAmount(id: string, delta: number): void {
    getDb().executeSync(
      'UPDATE accounts_investment SET amount = amount + ? WHERE id = ?',
      [delta, id],
    );
  },
};
