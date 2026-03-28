import { CashEntry } from '../../types';
import { db } from '../database';

function mapRow(row: Record<string, any>): CashEntry {
  return {
    id: row.id,
    label: row.label,
    sublabel: row.sublabel,
    amount: row.amount,
    created_at: row.created_at,
  };
}

export function getAllCash(): CashEntry[] {
  const result = db.executeSync(
    'SELECT * FROM accounts_cash ORDER BY created_at ASC',
  );
  return ((result.rows ?? []) as any[]).map(mapRow);
}

export function insertCash(entry: CashEntry): void {
  db.executeSync(
    `INSERT INTO accounts_cash (id, label, sublabel, amount, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.label,
      entry.sublabel,
      entry.amount,
      entry.created_at ?? Date.now(),
    ],
  );
}

export function updateCash(entry: CashEntry): void {
  db.executeSync(
    `UPDATE accounts_cash SET label = ?, sublabel = ?, amount = ? WHERE id = ?`,
    [entry.label, entry.sublabel, entry.amount, entry.id],
  );
}

export function updateCashBalance(id: string, delta: number): void {
  db.executeSync('UPDATE accounts_cash SET amount = amount + ? WHERE id = ?', [
    delta,
    id,
  ]);
}

export function deleteCash(id: string): void {
  db.executeSync('DELETE FROM accounts_cash WHERE id = ?', [id]);
}
