import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 48,
  },
  logoSection: {
    alignItems: 'center',
    gap: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 4,
  },
  actionsSection: {
    width: '100%',
    gap: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  phoneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
  },
  phoneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  guestText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  guestUnderline: {
    textDecorationLine: 'underline',
  },
  footer: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoLetter: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
