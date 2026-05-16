import { getDb } from '../database';
import { CardAccount } from '../../types';

export const CardRepository = {
  init(): void {
    getDb().executeSync(`
      CREATE TABLE IF NOT EXISTS accounts_card (
        id         TEXT    PRIMARY KEY,
        card_name  TEXT    NOT NULL,
        card_type  TEXT    NOT NULL,
        due_amount REAL    NOT NULL DEFAULT 0,
        due_label  TEXT    NOT NULL,
        color      TEXT    NOT NULL,
        note       TEXT,
        created_at INTEGER NOT NULL
      )
    `);
  },

  getAll(): CardAccount[] {
    const result = getDb().executeSync(
      'SELECT * FROM accounts_card ORDER BY created_at DESC',
    );
    return result.rows.map(row => ({
      id:        row.id as string,
      cardName:  row.card_name as string,
      cardType:  row.card_type as string,
      dueAmount: row.due_amount as number,
      dueLabel:  row.due_label as string,
      color:     row.color as string,
      note:      (row.note ?? undefined) as string | undefined,
      created_at: row.created_at as number,
    }));
  },

  insert(account: CardAccount): void {
    getDb().executeSync(
      `INSERT OR IGNORE INTO accounts_card
         (id, card_name, card_type, due_amount, due_label, color, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        account.id, account.cardName, account.cardType, account.dueAmount,
        account.dueLabel, account.color, account.note ?? null, account.created_at,
      ],
    );
  },

  update(account: CardAccount): void {
    getDb().executeSync(
      `UPDATE accounts_card
       SET card_name = ?, card_type = ?, due_amount = ?, due_label = ?, color = ?, note = ?
       WHERE id = ?`,
      [
        account.cardName, account.cardType, account.dueAmount, account.dueLabel,
        account.color, account.note ?? null, account.id,
      ],
    );
  },

  delete(id: string): void {
    getDb().executeSync('DELETE FROM accounts_card WHERE id = ?', [id]);
  },

  adjustDue(id: string, delta: number): void {
    getDb().executeSync(
      'UPDATE accounts_card SET due_amount = due_amount + ? WHERE id = ?',
      [delta, id],
    );
  },
};
