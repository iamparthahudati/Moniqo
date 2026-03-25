import React from 'react';
import { Text, View } from 'react-native';
import { SUMMARY_ITEMS } from '../../data/mockData';
import { ArrowDownIcon, ArrowUpIcon, WalletsIcon } from '../../icons/Icons';
import { SummaryItem } from '../../types';
import { styles } from './SummaryStats.styles';

const getIcon = (type: SummaryItem['type']) => {
  switch (type) {
    case 'income':
      return <ArrowDownIcon size={20} color="#22C55E" />;
    case 'expense':
      return <ArrowUpIcon size={20} color="#EF4444" />;
    case 'savings':
      return <WalletsIcon size={20} color="#3B82F6" />;
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

const formatShort = (amount: number): string => {
  if (amount >= 1000) {
    return `\u20B9${(amount / 1000).toFixed(0)}k`;
  }
  return `\u20B9${amount}`;
};

const SummaryStats: React.FC = () => {
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
};

export default SummaryStats;
