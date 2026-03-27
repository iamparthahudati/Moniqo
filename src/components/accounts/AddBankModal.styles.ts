import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Shadow, Spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  // ── Backdrop ──────────────────────────────────────────────────────────────
  backdrop: {
    flex: 1,
    backgroundColor: Colors.backdrop,
    justifyContent: 'flex-end',
  },

  // ── Sheet ─────────────────────────────────────────────────────────────────
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    ...Shadow.lg,
  },

  // ── Drag handle ───────────────────────────────────────────────────────────
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },

  // ── Title row ─────────────────────────────────────────────────────────────
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: '600',
  },

  // ── Scroll content ────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },

  // ── Form field group ──────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    fontSize: 15,
    color: Colors.textPrimary,
  },

  // ── Pill row (icon / status) ───────────────────────────────────────────────
  pillRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
  },

  // ── Color swatches ────────────────────────────────────────────────────────
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  swatchCheck: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 20,
  },

  // ── Save button ───────────────────────────────────────────────────────────
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base + 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
});
