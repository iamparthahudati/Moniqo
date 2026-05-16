import { getDb } from '../database';
import { BankAccount } from '../../types';

export const BankRepository = {
  init(): void {
    getDb().executeSync(`
      CREATE TABLE IF NOT EXISTS accounts_bank (
        id           TEXT    PRIMARY KEY,
        bank_name    TEXT    NOT NULL,
        account_type TEXT    NOT NULL,
        balance      REAL    NOT NULL DEFAULT 0,
        color        TEXT    NOT NULL,
        status       TEXT    NOT NULL DEFAULT 'ACTIVE',
        icon         TEXT    NOT NULL DEFAULT 'bank',
        note         TEXT,
        created_at   INTEGER NOT NULL
      )
    `);
  },

  getAll(): BankAccount[] {
    const result = getDb().executeSync(
      'SELECT * FROM accounts_bank ORDER BY created_at DESC',
    );
    return result.rows.map(row => ({
      id:          row.id as string,
      bankName:    row.bank_name as string,
      accountType: row.account_type as string,
      balance:     row.balance as number,
      color:       row.color as string,
      status:      row.status as 'ACTIVE' | 'INACTIVE',
      icon:        row.icon as 'bank' | 'piggy',
      note:        (row.note ?? undefined) as string | undefined,
      created_at:  row.created_at as number,
    }));
  },

  insert(account: BankAccount): void {
    getDb().executeSync(
      `INSERT OR IGNORE INTO accounts_bank
         (id, bank_name, account_type, balance, color, status, icon, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        account.id, account.bankName, account.accountType, account.balance,
        account.color, account.status, account.icon, account.note ?? null,
        account.created_at,
      ],
    );
  },

  update(account: BankAccount): void {
    getDb().executeSync(
      `UPDATE accounts_bank
       SET bank_name = ?, account_type = ?, balance = ?, color = ?, status = ?, icon = ?, note = ?
       WHERE id = ?`,
      [
        account.bankName, account.accountType, account.balance, account.color,
        account.status, account.icon, account.note ?? null, account.id,
      ],
    );
  },

  delete(id: string): void {
    getDb().executeSync('DELETE FROM accounts_bank WHERE id = ?', [id]);
  },

  adjustBalance(id: string, delta: number): void {
    getDb().executeSync(
      'UPDATE accounts_bank SET balance = balance + ? WHERE id = ?',
      [delta, id],
    );
  },
};
