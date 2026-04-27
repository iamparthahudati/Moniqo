import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Shadow, Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  scrollContent: {
    paddingRight: Spacing.base,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    width: 180,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  bankBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankCode: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  accountType: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  balance: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  accountSubType: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  dueLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  cashBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.incomeGreen,
  },
});
