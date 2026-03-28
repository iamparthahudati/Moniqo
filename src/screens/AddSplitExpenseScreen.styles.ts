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

  // ── Amount section ────────────────────────────────────────────────────────
  amountSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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

  // ── Generic section wrapper ────────────────────────────────────────────────
  section: {
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },

  // ── Note / title row ──────────────────────────────────────────────────────
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
    includeFontPadding: false,
  },

  // ── Paid by row ───────────────────────────────────────────────────────────
  paidByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  paidByAvatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  paidByAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  paidByInfo: {
    flex: 1,
  },
  paidByLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  paidByName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  paidByChevron: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: '400',
  },

  // ── Split between ─────────────────────────────────────────────────────────
  splitMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  splitMemberAvatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  splitMemberAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  splitMemberName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  splitMemberAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  checkCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkCircleInactive: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  checkMark: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },

  // ── Split type pills ──────────────────────────────────────────────────────
  splitTypeRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: 4,
    gap: 0,
    ...Shadow.sm,
  },
  splitTypePill: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitTypePillActive: {
    backgroundColor: Colors.primary,
  },
  splitTypePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  splitTypePillTextActive: {
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
