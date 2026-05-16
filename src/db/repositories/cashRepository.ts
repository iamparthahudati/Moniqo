import { getDb } from '../database';
import { CashEntry } from '../../types';

export const CashRepository = {
  init(): void {
    getDb().executeSync(`
      CREATE TABLE IF NOT EXISTS accounts_cash (
        id         TEXT    PRIMARY KEY,
        label      TEXT    NOT NULL,
        sublabel   TEXT    NOT NULL DEFAULT '',
        amount     REAL    NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `);
  },

  getAll(): CashEntry[] {
    const result = getDb().executeSync(
      'SELECT * FROM accounts_cash ORDER BY created_at DESC',
    );
    return result.rows.map(row => ({
      id:        row.id as string,
      label:     row.label as string,
      sublabel:  row.sublabel as string,
      amount:    row.amount as number,
      created_at: row.created_at as number,
    }));
  },

  insert(entry: CashEntry): void {
    getDb().executeSync(
      `INSERT OR IGNORE INTO accounts_cash (id, label, sublabel, amount, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [entry.id, entry.label, entry.sublabel, entry.amount, entry.created_at],
    );
  },

  update(entry: CashEntry): void {
    getDb().executeSync(
      'UPDATE accounts_cash SET label = ?, sublabel = ?, amount = ? WHERE id = ?',
      [entry.label, entry.sublabel, entry.amount, entry.id],
    );
  },

  delete(id: string): void {
    getDb().executeSync('DELETE FROM accounts_cash WHERE id = ?', [id]);
  },

  adjustAmount(id: string, delta: number): void {
    getDb().executeSync(
      'UPDATE accounts_cash SET amount = amount + ? WHERE id = ?',
      [delta, id],
    );
  },
};
