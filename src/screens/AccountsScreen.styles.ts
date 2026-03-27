import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Shadow, Spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: { paddingBottom: Spacing.xxxl + 20 },

  // ── Total balance card ────────────────────────────────────────────────────
  totalCard: {
    margin: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.sm,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -1.5,
    marginBottom: Spacing.sm,
  },
  totalSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  totalSubText: { fontSize: 14, color: Colors.textSecondary },
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.incomeGreen,
  },

  // ── Section ───────────────────────────────────────────────────────────────
  section: { paddingHorizontal: Spacing.base, marginTop: Spacing.lg },
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
  viewAll: { fontSize: 14, fontWeight: '600', color: Colors.primary },

  // ── Account row card ──────────────────────────────────────────────────────
  accountCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadow.sm,
  },
  accountInfo: { flex: 1 },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  accountType: { fontSize: 13, color: Colors.textSecondary },
  accountRight: { alignItems: 'flex-end', gap: 4 },
  accountBalance: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  accountStatus: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.incomeGreen,
  },
  accountStatusInactive: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textMuted,
  },
  accountStatusDue: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.expenseRed,
  },
  accountDueAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.expenseRed,
  },
  accountDueDash: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.expenseRed,
  },
  chevron: { marginLeft: Spacing.xs },

  // ── Investment grid ───────────────────────────────────────────────────────
  investGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  investCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadow.sm,
    gap: Spacing.md,
  },
  investName: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  investAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // ── Cash row ──────────────────────────────────────────────────────────────
  cashCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  cashInfo: { flex: 1 },
  cashLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cashSublabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  cashAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  // ── Hint ──────────────────────────────────────────────────────────────────
  hintText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
});
