import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EditTransactionModal from '../components/common/EditTransactionModal';
import ModalHeader from '../components/ui/ModalHeader';
import type { AppCategory } from '../db/repositories/categoryRepository';
import { useAccounts } from '../store/accountsStore';
import { useCategories } from '../store/categoriesStore';
import { useTransactions } from '../store/transactionsStore';
import { Colors } from '../theme/colors';
import { Transaction } from '../types';
import { formatAmount } from '../utils/formatters';
import { styles } from './TransactionHistoryScreen.styles';

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'income' | 'expense' | 'transfer';

interface FilterOption {
  key: FilterType;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
  { key: 'transfer', label: 'Transfer' },
];

// ── Category meta helper ──────────────────────────────────────────────────────

interface CategoryMeta {
  emoji: string;
  color: string;
}

const FALLBACK_META: Record<string, CategoryMeta> = {
  e1: { emoji: '\uD83C\uDF74', color: '#EF4444' },
  e2: { emoji: '\uD83D\uDED2', color: '#3B82F6' },
  e3: { emoji: '\uD83D\uDE97', color: '#F97316' },
  e4: { emoji: '\uD83E\uDDFE', color: '#8B5CF6' },
  e5: { emoji: '\uD83C\uDFE5', color: '#14B8A6' },
  e6: { emoji: '\uD83C\uDFAB', color: '#EC4899' },
  e7: { emoji: '\u26A1', color: '#F59E0B' },
  e8: { emoji: '\uD83D\uDCCB', color: '#94A3B8' },
  i1: { emoji: '\uD83D\uDCB0', color: '#22C55E' },
  i2: { emoji: '\uD83D\uDCBB', color: '#22C55E' },
  i3: { emoji: '\uD83D\uDCC8', color: '#22C55E' },
  i4: { emoji: '\uD83C\uDF81', color: '#22C55E' },
  i5: { emoji: '\uD83D\uDCCB', color: '#22C55E' },
  transfer: { emoji: '\uD83D\uDD04', color: '#6366F1' },
};

function getCategoryMeta(
  categoryId: string,
  type: Transaction['type'],
  allCategories: AppCategory[],
): CategoryMeta {
  if (type === 'transfer') {
    return FALLBACK_META.transfer;
  }
  const found = allCategories.find(c => c.id === categoryId);
  if (found) {
    return { emoji: found.emoji, color: found.color };
  }
  return (
    FALLBACK_META[categoryId] ?? { emoji: '\uD83D\uDCCB', color: '#94A3B8' }
  );
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function formatDateLabel(date: string): string {
  const today = getTodayISO();
  const yesterday = getYesterdayISO();
  if (date === today) {
    return 'TODAY';
  }
  if (date === yesterday) {
    return 'YESTERDAY';
  }
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
}

// ── Amount display ────────────────────────────────────────────────────────────

function formatTransferAmount(amount: number): string {
  const abs = Math.abs(amount);
  const formatted =
    abs >= 1000
      ? abs.toLocaleString('en-IN', { maximumFractionDigits: 0 })
      : abs.toString();
  return '\u21C4 \u20B9' + formatted;
}

// ── List item types ───────────────────────────────────────────────────────────

type ListItem =
  | { kind: 'header'; date: string }
  | { kind: 'transaction'; transaction: Transaction };

// ── Transaction row ───────────────────────────────────────────────────────────

interface TransactionRowProps {
  transaction: Transaction;
  allCategories: AppCategory[];
  onPress: (t: Transaction) => void;
  onLongPress: (t: Transaction) => void;
}

const TransactionRow: React.FC<TransactionRowProps> = React.memo(
  ({ transaction, allCategories, onPress, onLongPress }) => {
    const meta = getCategoryMeta(
      transaction.category,
      transaction.type,
      allCategories,
    );

    const amountStyle =
      transaction.type === 'income'
        ? styles.amountIncome
        : transaction.type === 'transfer'
        ? styles.amountTransfer
        : styles.amountExpense;

    const amountText =
      transaction.type === 'transfer'
        ? formatTransferAmount(transaction.amount)
        : formatAmount(transaction.amount);

    return (
      <TouchableOpacity
        style={styles.transactionRow}
        activeOpacity={0.75}
        onPress={() => onPress(transaction)}
        onLongPress={() => onLongPress(transaction)}
        delayLongPress={400}
      >
        <View
          style={[styles.iconCircle, { backgroundColor: meta.color + '1A' }]}
        >
          <Text style={styles.iconEmoji}>{meta.emoji}</Text>
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.txTitle} numberOfLines={1}>
            {transaction.title}
          </Text>
          <Text style={styles.txSubtitle} numberOfLines={1}>
            {transaction.subtitle}
            {' \u2022 '}
            {transaction.time}
          </Text>
        </View>

        <Text style={amountStyle}>{amountText}</Text>
      </TouchableOpacity>
    );
  },
);

// ── Main screen ───────────────────────────────────────────────────────────────

interface TransactionHistoryScreenProps {
  visible: boolean;
  onClose: () => void;
}

