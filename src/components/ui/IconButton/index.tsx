import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { styles } from './style';

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

export default IconButton;
