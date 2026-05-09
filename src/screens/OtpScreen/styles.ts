import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  backButtonMargin: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 40,
  },
  phoneHighlight: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
    marginHorizontal: 24,
  },
  otpBox: {
    width: 52,
    height: 60,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFocused: {
    borderColor: Colors.primary,
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: '#EEF0FD',
  },
  otpText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  resendText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resendLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  resendDisabled: {
    color: Colors.textSecondary,
  },
});

export default styles;
