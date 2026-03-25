import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TRANSACTIONS } from '../../data/mockData';
import {
  DiningIcon,
  SalaryIcon,
  ShoppingIcon,
  TransportIcon,
} from '../../icons/Icons';
import { Transaction, TransactionCategory } from '../../types';
import { formatAmount } from '../../utils/formatters';
import { styles } from './RecentTransactions.styles';

const getCategoryIcon = (category: TransactionCategory) => {
  switch (category) {
    case 'dining':
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

const getCategoryIconStyle = (category: TransactionCategory) => {
  switch (category) {
    case 'dining':
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

const groupByDate = (transactions: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {};
  transactions.forEach(t => {
    const key = t.date;
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  return groups;
};

const formatDateLabel = (date: string): string => {
  if (date === 'today') return 'TODAY';
  if (date === 'yesterday') return 'YESTERDAY';
  return date.toUpperCase();
};

const TransactionItem: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => (
  <View style={styles.transactionCard}>
    <View
      style={[styles.iconWrapper, getCategoryIconStyle(transaction.category)]}
    >
      {getCategoryIcon(transaction.category)}
    </View>
    <View style={styles.textGroup}>
      <Text style={styles.title}>{transaction.title}</Text>
      <Text style={styles.subtitle}>
        {transaction.subtitle} \u2022 {transaction.time}
      </Text>
    </View>
    <Text
      style={
        transaction.type === 'income'
          ? styles.amountIncome
          : styles.amountExpense
      }
    >
      {formatAmount(transaction.amount)}
    </Text>
  </View>
);

const RecentTransactions: React.FC = () => {
  const groups = groupByDate(TRANSACTIONS);
  const dateOrder = ['today', 'yesterday'];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>SEE ALL</Text>
        </TouchableOpacity>
      </View>

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
};

export default RecentTransactions;
