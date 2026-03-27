import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../theme/colors';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onSelect: (tab: string) => void;
  style?: ViewStyle;
}

const TabSwitcher = ({
  tabs,
  activeTab,
  onSelect,
  style,
}: TabSwitcherProps) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map(tab => {
        const isActive = tab === activeTab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onSelect(tab)}
            style={[
              styles.tab,
              isActive ? styles.tabActive : styles.tabInactive,
            ]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                isActive ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 999,
    padding: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.white,
  },
  tabTextInactive: {
    color: Colors.textMuted,
  },
});

export default memo(TabSwitcher);
