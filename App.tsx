import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AddTransactionModal from './src/components/common/AddTransactionModal';
import BottomNavBar from './src/components/navigation/BottomNavBar';
import { PlusIcon } from './src/icons/Icons';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WalletsScreen from './src/screens/WalletsScreen';
import { Colors } from './src/theme/colors';
import { TabName } from './src/types';

const renderScreen = (tab: TabName) => {
  switch (tab) {
    case 'Dashboard':
      return <DashboardScreen />;
    case 'Analytics':
      return <AnalyticsScreen />;
    case 'Wallets':
      return <WalletsScreen />;
    case 'Settings':
      return <SettingsScreen />;
  }
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabName>('Dashboard');
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleTabPress = useCallback((tab: TabName) => {
    setActiveTab(tab);
  }, []);

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  // FAB floats above the nav bar: nav height ~64 + safe area + breathing room
  const fabBottom = 64 + insets.bottom + 16;

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

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: fabBottom }]}
        onPress={openModal}
        activeOpacity={0.85}
      >
        <PlusIcon size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <AddTransactionModal visible={modalVisible} onClose={closeModal} />
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
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
