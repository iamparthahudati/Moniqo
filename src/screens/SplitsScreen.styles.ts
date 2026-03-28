import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Shadow, Spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  // ── Root ──────────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl + 24,
  },

  // ── Summary Banner ─────────────────────────────────────────────────────────
  bannerWrapper: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'stretch',
    ...Shadow.sm,
    overflow: 'hidden',
  },
  bannerSide: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  bannerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  bannerAmount: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  bannerAmountOwed: {
    color: Colors.incomeGreen,
  },
  bannerAmountOwe: {
    color: Colors.expenseRed,
  },
  bannerSubtext: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // ── Section Header ─────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },

  // ── Group Card ─────────────────────────────────────────────────────────────
  groupCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    ...Shadow.sm,
  },
  groupIconCircle: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    flexShrink: 0,
  },
  groupIconLetter: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  groupInfo: {
    flex: 1,
    minWidth: 0,
  },
  groupName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  groupMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  groupMetaDot: {
    color: Colors.border,
    marginHorizontal: 3,
  },
  groupRight: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
    flexShrink: 0,
  },
  balancePill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balancePillOwed: {
    backgroundColor: '#DCFCE7',
  },
  balancePillOwe: {
    backgroundColor: '#FEE2E2',
  },
  balancePillSettled: {
    backgroundColor: Colors.background,
  },
  balancePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  balancePillTextOwed: {
    color: Colors.incomeGreen,
  },
  balancePillTextOwe: {
    color: Colors.expenseRed,
  },
  balancePillTextSettled: {
    color: Colors.textMuted,
  },
  chevronWrap: {
    marginLeft: Spacing.xs,
    marginTop: 2,
  },

  // ── Split Item ─────────────────────────────────────────────────────────────
  splitItem: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    ...Shadow.sm,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    flexShrink: 0,
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.white,
  },
  splitInfo: {
    flex: 1,
    minWidth: 0,
  },
  splitPersonName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  splitTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  splitDate: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  splitRight: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
    flexShrink: 0,
  },
  splitAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  splitAmountOwed: {
    color: Colors.incomeGreen,
  },
  splitAmountOwe: {
    color: Colors.expenseRed,
  },
  settledBadge: {
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  settledBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  splitDirectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 1,
  },

  // ── Empty State ────────────────────────────────────────────────────────────
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyIconText: {
    fontSize: 36,
    color: Colors.primary,
    fontWeight: '300',
    lineHeight: 44,
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
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.2,
  },

  // ── Header right button ────────────────────────────────────────────────────
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
