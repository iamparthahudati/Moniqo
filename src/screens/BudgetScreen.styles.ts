import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Shadow, Spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Add button ──────────────────────────────────────────────────────────────

  addButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── List ────────────────────────────────────────────────────────────────────

  listContent: {
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxxl + 20,
  },

  // ── Summary card ────────────────────────────────────────────────────────────

  summaryCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.md,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  summaryTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
  },
  summarySubrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  summarySpentLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  summaryPctLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  summaryBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  summaryBarFill: {
    height: '100%',
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
  },
  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  summaryFooterItem: {
    alignItems: 'center',
  },
  summaryFooterValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  summaryFooterKey: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    fontWeight: '500',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: Spacing.xs,
  },

  // ── Budget card ─────────────────────────────────────────────────────────────

  budgetCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  budgetCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  budgetEmojiCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  budgetEmoji: {
    fontSize: 22,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetCategoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  budgetAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  budgetSpentAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  budgetSeparator: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  budgetTotalAmount: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  budgetBarBg: {
    height: 7,
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  budgetBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  budgetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetRemainingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  budgetOverLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.expenseRed,
  },
  budgetPctBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  budgetPctText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // ── Empty state ─────────────────────────────────────────────────────────────

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(43,63,232,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyIconText: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },

  // ── Modal / bottom sheet ─────────────────────────────────────────────────────

  backdrop: {
    flex: 1,
    backgroundColor: Colors.backdrop,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingBottom: Spacing.xxxl,
    ...Shadow.lg,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCloseText: {
    fontSize: 18,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontWeight: '400',
  },

  // Step 1: category picker
  stepLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  categoryPickerList: {
    maxHeight: 320,
  },
  categoryPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  categoryPickerItemSelected: {
    backgroundColor: 'rgba(43,63,232,0.05)',
  },
  categoryPickerEmoji: {
    fontSize: 22,
    width: 36,
  },
  categoryPickerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  categoryPickerCheck: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPickerCheckText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '700',
  },
  noCategoriesText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },

  // Step 2: amount input
  amountInputSection: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  selectedCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  selectedCategoryEmoji: {
    fontSize: 20,
  },
  selectedCategoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  changeCategoryBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  changeCategoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xs,
  },
  amountInputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(43,63,232,0.03)',
  },
  amountInputPrefix: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingVertical: Spacing.md,
    letterSpacing: -0.5,
  },
  amountHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
  },
  amountError: {
    fontSize: 12,
    color: Colors.expenseRed,
    marginBottom: Spacing.xl,
    fontWeight: '500',
  },

  // Set budget button
  setBudgetBtn: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  setBudgetBtnDisabled: {
    opacity: 0.45,
  },
  setBudgetBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.2,
  },
});
