import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../../theme/colors';
import { getContainerStyle, getTextStyle, styles } from './style';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'white' | 'ghost-dark';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  shadow?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  shadow = false,
  style,
  textStyle,
  activeOpacity,
}) => {
  const isPrimary = variant === 'primary';
  const opacity = activeOpacity ?? (variant === 'ghost' || variant === 'ghost-dark' ? 0.7 : 0.8);

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getContainerStyle(variant),
        isPrimary && disabled && styles.primaryDisabled,
        isPrimary && shadow && styles.primaryShadow,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={opacity}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary : Colors.white}
          size="small"
        />
      ) : (
        <Text style={[styles.label, getTextStyle(variant), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
