import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../theme/colors';

interface IconButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  size?: number;
  style?: ViewStyle;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
  activeOpacity?: number;
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  children,
  size = 40,
  style,
  hitSlop,
  activeOpacity = 0.7,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      hitSlop={hitSlop}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
