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
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: { paddingBottom: Spacing.xxxl + 20 },

  // Total balance card
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
    fontSize: 38,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -1.5,
    marginBottom: Spacing.sm,
  },
  totalSubRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
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

  // Section
  section: { paddingHorizontal: Spacing.base, marginTop: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  viewAll: { fontSize: 14, fontWeight: '600', color: Colors.primary },

  // Account row card
  accountCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.sm,
  },
  accountIconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
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
  accountDueDash: { fontSize: 15, fontWeight: '700', color: Colors.expenseRed },
  chevron: { marginLeft: Spacing.sm },

  // Investment grid
  investGrid: { flexDirection: 'row', gap: Spacing.md },
  investCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadow.sm,
    gap: Spacing.md,
  },
  investIconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  investName: { fontSize: 13, color: Colors.textSecondary, marginBottom: 2 },
  investAmount: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },

  // Cash row
  cashCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.sm,
  },
  cashIconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(43,63,232,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
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
  cashAmount: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
});
