import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Colors } from '../../../theme/colors';
import { Radius } from '../../../theme/spacing';
import { ButtonVariant } from '.';

export function getTextStyle(variant: ButtonVariant): TextStyle {
  switch (variant) {
    case 'outline':
      return styles.outlineText;
    case 'ghost':
      return styles.ghostText;
    case 'white':
      return styles.whiteText;
    case 'ghost-dark':
      return styles.ghostDarkText;
    default:
      return styles.primaryText;
  }
}

export function getContainerStyle(variant: ButtonVariant): ViewStyle {
  switch (variant) {
    case 'outline':
      return styles.outline;
    case 'ghost':
      return styles.ghost;
    case 'white':
      return styles.white;
    case 'ghost-dark':
      return styles.ghostDark;
    default:
      return styles.primary;
  }
}

export const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },

  primary: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.white,
  },
  primaryDisabled: {
    backgroundColor: '#A5B4FC',
  },
  primaryShadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  outline: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  outlineText: {
    color: Colors.primary,
  },

  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  ghostText: {
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },

  white: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingVertical: 12,
  },
  whiteText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },

  ghostDark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.lg,
    paddingVertical: 12,
  },
  ghostDarkText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
