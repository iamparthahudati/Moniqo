export type TabName = 'Dashboard' | 'Analytics' | 'Accounts' | 'Settings';

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  amount: number;
  type: 'income' | 'expense';
  category: TransactionCategory;
  date: 'today' | 'yesterday' | string;
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
export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  balance: number;
  color: string;
  status: 'ACTIVE' | 'INACTIVE';
  icon: 'bank' | 'piggy';
}

export interface CardAccount {
  id: string;
  cardName: string;
  cardType: string;
  dueAmount: number;
  dueLabel: string;
  color: string;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  icon: 'trend' | 'bitcoin' | 'gold' | 'other';
  color: string;
}

export interface CashEntry {
  id: string;
  label: string;
  sublabel: string;
  amount: number;
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
