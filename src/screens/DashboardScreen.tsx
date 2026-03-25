import React from 'react';
import { ScrollView, View } from 'react-native';
import DashboardHeader from '../components/common/DashboardHeader';
import BalanceCard from '../components/dashboard/BalanceCard';
import ConnectedAccounts from '../components/dashboard/ConnectedAccounts';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SummaryStats from '../components/dashboard/SummaryStats';
import { styles } from './DashboardScreen.styles';

const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <DashboardHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BalanceCard />
        <SummaryStats />
        <ConnectedAccounts />
        <RecentTransactions />
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
