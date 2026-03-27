import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Radius } from '../../theme/spacing';

interface IconCircleProps {
  size?: number;
  backgroundColor: string;
  children: React.ReactNode;
  style?: any;
}

const IconCircle: React.FC<IconCircleProps> = ({
  size = 48,
  backgroundColor,
  children,
  style,
}) => {
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: Radius.full,
          backgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } as ViewStyle,
});

export default React.memo(IconCircle);
