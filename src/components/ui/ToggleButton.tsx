import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Shadow, Spacing } from '../../theme/spacing';

interface ToggleButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor?: string;
  emoji?: string;
  outlined?: boolean;
  style?: ViewStyle;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  active,
  onPress,
  activeColor = Colors.primary,
  emoji,
  outlined = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        outlined && styles.outlinedInactive,
        active
          ? [styles.active, { backgroundColor: activeColor, borderColor: activeColor }]
          : styles.inactive,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {emoji ? (
        <Text style={styles.emoji}>{emoji}</Text>
      ) : null}
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  active: {
    borderWidth: 1.5,
  },
  inactive: {
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  outlinedInactive: {
    borderColor: Colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelActive: {
    color: Colors.white,
  },
  labelInactive: {
    color: Colors.textSecondary,
  },
  emoji: {
    fontSize: 18,
  },
});

export default ToggleButton;
