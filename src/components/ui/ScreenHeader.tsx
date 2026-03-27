import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';

interface ScreenHeaderProps {
  title: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  style?: any;
}

const ScreenHeader = React.memo<ScreenHeaderProps>(
  ({ title, leftSlot, rightSlot, style }) => {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.slot}>{leftSlot ?? null}</View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.slot}>{rightSlot ?? null}</View>
      </View>
    );
  },
);

ScreenHeader.displayName = 'ScreenHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  slot: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
});

export default ScreenHeader;
