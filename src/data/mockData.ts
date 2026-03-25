import { Account, BalanceBar, SummaryItem, Transaction } from '../types';

export const TOTAL_BALANCE = 125000;

export const BALANCE_CHANGE = 20000;

export const BALANCE_BARS: BalanceBar[] = [
  { value: 40, maxValue: 100 },
  { value: 55, maxValue: 100 },
  { value: 35, maxValue: 100 },
  { value: 65, maxValue: 100 },
  { value: 50, maxValue: 100 },
  { value: 75, maxValue: 100 },
  { value: 90, maxValue: 100 },
];

export const SUMMARY_ITEMS: SummaryItem[] = [
  { label: 'INCOME', amount: 45000, type: 'income' },
  { label: 'EXPENSE', amount: 12000, type: 'expense' },
  { label: 'SAVINGS', amount: 88000, type: 'savings' },
];

export const ACCOUNTS: Account[] = [
  {
    id: '1',
    bankName: 'HDFC',
    bankCode: 'HDFC',
    accountType: 'SAVINGS ACCOUNT',
    balance: 82450.0,
    color: '#003087',
  },
  {
    id: '2',
    bankName: 'ICICI',
    bankCode: 'ICICI',
    accountType: 'CURRENT ACCOUNT',
    balance: 42550.0,
    color: '#F97316',
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Dining & Food',
    subtitle: 'Swiggy',
    time: '12:45 PM',
    amount: -450,
    type: 'expense',
    category: 'dining',
    date: 'today',
  },
  {
    id: '2',
    title: 'Salary Credit',
    subtitle: 'Tech Corp',
    time: '09:00 AM',
    amount: 85000,
    type: 'income',
    category: 'salary',
    date: 'today',
  },
  {
    id: '3',
    title: 'Shopping',
    subtitle: 'Amazon',
    time: '06:20 PM',
    amount: -2100,
    type: 'expense',
    category: 'shopping',
    date: 'yesterday',
  },
  {
    id: '4',
    title: 'Transport',
    subtitle: 'Uber',
    time: '08:30 AM',
    amount: -190,
    type: 'expense',
    category: 'transport',
    date: 'yesterday',
  },
];

export const USER_NAME = 'Good Evening';
export const APP_TITLE = 'Expense Tracker';
