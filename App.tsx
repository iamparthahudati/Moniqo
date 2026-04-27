import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AddTransactionModal, {
  TransactionType,
} from './src/components/common/AddTransactionModal';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import FabActionSheet, {
  FabAction,
} from './src/components/common/FabActionSheet';
import TransferModal from './src/components/common/TransferModal';
import BottomNavBar from './src/components/navigation/BottomNavBar';
import useNotifications from './src/hooks/useNotifications';
import { PlusIcon } from './src/icons/Icons';
import AccountsScreen from './src/screens/AccountScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpScreen from './src/screens/OtpScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistoryScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { logScreenView } from './src/services/firebase';
import { AccountsProvider } from './src/store/accountsStore';
import { AuthProvider, useAuth } from './src/store/authStore';
import { BudgetProvider } from './src/store/budgetStore';
import { CategoriesProvider } from './src/store/categoriesStore';
import { TransactionsProvider } from './src/store/transactionsStore';
import { Colors } from './src/theme/colors';
import { TabName } from './src/types';

// ---------------------------------------------------------------------------
// Auth flow screen names
// ---------------------------------------------------------------------------
type AuthScreen = 'welcome' | 'login' | 'otp';

// ---------------------------------------------------------------------------
// Main app content — shown after authentication
// ---------------------------------------------------------------------------
const renderTab = (tab: TabName, onSeeAll: () => void) => {
  switch (tab) {
    case 'Dashboard':
      return <DashboardScreen onSeeAll={onSeeAll} />;
    case 'Analytics':
      return <AnalyticsScreen />;
    case 'Budget':
      return <BudgetScreen />;
    case 'Accounts':
      return <AccountsScreen />;
    case 'Settings':
      return <SettingsScreen />;
  }
};

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabName>('Dashboard');
  const insets = useSafeAreaInsets();

  const [sheetVisible, setSheetVisible] = useState(false);
  const [txModalVisible, setTxModalVisible] = useState(false);
  const [txInitialType, setTxInitialType] =
    useState<TransactionType>('expense');
  const [transferVisible, setTransferVisible] = useState(false);
  const [transactionHistoryVisible, setTransactionHistoryVisible] =
    useState(false);

  useEffect(() => {
    logScreenView(activeTab);
  }, [activeTab]);

  const handleTabPress = useCallback((tab: TabName) => {
    setActiveTab(tab);
  }, []);

  const handleFabPress = useCallback(() => {
    setSheetVisible(true);
  }, []);

  const handleActionSelect = useCallback((action: FabAction) => {
    setSheetVisible(false);
    setTimeout(() => {
      if (action === 'transfer') {
        setTransferVisible(true);
      } else {
        setTxInitialType(action);
        setTxModalVisible(true);
      }
    }, 300);
  }, []);

  const fabBottom = 64 + insets.bottom + 16;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
        translucent={false}
      />

      <View style={styles.screenContainer}>
        {renderTab(activeTab, () => setTransactionHistoryVisible(true))}
      </View>

      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />

      <TouchableOpacity
        style={[styles.fab, { bottom: fabBottom }]}
        onPress={handleFabPress}
        activeOpacity={0.85}
      >
        <PlusIcon size={26} color="#FFFFFF" />
      </TouchableOpacity>

      <FabActionSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSelect={handleActionSelect}
      />

      <AddTransactionModal
        visible={txModalVisible}
        onClose={() => setTxModalVisible(false)}
        initialType={txInitialType}
      />

      <TransferModal
        visible={transferVisible}
        onClose={() => setTransferVisible(false)}
      />

      <TransactionHistoryScreen
        visible={transactionHistoryVisible}
        onClose={() => setTransactionHistoryVisible(false)}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Auth gate — decides whether to show auth screens or the main app
// ---------------------------------------------------------------------------
function AuthGate() {
  const { user, isGuest, isLoading, setGuest } = useAuth();
  const { setup } = useNotifications();

  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  const [pendingConfirmation, setPendingConfirmation] = useState<any>(null);
  const [pendingPhone, setPendingPhone] = useState('');

  // Request notification permissions once the user is authenticated
  useEffect(() => {
    if (user || isGuest) {
      setup();
    }
  }, [user, isGuest, setup]);

  // Still resolving Firebase auth state
  if (isLoading) {
    return null;
  }

  // Authenticated or guest — show the main app
  if (user || isGuest) {
    return (
      <CategoriesProvider>
        <AccountsProvider>
          <TransactionsProvider>
            <BudgetProvider>
              <AppContent />
            </BudgetProvider>
          </TransactionsProvider>
        </AccountsProvider>
      </CategoriesProvider>
    );
  }

  // Auth screens
  if (authScreen === 'login') {
    return (
      <LoginScreen
        onBack={() => setAuthScreen('welcome')}
        onOtpSent={(confirmation, phoneNumber) => {
          setPendingConfirmation(confirmation);
          setPendingPhone(phoneNumber);
          setAuthScreen('otp');
        }}
      />
    );
  }

  if (authScreen === 'otp') {
    return (
      <OtpScreen
        phoneNumber={pendingPhone}
        confirmation={pendingConfirmation}
        onBack={() => setAuthScreen('login')}
        onSuccess={() => {
          // onAuthStateChanged in AuthProvider will update user automatically
        }}
      />
    );
  }

  return (
    <WelcomeScreen
      onPhonePress={() => setAuthScreen('login')}
      onGuestPress={() => setGuest(true)}
    />
  );
}

// ---------------------------------------------------------------------------
// Root app
// ---------------------------------------------------------------------------
function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <AuthGate />
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
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
