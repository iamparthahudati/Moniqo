import React from 'react';
import { Text, View } from 'react-native';
import {
  BALANCE_BARS,
  BALANCE_CHANGE,
  TOTAL_BALANCE,
} from '../../data/mockData';
import { TrendUpIcon } from '../../icons/Icons';
import { formatCurrency } from '../../utils/formatters';
import { styles } from './BalanceCard.styles';

const BalanceCard: React.FC = React.memo(() => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>TOTAL BALANCE</Text>
        <View style={styles.badge}>
          <TrendUpIcon size={12} color="#FFFFFF" />
          <Text style={styles.badgeText}>
            +{formatCurrency(BALANCE_CHANGE)}
          </Text>
        </View>
      </View>

      <Text style={styles.balanceAmount}>{formatCurrency(TOTAL_BALANCE)}</Text>

      <View style={styles.barsContainer}>
        {BALANCE_BARS.map((bar, index) => (
          <View key={index} style={styles.barWrapper}>
            <View style={[styles.barFill, { height: `${bar.value}%` }]} />
          </View>
        ))}
      </View>
    </View>
  );
});

export default BalanceCard;
