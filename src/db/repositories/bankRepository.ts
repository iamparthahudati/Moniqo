import { BankAccount } from '../../types';
import { db } from '../database';

function mapRow(row: Record<string, any>): BankAccount {
  return {
    id: row.id,
    bankName: row.bank_name,
    accountType: row.account_type,
    balance: row.balance,
    color: row.color,
    icon: row.icon,
    status: row.status,
    note: row.note ?? undefined,
    created_at: row.created_at,
  };
}

export function getAllBanks(): BankAccount[] {
  const result = db.executeSync(
    'SELECT * FROM accounts_bank ORDER BY created_at ASC',
  );
  return ((result.rows ?? []) as any[]).map(mapRow);
}

export function insertBank(account: BankAccount): void {
  db.executeSync(
    `INSERT INTO accounts_bank (id, bank_name, account_type, balance, color, icon, status, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      account.id,
      account.bankName,
      account.accountType,
      account.balance,
      account.color,
      account.icon,
      account.status,
      account.note ?? null,
      account.created_at ?? Date.now(),
    ],
  );
}

export function updateBank(account: BankAccount): void {
  db.executeSync(
    `UPDATE accounts_bank
     SET bank_name = ?, account_type = ?, balance = ?, color = ?, icon = ?, status = ?, note = ?
     WHERE id = ?`,
    [
      account.bankName,
      account.accountType,
      account.balance,
      account.color,
      account.icon,
      account.status,
      account.note ?? null,
      account.id,
    ],
  );
}

export function updateBankBalance(id: string, delta: number): void {
  db.executeSync(
    'UPDATE accounts_bank SET balance = balance + ? WHERE id = ?',
    [delta, id],
  );
}

export function deleteBank(id: string): void {
  db.executeSync('DELETE FROM accounts_bank WHERE id = ?', [id]);
}
