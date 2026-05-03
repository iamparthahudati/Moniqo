import React, { useCallback, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  DiningIcon,
  SalaryIcon,
  ShoppingIcon,
  TransportIcon,
} from '../../icons/Icons';
import { useAccounts } from '../../store/accountsStore';
import { useTransactions } from '../../store/transactionsStore';
import { Transaction } from '../../types';
import { formatAmount } from '../../utils/formatters';
import EditTransactionModal from '../common/EditTransactionModal';
import { styles } from './RecentTransactions.styles';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'dining':
    case 'food':
      return <DiningIcon size={26} />;
    case 'salary':
      return <SalaryIcon size={26} />;
    case 'shopping':
      return <ShoppingIcon size={26} />;
    case 'transport':
      return <TransportIcon size={26} />;
    default:
      return <DiningIcon size={26} />;
  }
};

const getCategoryIconStyle = (category: string) => {
  switch (category) {
    case 'dining':
    case 'food':
      return styles.iconDining;
    case 'salary':
      return styles.iconSalary;
    case 'shopping':
      return styles.iconShopping;
    case 'transport':
      return styles.iconTransport;
    default:
      return styles.iconOther;
  }
};

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

const groupByDate = (transactions: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {};
  transactions.forEach(t => {
    const key = t.date;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(t);
  });
  return groups;
};

const formatDateLabel = (date: string): string => {
  const today = getTodayISO();
  const yesterday = getYesterdayISO();
  if (date === today || date === 'today') {
    return 'TODAY';
  }
  if (date === yesterday || date === 'yesterday') {
    return 'YESTERDAY';
  }
  // Format as readable date
  const d = new Date(date + 'T00:00:00');
  if (isNaN(d.getTime())) {
    return date.toUpperCase();
  }
  return d
    .toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();
};

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = React.memo(
  ({ transaction, onPress }) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(transaction)}>
      <View style={styles.transactionCard}>
        <View
          style={[
            styles.iconWrapper,
            getCategoryIconStyle(transaction.category),
          ]}
        >
          {getCategoryIcon(transaction.category)}
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.title}>{transaction.title}</Text>
          <Text style={styles.subtitle}>
            {transaction.subtitle}
            {' \u2022 '}
            {transaction.time}
          </Text>
        </View>
        <Text
          style={
            transaction.type === 'income'
              ? styles.amountIncome
              : styles.amountExpense
          }
        >
          {formatAmount(transaction.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  ),
);

interface RecentTransactionsProps {
  onSeeAll?: () => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = React.memo(
  ({ onSeeAll }) => {
    const { state, dispatch: txDispatch } = useTransactions();
    const { dispatch: acctDispatch } = useAccounts();

    const [selectedTransaction, setSelectedTransaction] =
      useState<Transaction | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const handleTransactionPress = useCallback((transaction: Transaction) => {
      setSelectedTransaction(transaction);
      setEditModalVisible(true);
    }, []);

    const handleEditClose = useCallback(() => {
      setEditModalVisible(false);
      setSelectedTransaction(null);
    }, []);

    const handleDelete = useCallback(
      (transaction: Transaction) => {
        // Reverse the balance impact before deleting
        if (
          transaction.type !== 'transfer' &&
          transaction.account_id &&
          transaction.account_type
        ) {
          const reverseDelta = -transaction.amount;
          if (transaction.account_type === 'bank') {
            acctDispatch({
              type: 'ADJUST_BANK_BALANCE',
              payload: { id: transaction.account_id, delta: reverseDelta },
            });
          } else if (transaction.account_type === 'cash') {
            acctDispatch({
              type: 'ADJUST_CASH_BALANCE',
              payload: { id: transaction.account_id, delta: reverseDelta },
            });
          } else if (transaction.account_type === 'card') {
            acctDispatch({
              type: 'ADJUST_CARD_BALANCE',
              payload: { id: transaction.account_id, delta: reverseDelta },
            });
          } else if (transaction.account_type === 'investment') {
            acctDispatch({
              type: 'ADJUST_INVESTMENT_BALANCE',
              payload: { id: transaction.account_id, delta: reverseDelta },
            });
          }
        }
        txDispatch({
          type: 'DELETE_TRANSACTION',
          payload: { id: transaction.id },
        });
        setEditModalVisible(false);
        setSelectedTransaction(null);
      },
      [txDispatch, acctDispatch],
    );

    // Take the 10 most recent transactions (already sorted by created_at DESC)
    const recent = useMemo(
      () => state.transactions.slice(0, 10),
      [state.transactions],
    );

    const groups = useMemo(() => groupByDate(recent), [recent]);

    // Sort date keys: today first, yesterday second, then descending
    const dateOrder = useMemo(() => {
      const today = getTodayISO();
      const yesterday = getYesterdayISO();
      const keys = Object.keys(groups);
      return keys.sort((a, b) => {
        if (a === today || a === 'today') {
          return -1;
        }
        if (b === today || b === 'today') {
          return 1;
        }
        if (a === yesterday || a === 'yesterday') {
          return -1;
        }
        if (b === yesterday || b === 'yesterday') {
          return 1;
        }
        return b.localeCompare(a);
      });
    }, [groups]);

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onSeeAll}>
            <Text style={styles.seeAll}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        {dateOrder.length === 0 && (
          <Text style={styles.subtitle}>No transactions yet</Text>
        )}

        {dateOrder.map(date =>
          groups[date] ? (
            <View key={date}>
              <Text style={styles.dateLabel}>{formatDateLabel(date)}</Text>
              {groups[date].map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onPress={handleTransactionPress}
                />
              ))}
            </View>
          ) : null,
        )}

        {selectedTransaction && (
          <EditTransactionModal
            visible={editModalVisible}
            transaction={selectedTransaction}
            onClose={handleEditClose}
            onDelete={handleDelete}
          />
        )}
      </View>
    );
  },
);

export default RecentTransactions;
