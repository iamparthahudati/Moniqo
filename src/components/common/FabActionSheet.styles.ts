import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Shadow, Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.backdrop,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingTop: Spacing.md,
    ...Shadow.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.base,
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  option: {
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  optionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  optionSublabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: -4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.base,
    marginBottom: Spacing.sm,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
