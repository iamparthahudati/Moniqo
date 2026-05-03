import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import IconCircle from '../components/ui/IconCircle';
import ScreenHeader from '../components/ui/ScreenHeader';
import TabSwitcher from '../components/ui/TabSwitcher';
import { useCategories } from '../store/categoriesStore';
import { useTransactions } from '../store/transactionsStore';
import {
  AnalyticsPeriod,
  MonthlyData,
  SpendingCategory,
  Transaction,
} from '../types';
import * as analytics from '../utils/analytics';
import { formatShort } from '../utils/formatters';
import { styles } from './AnalyticsScreen.styles';

// ── Constants ─────────────────────────────────────────────────────────────────

const PERIODS: AnalyticsPeriod[] = ['Week', 'Month', 'Year'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// ── Date helpers ──────────────────────────────────────────────────────────────

// Returns the anchor date shifted by offset units for the given period
function getAnchorDate(period: AnalyticsPeriod, offset: number): Date {
  const now = new Date();
  switch (period) {
    case 'Week': {
      const d = new Date(now);
      d.setDate(d.getDate() + offset * 7);
      return d;
    }
    case 'Month': {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      return d;
    }
    case 'Year': {
      const d = new Date(now.getFullYear() + offset, 0, 1);
      return d;
    }
  }
}

function getDateRange(
  period: AnalyticsPeriod,
  anchor: Date,
): { from: string; to: string } {
  const today = new Date();
  let from: Date;
  let to: Date;

  switch (period) {
    case 'Week': {
      // anchor is the "end" day of the week window
      to = new Date(anchor);
      from = new Date(anchor);
      from.setDate(from.getDate() - 6);
      break;
    }
    case 'Month': {
      from = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
      // last day of the anchor month, but not beyond today
      const lastDay = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
      to = lastDay > today ? today : lastDay;
      break;
    }
    case 'Year': {
      from = new Date(anchor.getFullYear(), 0, 1);
      const lastDay = new Date(anchor.getFullYear(), 11, 31);
      to = lastDay > today ? today : lastDay;
      break;
    }
  }

  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

function getPeriodLabel(period: AnalyticsPeriod, anchor: Date): string {
  switch (period) {
    case 'Week': {
      const from = new Date(anchor);
      from.setDate(from.getDate() - 6);
      const opts: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
      };
      return `${from.toLocaleDateString(
        'en-IN',
        opts,
      )} - ${anchor.toLocaleDateString('en-IN', opts)}`;
    }
    case 'Month':
      return `${MONTH_NAMES[anchor.getMonth()]} ${anchor.getFullYear()}`;
    case 'Year':
      return anchor.getFullYear().toString();
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface PeriodNavProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  canGoNext: boolean;
}

const PeriodNav: React.FC<PeriodNavProps> = React.memo(
  ({ label, onPrev, onNext, canGoNext }) => (
    <View style={styles.periodNav}>
      <TouchableOpacity
        style={styles.periodNavBtn}
        onPress={onPrev}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.periodNavChevron}>{'‹'}</Text>
      </TouchableOpacity>
      <Text style={styles.periodNavLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.periodNavBtn, !canGoNext && styles.periodNavBtnDisabled]}
        onPress={canGoNext ? onNext : undefined}
        activeOpacity={canGoNext ? 0.7 : 1}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text
          style={[
            styles.periodNavChevron,
            !canGoNext && styles.periodNavChevronDisabled,
          ]}
        >
          {'›'}
        </Text>
      </TouchableOpacity>
    </View>
  ),
);

const SummaryRow: React.FC<{ income: number; expense: number }> = React.memo(
  ({ income, expense }) => (
    <View style={styles.summaryRow}>
      <View style={[styles.summaryCard, styles.summaryCardIncome]}>
        <Text style={styles.summaryLabel}>Income</Text>
        <Text style={[styles.summaryAmount, styles.summaryAmountIncome]}>
          {formatShort(income)}
        </Text>
      </View>
      <View style={[styles.summaryCard, styles.summaryCardExpense]}>
        <Text style={styles.summaryLabel}>Expense</Text>
        <Text style={[styles.summaryAmount, styles.summaryAmountExpense]}>
          {formatShort(expense)}
        </Text>
      </View>
      <View style={[styles.summaryCard, styles.summaryCardSavings]}>
        <Text style={styles.summaryLabel}>Saved</Text>
        <Text style={styles.summaryAmount}>
          {formatShort(income - expense)}
        </Text>
      </View>
    </View>
  ),
);

