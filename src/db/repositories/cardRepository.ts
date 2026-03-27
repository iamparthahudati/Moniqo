import {CardAccount} from '../../types';
import {db} from '../database';

function mapRow(row: Record<string, any>): CardAccount {
  return {
    id: row.id,
    cardName: row.card_name,
    cardType: row.card_type,
    dueAmount: row.due_amount,
    dueLabel: row.due_label,
    color: row.color,
    note: row.note ?? undefined,
    created_at: row.created_at,
  };
}

export function getAllCards(): CardAccount[] {
  const result = db.executeSync(
    'SELECT * FROM accounts_card ORDER BY created_at ASC',
  );
  return ((result.rows ?? []) as any[]).map(mapRow);
}

export function insertCard(card: CardAccount): void {
  db.executeSync(
    `INSERT INTO accounts_card (id, card_name, card_type, due_amount, due_label, color, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      card.id,
      card.cardName,
      card.cardType,
      card.dueAmount,
      card.dueLabel,
      card.color,
      card.note ?? null,
      card.created_at ?? Date.now(),
    ],
  );
}

export function updateCard(card: CardAccount): void {
  db.executeSync(
    `UPDATE accounts_card
     SET card_name = ?, card_type = ?, due_amount = ?, due_label = ?, color = ?, note = ?
     WHERE id = ?`,
    [
      card.cardName,
      card.cardType,
      card.dueAmount,
      card.dueLabel,
      card.color,
      card.note ?? null,
      card.id,
    ],
  );
}

export function deleteCard(id: string): void {
  db.executeSync('DELETE FROM accounts_card WHERE id = ?', [id]);
}
