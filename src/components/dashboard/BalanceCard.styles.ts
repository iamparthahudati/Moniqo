import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    marginHorizontal: Spacing.base,
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.badgeGreen,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  trendDownArrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 14,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
    marginTop: Spacing.sm,
    letterSpacing: -1,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginTop: Spacing.xl,
    height: 40,
  },
  barWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.balanceBarBg,
  },
  barFill: {
    backgroundColor: Colors.balanceBarFill,
    borderRadius: Radius.sm,
  },
});
