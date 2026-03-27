# Moniqo — SQLite Migration & Transactions Roadmap

## Overview

Replace the current in-memory `useReducer` store with a fully persistent
`op-sqlite` database. This covers accounts, transactions, and analytics —
setting up the entire data layer correctly from the start.

---

## Phase 1 — SQLite Setup & Accounts Migration

### 1.1 Install Dependencies

```bash
npm install @op-engineering/op-sqlite
cd ios && pod install
```

### 1.2 Create Database Layer

**File: `src/db/database.ts`**

- Open (or create) the SQLite database file `moniqo.db` using `open()` from `op-sqlite`
- Export a singleton `db` instance used across all repositories
- Export `initDatabase()` — runs all `CREATE TABLE IF NOT EXISTS` statements in order

**File: `src/db/schema.ts`**

- Define and export all `CREATE TABLE` SQL strings as named constants
- Tables to create (see schema section below)

### 1.3 Database Schema

```sql
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
);

CREATE TABLE IF NOT EXISTS accounts_card (
  id           TEXT PRIMARY KEY,
  card_name    TEXT NOT NULL,
  card_type    TEXT NOT NULL,
  due_amount   REAL NOT NULL DEFAULT 0,
  due_label    TEXT NOT NULL,
  color        TEXT NOT NULL,
  note         TEXT,
  created_at   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts_investment (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  amount     REAL NOT NULL DEFAULT 0,
  icon       TEXT NOT NULL DEFAULT 'trend',
  color      TEXT NOT NULL,
  note       TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts_cash (
  id         TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  sublabel   TEXT NOT NULL,
  amount     REAL NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  subtitle     TEXT NOT NULL,
  amount       REAL NOT NULL,
  type         TEXT NOT NULL,        -- 'income' | 'expense'
  category     TEXT NOT NULL,
  account_id   TEXT,                 -- FK to whichever account table
  account_type TEXT,                 -- 'bank' | 'card' | 'cash' | 'investment'
  date         TEXT NOT NULL,        -- ISO date string YYYY-MM-DD
  time         TEXT NOT NULL,
  note         TEXT,
  created_at   INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_date
  ON transactions (date DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_account
  ON transactions (account_id, account_type);

CREATE INDEX IF NOT EXISTS idx_transactions_category
  ON transactions (category);
```

### 1.4 Repository Layer

**File: `src/db/repositories/bankRepository.ts`**

- `getAllBanks(): BankAccount[]`
- `insertBank(account: Omit<BankAccount, 'id'>): BankAccount`
- `updateBank(account: BankAccount): void`
- `deleteBank(id: string): void`

**File: `src/db/repositories/cardRepository.ts`**

- `getAllCards(): CardAccount[]`
- `insertCard(card: Omit<CardAccount, 'id'>): CardAccount`
- `updateCard(card: CardAccount): void`
- `deleteCard(id: string): void`

**File: `src/db/repositories/investmentRepository.ts`**

- `getAllInvestments(): Investment[]`
- `insertInvestment(inv: Omit<Investment, 'id'>): Investment`
- `updateInvestment(inv: Investment): void`
- `deleteInvestment(id: string): void`

**File: `src/db/repositories/cashRepository.ts`**

- `getAllCash(): CashEntry[]`
- `insertCash(entry: Omit<CashEntry, 'id'>): CashEntry`
- `updateCash(entry: CashEntry): void`
- `deleteCash(id: string): void`

Each repository uses synchronous `db.execute()` calls. IDs generated via
`uuid` or `Date.now().toString()`. Rows mapped from raw SQL result to typed
objects via a local `mapRow()` helper.

### 1.5 Migrate AccountsStore

**File: `src/store/accountsStore.ts`** — update existing file:

- Remove `initialState` seeded from `mockData`
- On provider mount, call `initDatabase()` then load all four tables via
  repositories into the initial `useReducer` state
- After every `dispatch`, sync the changed entity back to SQLite via the
  matching repository (add/update/delete)
- Use a `useEffect` on `state` changes or intercept inside a custom
  `dispatchWithPersist` wrapper

### 1.6 Seed Data (first launch only)

**File: `src/db/seed.ts`**

- Check if `accounts_bank` table is empty
- If empty, insert the existing `BANK_ACCOUNTS`, `CARD_ACCOUNTS`,
  `INVESTMENTS`, `CASH_ENTRIES` from `mockData.ts` as the initial seed
- Call `seedIfEmpty()` inside `initDatabase()` after table creation

---

## Phase 2 — Transactions Functionality

### 2.1 Transaction Repository

**File: `src/db/repositories/transactionRepository.ts`**

- `getAllTransactions(): Transaction[]`
- `getTransactionsByAccount(accountId: string): Transaction[]`
- `getTransactionsByDateRange(from: string, to: string): Transaction[]`
- `getTransactionsByCategory(category: string): Transaction[]`
- `insertTransaction(tx: Omit<Transaction, 'id'>): Transaction`
- `updateTransaction(tx: Transaction): void`
- `deleteTransaction(id: string): void`

