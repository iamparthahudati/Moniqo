import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import IconCircle from '../components/ui/IconCircle';
import ScreenHeader from '../components/ui/ScreenHeader';
import TabSwitcher from '../components/ui/TabSwitcher';
import {
  ANALYTICS_SAVINGS_RATE,
  ANALYTICS_TOTAL_EXPENSE,
  ANALYTICS_TOTAL_INCOME,
  MONTHLY_DATA,
  SPENDING_CATEGORIES,
  TRANSACTIONS,
} from '../data/mockData';
import { AnalyticsPeriod, MonthlyData, SpendingCategory } from '../types';
import { formatShort } from '../utils/formatters';
import { styles } from './AnalyticsScreen.styles';

// ── Constants ─────────────────────────────────────────────────────────────────

const PERIODS: AnalyticsPeriod[] = ['Week', 'Month', 'Year'];

// ── Sub-components ────────────────────────────────────────────────────────────

const SummaryRow: React.FC = React.memo(() => (
  <View style={styles.summaryRow}>
    <View style={[styles.summaryCard, styles.summaryCardIncome]}>
      <Text style={styles.summaryLabel}>Income</Text>
      <Text style={[styles.summaryAmount, styles.summaryAmountIncome]}>
        {formatShort(ANALYTICS_TOTAL_INCOME)}
      </Text>
    </View>
    <View style={[styles.summaryCard, styles.summaryCardExpense]}>
      <Text style={styles.summaryLabel}>Expense</Text>
      <Text style={[styles.summaryAmount, styles.summaryAmountExpense]}>
        {formatShort(ANALYTICS_TOTAL_EXPENSE)}
      </Text>
    </View>
    <View style={[styles.summaryCard, styles.summaryCardSavings]}>
      <Text style={styles.summaryLabel}>Saved</Text>
      <Text style={styles.summaryAmount}>
        {formatShort(ANALYTICS_TOTAL_INCOME - ANALYTICS_TOTAL_EXPENSE)}
      </Text>
    </View>
  </View>
));

const BarChart: React.FC<{ data: MonthlyData[] }> = React.memo(({ data }) => {
  const maxVal = useMemo(
    () => Math.max(...data.map(d => Math.max(d.income, d.expense))),
    [data],
  );
  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Income vs Expense</Text>
      <View style={styles.chartArea}>
        {data.map(d => {
          const incomeH = Math.round((d.income / maxVal) * 110);
          const expenseH = Math.round((d.expense / maxVal) * 110);
          return (
            <View key={d.month} style={styles.chartBarGroup}>
              <View style={styles.chartBarPair}>
                <View style={[styles.chartBarIncome, { height: incomeH }]} />
                <View style={[styles.chartBarExpense, { height: expenseH }]} />
              </View>
              <Text style={styles.chartMonthLabel}>{d.month}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotIncome]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotExpense]} />
          <Text style={styles.legendText}>Expense</Text>
        </View>
      </View>
    </View>
  );
});

const SavingsRateCard: React.FC = React.memo(() => (
  <View style={styles.savingsCard}>
    <Text style={styles.savingsLabel}>Savings Rate</Text>
    <View style={styles.savingsRow}>
      <Text style={styles.savingsRate}>{ANALYTICS_SAVINGS_RATE}</Text>
      <Text style={styles.savingsPct}>%</Text>
    </View>
    <Text style={styles.savingsSubtext}>of your income saved this month</Text>
    <View style={styles.savingsBar}>
      <View
        style={[styles.savingsBarFill, { width: `${ANALYTICS_SAVINGS_RATE}%` }]}
      />
    </View>
  </View>
));

const CategoryBreakdown: React.FC<{ categories: SpendingCategory[] }> =
  React.memo(({ categories }) => (
    <View style={styles.categoryCard}>
      <Text style={styles.categoryTitle}>Spending by Category</Text>
      {categories.map(cat => (
        <View key={cat.id} style={styles.categoryRow}>
          <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
            <View style={styles.categoryBarBg}>
              <View
                style={[
                  styles.categoryBarFill,
                  { width: `${cat.percentage}%`, backgroundColor: cat.color },
                ]}
              />
            </View>
          </View>
          <View style={styles.categoryRight}>
            <Text style={styles.categoryAmount}>{formatShort(cat.amount)}</Text>
            <Text style={styles.categoryPct}>{cat.percentage}%</Text>
          </View>
        </View>
      ))}
    </View>
  ));

const TopTransactions: React.FC = React.memo(() => {
  const expenses = TRANSACTIONS.filter(t => t.type === 'expense').slice(0, 3);
  const categoryColors: Record<string, string> = {
    dining: '#EF4444',
    shopping: '#3B82F6',
    transport: '#F97316',
    other: '#94A3B8',
  };
  const categoryEmojis: Record<string, string> = {
    dining: '\uD83C\uDF74',
    shopping: '\uD83D\uDED2',
    transport: '\uD83D\uDE97',
    other: '\u2022',
  };
  return (
    <View style={styles.topCard}>
      <Text style={styles.topTitle}>Top Expenses</Text>
      {expenses.map(t => {
        const color = categoryColors[t.category] ?? '#94A3B8';
        const emoji = categoryEmojis[t.category] ?? '\u2022';
        const absAmount = Math.abs(t.amount).toLocaleString('en-IN');
        return (
          <View key={t.id} style={styles.topRow}>
            <IconCircle size={40} backgroundColor={`${color}18`}>
              <Text style={styles.topEmojiText}>{emoji}</Text>
            </IconCircle>
            <View style={styles.topInfo}>
              <Text style={styles.topName}>{t.title}</Text>
              <Text style={styles.topSub}>
                {t.subtitle}
                {' \u2022 '}
                {t.time}
              </Text>
            </View>
            <Text style={styles.topAmount}>
              {'-\u20B9'}
              {absAmount}
            </Text>
          </View>
        );
      })}
    </View>
  );
});

// ── Screen ────────────────────────────────────────────────────────────────────

const AnalyticsScreen: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('Month');

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Analytics"
        rightSlot={
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.headerPeriod}>Dec 2024</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.periodWrapper}>
          <TabSwitcher
            tabs={PERIODS}
            activeTab={period}
            onSelect={p => setPeriod(p as AnalyticsPeriod)}
          />
        </View>
        <SummaryRow />
        <BarChart data={MONTHLY_DATA} />
        <SavingsRateCard />
        <CategoryBreakdown categories={SPENDING_CATEGORIES} />
        <TopTransactions />
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
