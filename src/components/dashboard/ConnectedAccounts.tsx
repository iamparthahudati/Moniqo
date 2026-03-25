import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ACCOUNTS } from '../../data/mockData';
import { DotsIcon } from '../../icons/Icons';
import { formatCurrencyFull } from '../../utils/formatters';
import { styles } from './ConnectedAccounts.styles';

const ConnectedAccounts: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Connected Accounts</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ACCOUNTS.map(account => (
          <View key={account.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View
                style={[styles.bankBadge, { backgroundColor: account.color }]}
              >
                <Text style={styles.bankCode}>{account.bankCode}</Text>
              </View>
              <DotsIcon size={18} color="#94A3B8" />
            </View>
            <Text style={styles.accountType}>{account.accountType}</Text>
            <Text style={styles.balance}>
              {formatCurrencyFull(account.balance)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ConnectedAccounts;
