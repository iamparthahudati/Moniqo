import {
  Account,
  BalanceBar,
  BankAccount,
  CardAccount,
  CashEntry,
  Investment,
  MonthlyData,
  SpendingCategory,
  SummaryItem,
  Transaction,
} from '../types';

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
  {
    id: '3',
    bankName: 'SBI',
    bankCode: 'SBI',
    accountType: 'SALARY ACCOUNT',
    balance: 10000.0,
    color: '#1E40AF',
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

// ── Accounts screen data ──────────────────────────────────────────────────────

export const ACCOUNTS_TOTAL_BALANCE = 235000;
export const ACCOUNTS_BALANCE_CHANGE_PCT = '+2.4%';

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'b1',
    bankName: 'HDFC Bank',
    accountType: 'Savings Account',
    balance: 142000,
    color: '#003087',
    status: 'ACTIVE',
    icon: 'bank',
  },
  {
    id: 'b2',
    bankName: 'SBI Bank',
    accountType: 'Salary Account',
    balance: 82500,
    color: '#1E40AF',
    status: 'ACTIVE',
    icon: 'piggy',
  },
];

export const CARD_ACCOUNTS: CardAccount[] = [
  {
    id: 'c1',
    cardName: 'ICICI Credit Card',
    cardType: 'Platinum Rewards',
    dueAmount: 12400,
    dueLabel: 'DUE IN 5 DAYS',
    color: '#EF4444',
  },
];

export const INVESTMENTS: Investment[] = [
  {
    id: 'i1',
    name: 'Mutual Funds',
    amount: 22900,
    icon: 'trend',
    color: '#22C55E',
  },
  {
    id: 'i2',
    name: 'Crypto Assets',
    amount: 4000,
    icon: 'bitcoin',
    color: '#2B3FE8',
  },
];

export const CASH_ENTRIES: CashEntry[] = [
  { id: 'cash1', label: 'Cash in Hand', sublabel: 'ESTIMATED', amount: 500 },
];

// ── Analytics screen data ─────────────────────────────────────────────────────

export const MONTHLY_DATA: MonthlyData[] = [
  { month: 'Jul', income: 85000, expense: 32000 },
  { month: 'Aug', income: 85000, expense: 41000 },
  { month: 'Sep', income: 90000, expense: 28000 },
  { month: 'Oct', income: 85000, expense: 38000 },
  { month: 'Nov', income: 92000, expense: 35000 },
  { month: 'Dec', income: 85000, expense: 12000 },
];

export const SPENDING_CATEGORIES: SpendingCategory[] = [
  {
    id: 'food',
    label: 'Food & Dining',
    amount: 4500,
    percentage: 37,
    color: '#EF4444',
    emoji: '\uD83C\uDF74',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    amount: 3200,
    percentage: 27,
    color: '#3B82F6',
    emoji: '\uD83D\uDED2',
  },
  {
    id: 'transport',
    label: 'Transport',
    amount: 1800,
    percentage: 15,
    color: '#F97316',
    emoji: '\uD83D\uDE97',
  },
  {
    id: 'bills',
    label: 'Bills',
    amount: 1500,
    percentage: 12,
    color: '#8B5CF6',
    emoji: '\uD83E\uDDFE',
  },
  {
    id: 'other',
    label: 'Others',
    amount: 1000,
    percentage: 9,
    color: '#94A3B8',
    emoji: '\u2022\u2022\u2022',
  },
];

export const ANALYTICS_TOTAL_INCOME = 85000;
export const ANALYTICS_TOTAL_EXPENSE = 12000;
export const ANALYTICS_SAVINGS_RATE = 86;
