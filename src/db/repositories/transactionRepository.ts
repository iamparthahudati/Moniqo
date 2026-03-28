import {Transaction} from '../../types';
import {db} from '../database';

function mapRow(row: Record<string, any>): Transaction {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    amount: row.amount,
    type: row.type,
    category: row.category,
    account_id: row.account_id ?? undefined,
    account_type: row.account_type ?? undefined,
    date: row.date,
    time: row.time,
    note: row.note ?? undefined,
    created_at: row.created_at,
  };
}

export function getAllTransactions(): Transaction[] {
  const result = db.executeSync(
    'SELECT * FROM transactions ORDER BY created_at DESC',
  );
  return ((result.rows ?? []) as any[]).map(mapRow);
}

export function getTransactionsByAccount(accountId: string): Transaction[] {
  const result = db.executeSync(
    'SELECT * FROM transactions WHERE account_id = ? ORDER BY created_at DESC',
    [accountId],
  );
  return ((result.rows ?? []) as any[]).map(mapRow);
}

export function getTransactionsByDateRange(
  from: string,
  to: string,
): Transaction[] {
  const result = db.executeSync(
    'SELECT * FROM transactions WHERE date BETWEEN ? AND ? ORDER BY created_at DESC',
    [from, to],
  );
  return ((result.rows ?? []) as any[]).map(mapRow);
}

export function getTransactionsByCategory(
  category: string,
): Transaction[] {
  const result = db.executeSync(
    'SELECT * FROM transactions WHERE category = ? ORDER BY created_at DESC',
    [category],
  );
  return ((result.rows ?? []) as any[]).map(mapRow);
}

export function insertTransaction(tx: Transaction): void {
  db.executeSync(
    `INSERT INTO transactions (id, title, subtitle, amount, type, category, account_id, account_type, date, time, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tx.id,
      tx.title,
      tx.subtitle,
      tx.amount,
      tx.type,
      tx.category,
      tx.account_id ?? null,
      tx.account_type ?? null,
      tx.date,
      tx.time,
      tx.note ?? null,
      tx.created_at ?? Date.now(),
    ],
  );
}

export function updateTransaction(tx: Transaction): void {
  db.executeSync(
    `UPDATE transactions
     SET title = ?, subtitle = ?, amount = ?, type = ?, category = ?,
         account_id = ?, account_type = ?, date = ?, time = ?, note = ?
     WHERE id = ?`,
    [
      tx.title,
      tx.subtitle,
      tx.amount,
      tx.type,
      tx.category,
      tx.account_id ?? null,
      tx.account_type ?? null,
      tx.date,
      tx.time,
      tx.note ?? null,
      tx.id,
    ],
  );
}

export function deleteTransaction(id: string): void {
  db.executeSync('DELETE FROM transactions WHERE id = ?', [id]);
}
