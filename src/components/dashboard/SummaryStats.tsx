import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { ArrowDownIcon, ArrowUpIcon, WalletsIcon } from '../../icons/Icons';
import { useTransactions } from '../../store/transactionsStore';
import { Colors } from '../../theme/colors';
import { SummaryItem } from '../../types';
import { formatShort } from '../../utils/formatters';
import { styles } from './SummaryStats.styles';

const getIcon = (type: SummaryItem['type']) => {
  switch (type) {
    case 'income':
      return <ArrowDownIcon size={20} color={Colors.incomeGreen} />;
    case 'expense':
      return <ArrowUpIcon size={20} color={Colors.expenseRed} />;
    case 'savings':
      return <WalletsIcon size={20} color={Colors.savingsBlue} />;
  }
};

const getIconStyle = (type: SummaryItem['type']) => {
  switch (type) {
    case 'income':
      return styles.iconIncome;
    case 'expense':
      return styles.iconExpense;
    case 'savings':
      return styles.iconSavings;
  }
};

const getAmountStyle = (type: SummaryItem['type']) => {
  switch (type) {
    case 'income':
      return styles.amountIncome;
    case 'expense':
      return styles.amountExpense;
    case 'savings':
      return styles.amountSavings;
  }
};

const SummaryStats: React.FC = React.memo(() => {
  const { state } = useTransactions();

  const summaryItems = useMemo<SummaryItem[]>(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}`;

    const monthlyTransactions = state.transactions.filter(t =>
      t.date.startsWith(currentMonth),
    );

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const savings = totalIncome - totalExpense;

    return [
      { label: 'Income', type: 'income', amount: totalIncome },
      { label: 'Expenses', type: 'expense', amount: totalExpense },
      { label: 'Savings', type: 'savings', amount: savings },
    ];
  }, [state.transactions]);

  return (
    <View style={styles.container}>
      {summaryItems.map(item => (
        <View key={item.label} style={styles.card}>
          <View style={[styles.iconWrapper, getIconStyle(item.type)]}>
            {getIcon(item.type)}
          </View>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={[styles.amount, getAmountStyle(item.type)]}>
            {formatShort(item.amount)}
          </Text>
        </View>
      ))}
    </View>
  );
});

export default SummaryStats;