### 2.2 Transactions Store

**File: `src/store/transactionsStore.ts`**

- Same context + `useReducer` pattern as `accountsStore`
- Actions: `ADD_TRANSACTION`, `UPDATE_TRANSACTION`, `DELETE_TRANSACTION`,
  `SET_TRANSACTIONS` (bulk load)
- On mount: load all transactions from DB via `getAllTransactions()`
- On dispatch: sync to DB via repository

### 2.3 Wire AddTransactionModal

**File: `src/components/common/AddTransactionModal.tsx`** — update:

- On save, dispatch `ADD_TRANSACTION` to `transactionsStore`
- Populate `account_id` and `account_type` from a dropdown that reads live
  from `accountsStore` state (bank accounts list)
- Persist immediately to SQLite via repository

### 2.4 Wire TransferModal

**File: `src/components/common/TransferModal.tsx`** — update:

- On save, create two transaction records: one expense on the FROM account,
  one income on the TO account
- Update both account balances in `accountsStore` and SQLite

### 2.5 Recent Transactions (Dashboard)

**File: `src/components/dashboard/RecentTransactions.tsx`** — update:

- Read from `transactionsStore` instead of static `TRANSACTIONS` from
  `mockData`
- Show last 10 transactions ordered by `created_at DESC`

---

## Phase 3 — Analytics Queries

### 3.1 Analytics Repository

**File: `src/db/repositories/analyticsRepository.ts`**

- `getMonthlyTotals(year: number): MonthlyData[]`
  — `SELECT strftime('%m', date) as month, SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income, SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense FROM transactions WHERE strftime('%Y', date) = ? GROUP BY month`
- `getSpendingByCategory(from: string, to: string): SpendingCategory[]`
  — `SELECT category, SUM(ABS(amount)) as total FROM transactions WHERE type='expense' AND date BETWEEN ? AND ? GROUP BY category ORDER BY total DESC`
- `getSavingsRate(month: string, year: string): number`
  — derived from income and expense totals for the period
- `getTopExpenses(limit: number): Transaction[]`
  — `SELECT * FROM transactions WHERE type='expense' ORDER BY ABS(amount) DESC LIMIT ?`

### 3.2 Wire AnalyticsScreen

**File: `src/screens/AnalyticsScreen.tsx`** — update:

- Replace all static `MONTHLY_DATA`, `SPENDING_CATEGORIES`,
  `ANALYTICS_TOTAL_INCOME`, `ANALYTICS_TOTAL_EXPENSE`,
  `ANALYTICS_SAVINGS_RATE` constants with live queries from
  `analyticsRepository`
- Re-run queries when `period` tab changes (Week / Month / Year)
- Pass real data down to `BarChart`, `CategoryBreakdown`, `TopTransactions`,
  `SavingsRateCard`

---

## File Structure After All Phases

```
src/
├── db/
│   ├── database.ts                          # singleton db instance + initDatabase()
│   ├── schema.ts                            # all CREATE TABLE SQL strings
│   ├── seed.ts                              # first-launch seed data
│   └── repositories/
│       ├── bankRepository.ts
│       ├── cardRepository.ts
│       ├── investmentRepository.ts
│       ├── cashRepository.ts
│       ├── transactionRepository.ts
│       └── analyticsRepository.ts
├── store/
│   ├── accountsStore.ts                     # updated — reads/writes via repositories
│   └── transactionsStore.ts                 # new — transaction state + DB sync
├── components/
│   ├── common/
│   │   ├── AddTransactionModal.tsx          # updated — dispatches to store + DB
│   │   └── TransferModal.tsx                # updated — dual transaction + balance update
│   └── dashboard/
│       └── RecentTransactions.tsx           # updated — reads from transactionsStore
└── screens/
    └── AnalyticsScreen.tsx                  # updated — live SQL analytics queries
```

---

## Execution Order

```
Phase 1  →  install op-sqlite
         →  create src/db/database.ts + schema.ts
         →  create 4 account repositories
         →  create src/db/seed.ts
         →  update accountsStore.ts (load from DB + persist on dispatch)
         →  test: add/edit/delete accounts survive app restart

Phase 2  →  create transactionRepository.ts
         →  create transactionsStore.ts
         →  update AddTransactionModal + TransferModal
         →  update RecentTransactions (dashboard)
         →  test: transactions persist and appear on dashboard

Phase 3  →  create analyticsRepository.ts
         →  update AnalyticsScreen with live queries
         →  test: analytics reflect real transaction data
```

---

## Notes

- All DB operations are **synchronous** (`db.execute()`) — no async/await
  needed, no loading states for reads
- `op-sqlite` requires a **native rebuild** after install (`pod install` on
  iOS, gradle sync on Android)
- `mockData.ts` can be removed entirely after Phase 1 seed is confirmed
  working
- No backend or internet connection required — fully on-device
