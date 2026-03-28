import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Shadow, Spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  // ── Root ──────────────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingBottom: Spacing.xxxl + Spacing.lg,
  },

  // ── Members row ───────────────────────────────────────────────────────────
  membersSection: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  membersScroll: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.lg,
  },
  memberItem: {
    alignItems: 'center',
    gap: Spacing.xs,
    width: 68,
  },
  memberAvatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  memberName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  memberBalance: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  memberBalanceOwed: {
    color: Colors.incomeGreen,
  },
  memberBalanceOwe: {
    color: Colors.expenseRed,
  },
  memberBalanceNeutral: {
    color: Colors.textMuted,
  },

  // ── Net balance card ──────────────────────────────────────────────────────
  balanceCard: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.incomeGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.md,
  },
  balanceCardLeft: {
    gap: Spacing.xs,
  },
  balanceCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.4,
  },
  balanceCardAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  balanceCardSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  balanceCardBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  balanceCardBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },

  // ── Settle Up button ──────────────────────────────────────────────────────
  settleSection: {
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.md,
  },
  settleBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base + 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  settleBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },

  // ── Expenses section ──────────────────────────────────────────────────────
  expensesSection: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.base,
  },
  expensesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  expensesSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: `${Colors.primary}12`,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },

  // ── Expense row ───────────────────────────────────────────────────────────
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  expenseIconCircle: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  expenseIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  expenseInfo: {
    flex: 1,
    gap: 2,
  },
  expenseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  expensePaidBy: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
    marginTop: 1,
  },
  expenseRight: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
    flexShrink: 0,
  },
  expenseTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  expenseShareBadge: {
    backgroundColor: `${Colors.primary}12`,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  expenseShareText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  expenseRowWrapper: {
    paddingHorizontal: Spacing.base,
  },
});
