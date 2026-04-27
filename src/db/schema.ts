export const CREATE_ACCOUNTS_BANK = `
CREATE TABLE IF NOT EXISTS accounts_bank (
  id           TEXT PRIMARY KEY,
  bank_name    TEXT NOT NULL,
  account_type TEXT NOT NULL,
  balance      REAL NOT NULL DEFAULT 0,
  color        TEXT NOT NULL,
  icon         TEXT NOT NULL DEFAULT 'bank',
  status       TEXT NOT NULL DEFAULT 'ACTIVE',
  note         TEXT,
  created_at   INTEGER NOT NULL
)`;

export const CREATE_ACCOUNTS_CARD = `
CREATE TABLE IF NOT EXISTS accounts_card (
  id           TEXT PRIMARY KEY,
  card_name    TEXT NOT NULL,
  card_type    TEXT NOT NULL,
  due_amount   REAL NOT NULL DEFAULT 0,
  due_label    TEXT NOT NULL,
  color        TEXT NOT NULL,
  note         TEXT,
  created_at   INTEGER NOT NULL
)`;

export const CREATE_ACCOUNTS_INVESTMENT = `
CREATE TABLE IF NOT EXISTS accounts_investment (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  amount     REAL NOT NULL DEFAULT 0,
  icon       TEXT NOT NULL DEFAULT 'trend',
  color      TEXT NOT NULL,
  note       TEXT,
  created_at INTEGER NOT NULL
)`;

export const CREATE_ACCOUNTS_CASH = `
CREATE TABLE IF NOT EXISTS accounts_cash (
  id         TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  sublabel   TEXT NOT NULL,
  amount     REAL NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
)`;

export const CREATE_TRANSACTIONS = `
CREATE TABLE IF NOT EXISTS transactions (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  subtitle     TEXT NOT NULL,
  amount       REAL NOT NULL,
  type         TEXT NOT NULL,
  category     TEXT NOT NULL,
  account_id   TEXT,
  account_type TEXT,
  date         TEXT NOT NULL,
  time         TEXT NOT NULL,
  note         TEXT,
  created_at   INTEGER NOT NULL
)`;

export const CREATE_IDX_TRANSACTIONS_DATE =
  'CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date DESC)';

export const CREATE_IDX_TRANSACTIONS_ACCOUNT =
  'CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions (account_id, account_type)';

export const CREATE_IDX_TRANSACTIONS_CATEGORY =
  'CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category)';

export const CREATE_CATEGORIES = `
CREATE TABLE IF NOT EXISTS categories (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  emoji      TEXT NOT NULL,
  type       TEXT NOT NULL,
  color      TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
)`;

export const CREATE_BUDGETS = `
CREATE TABLE IF NOT EXISTS budgets (
  id          TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  amount      REAL NOT NULL,
  period      TEXT NOT NULL DEFAULT 'monthly',
  created_at  INTEGER NOT NULL
)`;
