import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { DotsIcon } from '../../icons/Icons';
import { useAccounts } from '../../store/accountsStore';
import { Colors } from '../../theme/colors';
import { formatCurrencyFull } from '../../utils/formatters';
import { styles } from './ConnectedAccounts.styles';

const ConnectedAccounts: React.FC = React.memo(() => {
  const { state } = useAccounts();
  const { bankAccounts } = state;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Connected Accounts</Text>
      {bankAccounts.length === 0 ? (
        <Text style={[styles.accountType, { color: Colors.textMuted }]}>
          No accounts added yet
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {bankAccounts.map(account => (
            <View key={account.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[styles.bankBadge, { backgroundColor: account.color }]}
                >
                  <Text style={styles.bankCode}>
                    {account.bankName.slice(0, 4).toUpperCase()}
                  </Text>
                </View>
                <DotsIcon size={18} color={Colors.textMuted} />
              </View>
              <Text style={styles.accountType}>{account.accountType}</Text>
              <Text style={styles.balance}>
                {formatCurrencyFull(account.balance)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
});

export default ConnectedAccounts;
