import {open} from '@op-engineering/op-sqlite';
import {
  CREATE_ACCOUNTS_BANK,
  CREATE_ACCOUNTS_CARD,
  CREATE_ACCOUNTS_CASH,
  CREATE_ACCOUNTS_INVESTMENT,
  CREATE_IDX_TRANSACTIONS_ACCOUNT,
  CREATE_IDX_TRANSACTIONS_CATEGORY,
  CREATE_IDX_TRANSACTIONS_DATE,
  CREATE_TRANSACTIONS,
} from './schema';

export const db = open({name: 'moniqo.db'});

let initialized = false;

export function initDatabase(): void {
  if (initialized) {
    return;
  }
  db.executeSync(CREATE_ACCOUNTS_BANK);
  db.executeSync(CREATE_ACCOUNTS_CARD);
  db.executeSync(CREATE_ACCOUNTS_INVESTMENT);
  db.executeSync(CREATE_ACCOUNTS_CASH);
  db.executeSync(CREATE_TRANSACTIONS);
  db.executeSync(CREATE_IDX_TRANSACTIONS_DATE);
  db.executeSync(CREATE_IDX_TRANSACTIONS_ACCOUNT);
  db.executeSync(CREATE_IDX_TRANSACTIONS_CATEGORY);
  initialized = true;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
