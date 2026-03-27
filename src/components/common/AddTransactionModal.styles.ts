import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Shadow, Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  // ── Overlay & container ──────────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header ───────────────────────────────────────────────────────────────
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
  headerBack: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  headerSave: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },

  // ── Scroll content ────────────────────────────────────────────────────────
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },

  // ── Type toggle ───────────────────────────────────────────────────────────
  typeToggleWrapper: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    padding: 4,
  },
  typeBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
  },
  typeBtnActive: {
    backgroundColor: Colors.expenseRed,
  },
  typeBtnActiveIncome: {
    backgroundColor: Colors.incomeGreen,
  },
  typeBtnInactive: {
    backgroundColor: 'transparent',
  },
  typeBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: Colors.white,
  },
  typeBtnTextInactive: {
    color: Colors.textSecondary,
  },

  // ── Amount section ────────────────────────────────────────────────────────
  amountSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 8,
  },
  amountInput: {
    fontSize: 52,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -2,
    minWidth: 80,
    padding: 0,
    includeFontPadding: false,
  },

  // ── Section block ─────────────────────────────────────────────────────────
  section: {
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },

  // ── Category grid ─────────────────────────────────────────────────────────
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  categoryItemActive: {
    backgroundColor: Colors.primary,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(43,63,232,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryIconCircleActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  categoryLabelActive: {
    color: Colors.white,
  },

  // ── Payment method ────────────────────────────────────────────────────────
  paymentRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  paymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  paymentBtnActive: {
    backgroundColor: Colors.primary,
  },
  paymentBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  paymentBtnTextActive: {
    color: Colors.white,
  },

  // ── Date row ──────────────────────────────────────────────────────────────
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  dateTextGroup: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  // ── Note input ────────────────────────────────────────────────────────────
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  noteInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
    includeFontPadding: false,
  },

  // ── Submit button ─────────────────────────────────────────────────────────
  submitSection: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base + 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
});
