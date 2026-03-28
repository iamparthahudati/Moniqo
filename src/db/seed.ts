import { SQLBatchTuple } from '@op-engineering/op-sqlite';
import {
  BANK_ACCOUNTS,
  CARD_ACCOUNTS,
  CASH_ENTRIES,
  INVESTMENTS,
  TRANSACTIONS,
} from '../data/mockData';
import { db } from './database';

export function seedIfEmpty(): void {
  const result = db.executeSync('SELECT COUNT(*) as count FROM accounts_bank');
  if (((result.rows as any[])?.[0]?.count ?? 0) > 0) {
    return;
  }

  const now = Date.now();

  const commands: SQLBatchTuple[] = [];

  for (const b of BANK_ACCOUNTS) {
    commands.push([
      `INSERT INTO accounts_bank (id, bank_name, account_type, balance, color, icon, status, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.id,
        b.bankName,
        b.accountType,
        b.balance,
        b.color,
        b.icon,
        b.status,
        b.note ?? null,
        now,
      ],
    ]);
  }

  for (const c of CARD_ACCOUNTS) {
    commands.push([
      `INSERT INTO accounts_card (id, card_name, card_type, due_amount, due_label, color, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c.id,
        c.cardName,
        c.cardType,
        c.dueAmount,
        c.dueLabel,
        c.color,
        c.note ?? null,
        now,
      ],
    ]);
  }

  for (const i of INVESTMENTS) {
    commands.push([
      `INSERT INTO accounts_investment (id, name, amount, icon, color, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [i.id, i.name, i.amount, i.icon, i.color, i.note ?? null, now],
    ]);
  }

  for (const c of CASH_ENTRIES) {
    commands.push([
      `INSERT INTO accounts_cash (id, label, sublabel, amount, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [c.id, c.label, c.sublabel, c.amount, now],
    ]);
  }

  for (const t of TRANSACTIONS) {
    commands.push([
      `INSERT INTO transactions (id, title, subtitle, amount, type, category, account_id, account_type, date, time, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        t.id,
        t.title,
        t.subtitle,
        t.amount,
        t.type,
        t.category,
        t.account_id ?? null,
        t.account_type ?? null,
        t.date,
        t.time,
        t.note ?? null,
        now,
      ],
    ]);
  }

  db.executeBatch(commands).catch(error => {
    console.error('[seedIfEmpty] Batch seed failed:', error);
  });
}
