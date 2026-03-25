export type TabName = 'Dashboard' | 'Analytics' | 'Wallets' | 'Settings';

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
