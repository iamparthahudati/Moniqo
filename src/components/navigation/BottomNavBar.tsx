import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AccountsNavIcon,
  AnalyticsNavIcon,
  BudgetNavIcon,
  DashboardIcon,
  SettingsIcon,
} from '../../icons/Icons';
import { Colors } from '../../theme/colors';
import { TabName } from '../../types';
import { styles } from './BottomNavBar.styles';

interface NavTab {
  name: TabName;
  label: string;
  Icon: React.FC<{ size?: number; color?: string }>;
}

const NAV_TABS: NavTab[] = [
  { name: 'Dashboard', label: 'HOME', Icon: DashboardIcon },
  { name: 'Analytics', label: 'ANALYTICS', Icon: AnalyticsNavIcon },
  { name: 'Budget', label: 'BUDGET', Icon: BudgetNavIcon },
  { name: 'Accounts', label: 'ACCOUNTS', Icon: AccountsNavIcon },
  { name: 'Settings', label: 'SETTINGS', Icon: SettingsIcon },
];

interface BottomNavBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = React.memo(
  ({ activeTab, onTabPress }) => {
    const insets = useSafeAreaInsets();

    return (
      <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
        <View style={styles.container}>
          {NAV_TABS.map(tab => {
            const isActive = activeTab === tab.name;
            const color = isActive ? Colors.primary : Colors.navInactive;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tab}
                onPress={() => onTabPress(tab.name)}
                activeOpacity={0.7}
              >
                <tab.Icon size={24} color={color} />
                <Text
                  style={[
                    styles.tabLabel,
                    isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  },
);

export default BottomNavBar;
