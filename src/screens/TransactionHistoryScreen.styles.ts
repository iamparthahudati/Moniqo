import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Shadow, Spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Search bar ────────────────────────────────────────────────────────────
  searchWrapper: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
    includeFontPadding: false,
  },
  clearBtn: {
    padding: 2,
  },
  clearBtnText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // ── Filter tabs ───────────────────────────────────────────────────────────
  filterWrapper: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm - 1,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },

  // ── List ──────────────────────────────────────────────────────────────────
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  listContentEmpty: {
    flexGrow: 1,
  },

  // ── Date group header ─────────────────────────────────────────────────────
  dateHeader: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  dateHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },

  // ── Transaction row ───────────────────────────────────────────────────────
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: {
    fontSize: 22,
  },
  textGroup: {
    flex: 1,
    overflow: 'hidden',
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  txSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  amountIncome: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.incomeGreen,
    flexShrink: 0,
  },
  amountExpense: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.expenseRed,
    flexShrink: 0,
  },
  amountTransfer: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    flexShrink: 0,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  emptySubText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
