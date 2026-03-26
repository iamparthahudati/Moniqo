import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Shadow, Spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerPeriod: { fontSize: 14, fontWeight: '600', color: Colors.primary },

  scrollContent: { paddingBottom: Spacing.xxxl + 20 },

  // Period selector
  periodWrapper: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  periodRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    padding: 3,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodBtnActive: { backgroundColor: Colors.primary },
  periodBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  periodBtnTextActive: { color: Colors.white },

  // Summary cards row
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    marginTop: Spacing.base,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  summaryCardIncome: { borderTopWidth: 3, borderTopColor: Colors.incomeGreen },
  summaryCardExpense: { borderTopWidth: 3, borderTopColor: Colors.expenseRed },
  summaryCardSavings: { borderTopWidth: 3, borderTopColor: Colors.primary },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  summaryAmount: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  summaryAmountIncome: { color: Colors.incomeGreen },
  summaryAmountExpense: { color: Colors.expenseRed },

  // Bar chart card
  chartCard: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  chartArea: {
    height: 160,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  chartBarGroup: { flex: 1, alignItems: 'center', gap: 3 },
  chartBarPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 120,
  },
  chartBarIncome: {
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.incomeGreen,
  },
  chartBarExpense: {
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.expenseRed,
  },
  chartMonthLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: Spacing.base,
    marginTop: Spacing.md,
    justifyContent: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  // Savings rate card
  savingsCard: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.md,
  },
  savingsLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  savingsRate: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: -1,
  },
  savingsPct: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
  },
  savingsSubtext: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  savingsBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  savingsBarFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 3,
  },

  // Category breakdown
  categoryCard: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryEmoji: { fontSize: 20, width: 32 },
  categoryInfo: { flex: 1, marginLeft: Spacing.sm },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  categoryBarBg: {
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryBarFill: { height: '100%', borderRadius: 3 },
  categoryRight: { alignItems: 'flex-end', marginLeft: Spacing.md },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  categoryPct: { fontSize: 11, fontWeight: '600', color: Colors.textMuted },

  // Top transactions
  topCard: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  topIconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  topInfo: { flex: 1 },
  topName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  topSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  topAmount: { fontSize: 14, fontWeight: '700', color: Colors.expenseRed },
});