const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useTransactions();
  const { dispatch: acctDispatch } = useAccounts();
  const { expenseCategories, incomeCategories } = useCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const searchRef = useRef<TextInput>(null);

  const allCategories = useMemo(
    () => [...expenseCategories, ...incomeCategories],
    [expenseCategories, incomeCategories],
  );

  // ── Filtered + grouped list ────────────────────────────────────────────────

  const listItems = useMemo<ListItem[]>(() => {
    let filtered = state.transactions;

    // Type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === activeFilter);
    }

    // Search filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          (t.note ?? '').toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q),
      );
    }

    // Group by date, sort dates descending
    const groups: Record<string, Transaction[]> = {};
    filtered.forEach(t => {
      if (!groups[t.date]) {
        groups[t.date] = [];
      }
      groups[t.date].push(t);
    });

    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    const items: ListItem[] = [];
    sortedDates.forEach(date => {
      items.push({ kind: 'header', date });
      groups[date].forEach(t =>
        items.push({ kind: 'transaction', transaction: t }),
      );
    });

    return items;
  }, [state.transactions, activeFilter, searchQuery]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    setSearchQuery('');
    setActiveFilter('all');
    onClose();
  }, [onClose]);

  const handleTransactionPress = useCallback((t: Transaction) => {
    setEditingTransaction(t);
  }, []);

  const handleDeleteTransaction = useCallback(
    (t: Transaction) => {
      Alert.alert(
        'Delete Transaction',
        `Are you sure you want to delete "${t.title}"? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              dispatch({ type: 'DELETE_TRANSACTION', payload: { id: t.id } });

              // Reverse the balance effect
              if (t.type !== 'transfer' && t.account_id && t.account_type) {
                const reverseDelta = -t.amount;
                if (t.account_type === 'bank') {
                  acctDispatch({
                    type: 'ADJUST_BANK_BALANCE',
                    payload: { id: t.account_id, delta: reverseDelta },
                  });
                } else if (t.account_type === 'cash') {
                  acctDispatch({
                    type: 'ADJUST_CASH_BALANCE',
                    payload: { id: t.account_id, delta: reverseDelta },
                  });
                } else if (t.account_type === 'card') {
                  acctDispatch({
                    type: 'ADJUST_CARD_BALANCE',
                    payload: { id: t.account_id, delta: reverseDelta },
                  });
                } else if (t.account_type === 'investment') {
                  acctDispatch({
                    type: 'ADJUST_INVESTMENT_BALANCE',
                    payload: { id: t.account_id, delta: reverseDelta },
                  });
                }
              }
            },
          },
        ],
      );
    },
    [dispatch, acctDispatch],
  );

  const handleLongPress = useCallback(
    (t: Transaction) => {
      handleDeleteTransaction(t);
    },
    [handleDeleteTransaction],
  );

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.kind === 'header') {
        return (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              {formatDateLabel(item.date)}
            </Text>
          </View>
        );
      }
      return (
        <TransactionRow
          transaction={item.transaction}
          allCategories={allCategories}
          onPress={handleTransactionPress}
          onLongPress={handleLongPress}
        />
      );
    },
    [allCategories, handleTransactionPress, handleLongPress],
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.kind === 'header') {
      return 'header-' + item.date;
    }
    return item.transaction.id + '-' + index;
  }, []);

  const ListEmpty = useMemo(
    () => (
      <View style={styles.emptyWrapper}>
        <Text style={styles.emptyText}>No transactions found</Text>
        {searchQuery.length > 0 && (
          <Text style={styles.emptySubText}>
            Try a different search term or filter
          </Text>
        )}
      </View>
    ),
    [searchQuery],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={[styles.root, { paddingTop: insets.top }]}>
        {/* Header */}
        <ModalHeader
          title="Transactions"
          onBack={handleClose}
          onSave={() => {}}
          saveLabel=""
        />

        {/* Search bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchRow}>
            <Text style={styles.searchIcon}>{'\uD83D\uDD0D'}</Text>
            <TextInput
              ref={searchRef}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search transactions..."
              placeholderTextColor={Colors.textMuted}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => setSearchQuery('')}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.clearBtnText}>{'\u2715'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterWrapper}>
          <View style={styles.filterScroll}>
            {FILTER_OPTIONS.map(opt => {
              const isActive = activeFilter === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.filterChip,
                    isActive && styles.filterChipActive,
                  ]}
                  onPress={() => setActiveFilter(opt.key)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive && styles.filterChipTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Transaction list */}
        <FlatList
          data={listItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={
            listItems.length === 0
              ? styles.listContentEmpty
              : styles.listContent
          }
          ListEmptyComponent={ListEmpty}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </View>

      {/* Edit transaction modal */}
      {editingTransaction !== null && (
        <EditTransactionModal
          visible={editingTransaction !== null}
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onDelete={(t: Transaction) => {
            setEditingTransaction(null);
            handleDeleteTransaction(t);
          }}
        />
      )}
    </Modal>
  );
};

export default TransactionHistoryScreen;
