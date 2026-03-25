import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Shadow, Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginTop: Spacing.base,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.sm,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  iconIncome: {
    backgroundColor: 'rgba(34,197,94,0.12)',
  },
  iconExpense: {
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  iconSavings: {
    backgroundColor: 'rgba(59,130,246,0.12)',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
  amountIncome: {
    color: Colors.incomeGreen,
  },
  amountExpense: {
    color: Colors.expenseRed,
  },
  amountSavings: {
    color: Colors.savingsBlue,
  },
});
