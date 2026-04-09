import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { TrendUpIcon } from '../../icons/Icons';
import { computeTotalBalance, useAccounts } from '../../store/accountsStore';
import { useTransactions } from '../../store/transactionsStore';
import { Colors } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatters';
import { styles } from './BalanceCard.styles';

const BalanceCard: React.FC = React.memo(() => {
  const { state: accountsState } = useAccounts();
  const { state: transactionsState } = useTransactions();

  const totalBalance = useMemo(
    () => computeTotalBalance(accountsState),
    [accountsState],
  );

  const { monthlyNetChange, balanceBars } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Compute today's date string and the 7-day window
    const todayMs = new Date(
      currentYear,
      currentMonth,
      now.getDate(),
    ).getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    // Build date strings for the last 7 days (oldest first)
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayMs - i * dayMs);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      last7Days.push(`${yyyy}-${mm}-${dd}`);
    }

    const transactions = transactionsState.transactions;

    // Monthly net change: income - expense for current month
    let income = 0;
    let expense = 0;

    // Daily totals map: dateString -> total absolute amount
    const dailyTotals: Record<string, number> = {};
    last7Days.forEach(d => {
      dailyTotals[d] = 0;
    });

    transactions.forEach(tx => {
      // ISO date: YYYY-MM-DD
      const txDate = tx.date; // e.g. "2026-03-15"
      const parts = txDate.split('-');
      if (parts.length !== 3) return;

      const txYear = parseInt(parts[0], 10);
      const txMonth = parseInt(parts[1], 10) - 1; // 0-indexed

      // Monthly aggregation
      if (txYear === currentYear && txMonth === currentMonth) {
        if (tx.type === 'income') {
          income += tx.amount;
        } else {
          expense += tx.amount;
        }
      }

      // 7-day bar aggregation
      if (txDate in dailyTotals) {
        dailyTotals[txDate] += Math.abs(tx.amount);
      }
    });

    const netChange = income - expense;

    // Build bars: ratio relative to the busiest day
    const dayValues = last7Days.map(d => dailyTotals[d]);
    const maxValue = Math.max(...dayValues, 0);

    const bars = dayValues.map(val => ({
      value: maxValue > 0 ? (val / maxValue) * 100 : 0,
    }));

    return { monthlyNetChange: netChange, balanceBars: bars };
  }, [transactionsState]);

  const isPositive = monthlyNetChange >= 0;
  const badgeSign = isPositive ? '+' : '-';
  const badgeBg = isPositive ? Colors.badgeGreen : Colors.badgeRed;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>TOTAL BALANCE</Text>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          {isPositive ? (
            <TrendUpIcon size={12} color={Colors.white} />
          ) : (
            <Text style={styles.trendDownArrow}>{'\u2198'}</Text>
          )}
          <Text style={styles.badgeText}>
            {badgeSign}
            {formatCurrency(Math.abs(monthlyNetChange))}
          </Text>
        </View>
      </View>

      <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>

      <View style={styles.barsContainer}>
        {balanceBars.map((bar, index) => (
          <View key={index} style={styles.barWrapper}>
            <View style={[styles.barFill, { height: `${bar.value}%` }]} />
          </View>
        ))}
      </View>
    </View>
  );
});

export default BalanceCard;
