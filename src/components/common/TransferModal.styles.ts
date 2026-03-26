import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Shadow, Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },

  // Amount
  amountSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
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

  // Transfer flow
  transferFlow: {
    marginTop: Spacing.base,
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    ...Shadow.sm,
    overflow: 'hidden',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  accountRowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.base,
  },
  accountIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountTextGroup: {
    flex: 1,
  },
  accountRowLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  accountBalance: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  accountChevron: {
    marginLeft: Spacing.sm,
  },

  // Arrow connector
  arrowConnector: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    backgroundColor: Colors.surface,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  arrowText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    includeFontPadding: false,
  },

  // Section
  section: {
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  dateTextGroup: { flex: 1 },
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

  // Submit
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
