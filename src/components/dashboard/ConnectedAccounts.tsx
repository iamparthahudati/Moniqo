import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { DotsIcon } from '../../icons/Icons';
import { useAccounts } from '../../store/accountsStore';
import { Colors } from '../../theme/colors';
import { formatCurrencyFull } from '../../utils/formatters';
import { styles } from './ConnectedAccounts.styles';

const ConnectedAccounts: React.FC = React.memo(() => {
  const { state } = useAccounts();
  const { bankAccounts, cardAccounts, cashEntries, investments } = state;

  const isEmpty =
    bankAccounts.length === 0 &&
    cardAccounts.length === 0 &&
    cashEntries.length === 0 &&
    investments.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Connected Accounts</Text>
      {isEmpty ? (
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
            <View key={`bank-${account.id}`} style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[styles.bankBadge, { backgroundColor: account.color }]}
                >
                  <Text style={styles.bankCode}>BANK</Text>
                </View>
                <DotsIcon size={18} color={Colors.textMuted} />
              </View>
              <Text style={styles.accountType}>{account.bankName}</Text>
              <Text style={styles.accountSubType}>{account.accountType}</Text>
              <Text style={styles.balance}>
                {formatCurrencyFull(account.balance)}
              </Text>
            </View>
          ))}

          {cardAccounts.map(account => (
            <View key={`card-${account.id}`} style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[styles.bankBadge, { backgroundColor: account.color }]}
                >
                  <Text style={styles.bankCode}>CARD</Text>
                </View>
                <DotsIcon size={18} color={Colors.textMuted} />
              </View>
              <Text style={styles.accountType}>{account.cardName}</Text>
              <Text style={styles.accountSubType}>{account.cardType}</Text>
              <Text style={styles.balance}>
                {formatCurrencyFull(account.dueAmount)}
              </Text>
              <Text style={styles.dueLabel}>due</Text>
            </View>
          ))}

          {cashEntries.map(entry => (
            <View key={`cash-${entry.id}`} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cashBadge}>
                  <Text style={styles.bankCode}>CASH</Text>
                </View>
                <DotsIcon size={18} color={Colors.textMuted} />
              </View>
              <Text style={styles.accountType}>{entry.label}</Text>
              <Text style={styles.accountSubType}>{entry.sublabel}</Text>
              <Text style={styles.balance}>
                {formatCurrencyFull(entry.amount)}
              </Text>
            </View>
          ))}

          {investments.map(investment => (
            <View key={`invest-${investment.id}`} style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.bankBadge,
                    { backgroundColor: investment.color },
                  ]}
                >
                  <Text style={styles.bankCode}>INVEST</Text>
                </View>
                <DotsIcon size={18} color={Colors.textMuted} />
              </View>
              <Text style={styles.accountType}>{investment.name}</Text>
              <Text style={styles.accountSubType}>Investment</Text>
              <Text style={styles.balance}>
                {formatCurrencyFull(investment.amount)}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
});

export default ConnectedAccounts;
