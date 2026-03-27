import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AddTransactionModal, {
  TransactionType,
} from './src/components/common/AddTransactionModal';
import FabActionSheet, {
  FabAction,
} from './src/components/common/FabActionSheet';
import TransferModal from './src/components/common/TransferModal';
import BottomNavBar from './src/components/navigation/BottomNavBar';
import { PlusIcon } from './src/icons/Icons';
import AccountsScreen from './src/screens/AccountScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { AccountsProvider } from './src/store/accountsStore';
import { Colors } from './src/theme/colors';
import { TabName } from './src/types';

const renderScreen = (tab: TabName) => {
  switch (tab) {
    case 'Dashboard':
      return <DashboardScreen />;
    case 'Analytics':
      return <AnalyticsScreen />;
    case 'Accounts':
      return <AccountsScreen />;
    case 'Settings':
      return <SettingsScreen />;
  }
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabName>('Dashboard');
  const insets = useSafeAreaInsets();

  // Action sheet state
  const [sheetVisible, setSheetVisible] = useState(false);

  // Add transaction modal state
  const [txModalVisible, setTxModalVisible] = useState(false);
  const [txInitialType, setTxInitialType] =
    useState<TransactionType>('expense');

  // Transfer modal state
  const [transferVisible, setTransferVisible] = useState(false);

  const handleTabPress = useCallback((tab: TabName) => {
    setActiveTab(tab);
  }, []);

  // FAB tapped — open action sheet
  const handleFabPress = useCallback(() => {
    setSheetVisible(true);
  }, []);

  // User picked an action from the sheet
  const handleActionSelect = useCallback((action: FabAction) => {
    setSheetVisible(false);
    // Small delay so sheet closes before next modal opens
    setTimeout(() => {
      if (action === 'transfer') {
        setTransferVisible(true);
      } else {
        setTxInitialType(action); // 'expense' | 'income'
        setTxModalVisible(true);
      }
    }, 300);
  }, []);

  const fabBottom = 64 + insets.bottom + 16;
  const isDashboard = activeTab === 'Dashboard';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
        translucent={false}
      />

      {/* Screen content */}
      <View style={styles.screenContainer}>{renderScreen(activeTab)}</View>

      {/* Bottom navigation */}
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />

      {/* FAB — Dashboard only */}
      {isDashboard && (
        <TouchableOpacity
          style={[styles.fab, { bottom: fabBottom }]}
          onPress={handleFabPress}
          activeOpacity={0.85}
        >
          <PlusIcon size={26} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Action sheet */}
      <FabActionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSelect={handleActionSelect}
      />

      {/* Add Expense / Income modal */}
      <AddTransactionModal
        visible={txModalVisible}
        onClose={() => setTxModalVisible(false)}
        initialType={txInitialType}
      />

      {/* Transfer modal */}
      <TransferModal
        visible={transferVisible}
        onClose={() => setTransferVisible(false)}
      />
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AccountsProvider>
        <AppContent />
      </AccountsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default App;
