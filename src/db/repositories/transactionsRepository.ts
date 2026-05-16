import { getDb } from '../database';
import { Transaction } from '../../types';

export const TransactionsRepository = {
  init(): void {
    getDb().executeSync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id           TEXT    PRIMARY KEY,
        title        TEXT    NOT NULL,
        subtitle     TEXT    NOT NULL DEFAULT '',
        amount       REAL    NOT NULL,
        type         TEXT    NOT NULL,
        category     TEXT    NOT NULL DEFAULT '',
        account_id   TEXT,
        account_type TEXT,
        date         TEXT    NOT NULL,
        time         TEXT    NOT NULL DEFAULT '',
        note         TEXT,
        created_at   INTEGER NOT NULL
      )
    `);
    getDb().executeSync('CREATE INDEX IF NOT EXISTS idx_tx_date ON transactions(date DESC)');
    getDb().executeSync('CREATE INDEX IF NOT EXISTS idx_tx_account ON transactions(account_id)');
    getDb().executeSync('CREATE INDEX IF NOT EXISTS idx_tx_category ON transactions(category)');
  },

  getAll(): Transaction[] {
    const result = getDb().executeSync(
      'SELECT * FROM transactions ORDER BY date DESC, created_at DESC',
    );
    return result.rows.map(row => ({
      id:           row.id as string,
      title:        row.title as string,
      subtitle:     row.subtitle as string,
      amount:       row.amount as number,
      type:         row.type as 'income' | 'expense' | 'transfer',
      category:     row.category as string,
      account_id:   (row.account_id ?? undefined) as string | undefined,
      account_type: (row.account_type ?? undefined) as 'bank' | 'card' | 'cash' | 'investment' | undefined,
      date:         row.date as string,
      time:         row.time as string,
      note:         (row.note ?? undefined) as string | undefined,
      created_at:   row.created_at as number,
    }));
  },

  insert(tx: Transaction): void {
    getDb().executeSync(
      `INSERT OR IGNORE INTO transactions
         (id, title, subtitle, amount, type, category, account_id, account_type, date, time, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tx.id, tx.title, tx.subtitle, tx.amount, tx.type, tx.category,
        tx.account_id ?? null, tx.account_type ?? null,
        tx.date, tx.time, tx.note ?? null, tx.created_at,
      ],
    );
  },

  update(tx: Transaction): void {
    getDb().executeSync(
      `UPDATE transactions
       SET title = ?, subtitle = ?, amount = ?, type = ?, category = ?,
           account_id = ?, account_type = ?, date = ?, time = ?, note = ?
       WHERE id = ?`,
      [
        tx.title, tx.subtitle, tx.amount, tx.type, tx.category,
        tx.account_id ?? null, tx.account_type ?? null,
        tx.date, tx.time, tx.note ?? null, tx.id,
      ],
    );
  },

  delete(id: string): void {
    getDb().executeSync('DELETE FROM transactions WHERE id = ?', [id]);
  },
};