const BarChart: React.FC<{ data: MonthlyData[] }> = React.memo(({ data }) => {
  const maxVal = useMemo(
    () => Math.max(...data.map(d => Math.max(d.income, d.expense)), 1),
    [data],
  );

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Income vs Expense</Text>
      <View style={styles.chartArea}>
        {data.map((d, i) => {
          const incomeH = Math.round((d.income / maxVal) * 100);
          const expenseH = Math.round((d.expense / maxVal) * 100);
          return (
            <View key={`${d.month}-${i}`} style={styles.chartBarGroup}>
              <View style={styles.chartBarPair}>
                <View style={[styles.chartBarIncome, { height: incomeH }]} />
                <View style={[styles.chartBarExpense, { height: expenseH }]} />
              </View>
              <Text style={styles.chartMonthLabel} numberOfLines={1}>
                {d.month}
              </Text>
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

const SavingsRateCard: React.FC<{ rate: number; subtext: string }> = React.memo(
  ({ rate, subtext }) => (
    <View style={styles.savingsCard}>
      <Text style={styles.savingsLabel}>Savings Rate</Text>
      <View style={styles.savingsRow}>
        <Text style={styles.savingsRate}>{Math.max(0, rate)}</Text>
        <Text style={styles.savingsPct}>%</Text>
      </View>
      <Text style={styles.savingsSubtext}>{subtext}</Text>
      <View style={styles.savingsBar}>
        <View
          style={[
            styles.savingsBarFill,
            { width: `${Math.min(Math.max(rate, 0), 100)}%` },
          ]}
        />
      </View>
    </View>
  ),
);

const CategoryBreakdown: React.FC<{ categories: SpendingCategory[] }> =
  React.memo(({ categories }) => (
    <View style={styles.categoryCard}>
      <Text style={styles.categoryTitle}>Spending by Category</Text>
      {categories.length === 0 && (
        <Text style={styles.emptyText}>No spending data yet</Text>
      )}
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

const TopTransactions: React.FC<{ expenses: Transaction[] }> = React.memo(
  ({ expenses }) => {
    const categoryColors: Record<string, string> = {
      dining: '#EF4444',
      food: '#EF4444',
      shopping: '#3B82F6',
      transport: '#F97316',
      bills: '#8B5CF6',
      entertainment: '#EC4899',
      fun: '#EC4899',
      transfer: '#6366F1',
      other: '#94A3B8',
      others: '#94A3B8',
    };
    const categoryEmojis: Record<string, string> = {
      dining: '\uD83C\uDF74',
      food: '\uD83C\uDF74',
      shopping: '\uD83D\uDED2',
      transport: '\uD83D\uDE97',
      bills: '\uD83E\uDDFE',
      entertainment: '\uD83C\uDFAB',
      fun: '\uD83C\uDFAB',
      transfer: '\u21C5',
      other: '\u2022',
      others: '\u2022',
    };
    return (
      <View style={styles.topCard}>
        <Text style={styles.topTitle}>Top Expenses</Text>
        {expenses.length === 0 && (
          <Text style={styles.emptyText}>No expenses yet</Text>
        )}
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
  },
);

// ── Screen ────────────────────────────────────────────────────────────────────

const AnalyticsScreen: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('Month');
  const [offset, setOffset] = useState(0); // 0 = current, -1 = previous, etc.

  const { state: txState } = useTransactions();
  const { expenseCategories } = useCategories();

  // Reset offset when period changes
  const handlePeriodChange = (p: AnalyticsPeriod) => {
    setPeriod(p);
    setOffset(0);
  };

  const anchor = useMemo(() => getAnchorDate(period, offset), [period, offset]);

  const { from, to } = useMemo(
    () => getDateRange(period, anchor),
    [period, anchor],
  );

  const canGoNext = offset < 0;

  const chartData = useMemo(() => {
    switch (period) {
      case 'Week':
        return analytics.getDailyTotals(txState.transactions, from, to);
      case 'Month':
        return analytics.getWeeklyTotals(
          txState.transactions,
          anchor.getFullYear(),
          anchor.getMonth() + 1,
        );
      case 'Year':
        return analytics.getMonthlyTotals(
          txState.transactions,
          anchor.getFullYear(),
        );
    }
  }, [period, from, to, txState.transactions]);

  const income = useMemo(
    () => analytics.getIncomeTotalForRange(txState.transactions, from, to),
    [from, to, txState.transactions],
  );

  const expense = useMemo(
    () => analytics.getExpenseTotalForRange(txState.transactions, from, to),
    [from, to, txState.transactions],
  );

  const savingsRate = useMemo(
    () => analytics.getSavingsRate(txState.transactions, from, to),
    [from, to, txState.transactions],
  );

  const categories = useMemo(
    () =>
      analytics.getSpendingByCategory(
        txState.transactions,
        from,
        to,
        expenseCategories,
      ),
    [from, to, txState.transactions, expenseCategories],
  );

  const topExpenses = useMemo(
    () => analytics.getTopExpenses(txState.transactions, 3, from, to),
    [from, to, txState.transactions],
  );

  const savingsSubtext = useMemo(() => {
    switch (period) {
      case 'Week':
        return 'of your income saved this week';
      case 'Month':
        return 'of your income saved this month';
      case 'Year':
        return 'of your income saved this year';
    }
  }, [period]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Analytics" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tab switcher */}
        <View style={styles.periodWrapper}>
          <TabSwitcher
            tabs={PERIODS}
            activeTab={period}
            onSelect={p => handlePeriodChange(p as AnalyticsPeriod)}
          />
        </View>

        {/* Period navigator */}
        <PeriodNav
          label={getPeriodLabel(period, anchor)}
          onPrev={() => setOffset(o => o - 1)}
          onNext={() => setOffset(o => o + 1)}
          canGoNext={canGoNext}
        />

        <SummaryRow income={income} expense={expense} />
        <BarChart data={chartData} />
        <SavingsRateCard rate={savingsRate} subtext={savingsSubtext} />
        <CategoryBreakdown categories={categories} />
        <TopTransactions expenses={topExpenses} />
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
