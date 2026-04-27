export type TabName =
  | 'Dashboard'
  | 'Analytics'
  | 'Accounts'
  | 'Budget'
  | 'Settings';

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  account_id?: string;
  account_type?: 'bank' | 'card' | 'cash' | 'investment';
  date: string;
  time: string;
  note?: string;
  created_at: number;
}

export type TransactionCategory =
  | 'dining'
  | 'salary'
  | 'shopping'
  | 'transport'
  | 'health'
  | 'entertainment'
  | 'utilities'
  | 'other';

export interface Account {
  id: string;
  bankName: string;
  bankCode: string;
  accountType: string;
  balance: number;
  color: string;
}

export interface BalanceBar {
  value: number;
  maxValue: number;
}

export interface SummaryItem {
  label: string;
  amount: number;
  type: 'income' | 'expense' | 'savings';
}

// Accounts screen types
export type AccountColor =
  | '#003087'
  | '#F97316'
  | '#1E40AF'
  | '#22C55E'
  | '#EF4444'
  | '#8B5CF6'
  | '#0F172A'
  | '#F59E0B';

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  balance: number;
  color: string;
  status: 'ACTIVE' | 'INACTIVE';
  icon: 'bank' | 'piggy';
  note?: string;
  created_at: number;
}

export interface CardAccount {
  id: string;
  cardName: string;
  cardType: string;
  dueAmount: number;
  dueLabel: string;
  color: string;
  note?: string;
  created_at: number;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  icon: 'trend' | 'bitcoin' | 'gold' | 'other';
  color: string;
  note?: string;
  created_at: number;
}

export interface CashEntry {
  id: string;
  label: string;
  sublabel: string;
  amount: number;
  created_at: number;
}

// Analytics screen types
export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface SpendingCategory {
  id: string;
  label: string;
  amount: number;
  percentage: number;
  color: string;
  emoji: string;
}

export type AnalyticsPeriod = 'Week' | 'Month' | 'Year';
