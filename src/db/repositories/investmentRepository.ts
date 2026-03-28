import { Investment } from '../../types';
import { db } from '../database';

function mapRow(row: Record<string, any>): Investment {
  return {
    id: row.id,
    name: row.name,
    amount: row.amount,
    icon: row.icon,
    color: row.color,
    note: row.note ?? undefined,
    created_at: row.created_at,
  };
}

export function getAllInvestments(): Investment[] {
  const result = db.executeSync(
    'SELECT * FROM accounts_investment ORDER BY created_at ASC',
  );
  return ((result.rows ?? []) as any[]).map(mapRow);
}

export function insertInvestment(inv: Investment): void {
  db.executeSync(
    `INSERT INTO accounts_investment (id, name, amount, icon, color, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      inv.id,
      inv.name,
      inv.amount,
      inv.icon,
      inv.color,
      inv.note ?? null,
      inv.created_at ?? Date.now(),
    ],
  );
}

export function updateInvestment(inv: Investment): void {
  db.executeSync(
    `UPDATE accounts_investment
     SET name = ?, amount = ?, icon = ?, color = ?, note = ?
     WHERE id = ?`,
    [inv.name, inv.amount, inv.icon, inv.color, inv.note ?? null, inv.id],
  );
}

export function deleteInvestment(id: string): void {
  db.executeSync('DELETE FROM accounts_investment WHERE id = ?', [id]);
}

export function updateInvestmentAmount(id: string, delta: number): void {
  db.executeSync(
    'UPDATE accounts_investment SET amount = amount + ? WHERE id = ?',
    [delta, id],
  );
}
