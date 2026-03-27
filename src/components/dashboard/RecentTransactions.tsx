import React, {useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  DiningIcon,
  SalaryIcon,
  ShoppingIcon,
  TransportIcon,
} from '../../icons/Icons';
import {useTransactions} from '../../store/transactionsStore';
import {Transaction} from '../../types';
import {formatAmount} from '../../utils/formatters';
import {styles} from './RecentTransactions.styles';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'dining':
    case 'food':
      return <DiningIcon size={26} />;
    case 'salary':
      return <SalaryIcon size={26} />;
    case 'shopping':
      return <ShoppingIcon size={26} />;
    case 'transport':
      return <TransportIcon size={26} />;
    default:
      return <DiningIcon size={26} />;
  }
};

const getCategoryIconStyle = (category: string) => {
  switch (category) {
    case 'dining':
    case 'food':
      return styles.iconDining;
    case 'salary':
      return styles.iconSalary;
    case 'shopping':
      return styles.iconShopping;
    case 'transport':
      return styles.iconTransport;
    default:
      return styles.iconOther;
  }
};

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

const groupByDate = (transactions: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {};
  transactions.forEach(t => {
    const key = t.date;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(t);
  });
  return groups;
};

const formatDateLabel = (date: string): string => {
  const today = getTodayISO();
  const yesterday = getYesterdayISO();
  if (date === today || date === 'today') {
    return 'TODAY';
  }
  if (date === yesterday || date === 'yesterday') {
    return 'YESTERDAY';
  }
  // Format as readable date
  const d = new Date(date + 'T00:00:00');
  if (isNaN(d.getTime())) {
    return date.toUpperCase();
  }
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
};

const TransactionItem: React.FC<{transaction: Transaction}> = React.memo(
  ({transaction}) => (
    <View style={styles.transactionCard}>
      <View
        style={[
          styles.iconWrapper,
          getCategoryIconStyle(transaction.category),
        ]}>
        {getCategoryIcon(transaction.category)}
      </View>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.subtitle}>
          {transaction.subtitle}
          {' \u2022 '}
          {transaction.time}
        </Text>
      </View>
      <Text
        style={
          transaction.type === 'income'
            ? styles.amountIncome
            : styles.amountExpense
        }>
        {formatAmount(transaction.amount)}
      </Text>
    </View>
  ),
);

const RecentTransactions: React.FC = React.memo(() => {
  const {state} = useTransactions();

  // Take the 10 most recent transactions (already sorted by created_at DESC)
  const recent = useMemo(
    () => state.transactions.slice(0, 10),
    [state.transactions],
  );

  const groups = useMemo(() => groupByDate(recent), [recent]);

  // Sort date keys: today first, yesterday second, then descending
  const dateOrder = useMemo(() => {
    const today = getTodayISO();
    const yesterday = getYesterdayISO();
    const keys = Object.keys(groups);
    return keys.sort((a, b) => {
      if (a === today || a === 'today') {
        return -1;
      }
      if (b === today || b === 'today') {
        return 1;
      }
      if (a === yesterday || a === 'yesterday') {
        return -1;
      }
      if (b === yesterday || b === 'yesterday') {
        return 1;
      }
      return b.localeCompare(a);
    });
  }, [groups]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>SEE ALL</Text>
        </TouchableOpacity>
      </View>

      {dateOrder.length === 0 && (
        <Text style={styles.subtitle}>No transactions yet</Text>
      )}

      {dateOrder.map(date =>
        groups[date] ? (
          <View key={date}>
            <Text style={styles.dateLabel}>{formatDateLabel(date)}</Text>
            {groups[date].map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </View>
        ) : null,
      )}
    </View>
  );
});

export default RecentTransactions;
