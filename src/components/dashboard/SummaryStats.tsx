import React from 'react';
import { Text, View } from 'react-native';
import { SUMMARY_ITEMS } from '../../data/mockData';
import { ArrowDownIcon, ArrowUpIcon, WalletsIcon } from '../../icons/Icons';
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
  return (
    <View style={styles.container}>
      {SUMMARY_ITEMS.map(item => (
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
