import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  group: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    marginTop: Spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: 52,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: Spacing.base + 36 + Spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 18 },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  rowLabelDestructive: {
    color: Colors.expenseRed,
  },
  rowValue: { fontSize: 14, color: Colors.textMuted, fontWeight: '400' },
  chevron: { marginLeft: 2 },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: Colors.primary },
  toggleOff: { backgroundColor: Colors.border },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbOn: { alignSelf: 'flex-end' },
  toggleThumbOff: { alignSelf: 'flex-start' },
});
