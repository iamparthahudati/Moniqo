import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ModalHeader from '../components/ui/ModalHeader';
import { PlusIcon } from '../icons/Icons';
import { Colors } from '../theme/colors';
import { styles } from './GroupDetailScreen.styles';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Member {
  name: string;
  color: string;
  balance: number; // positive = they owe you, negative = you owe them, 0 = settled
}

interface Expense {
  id: string;
  title: string;
  paidBy: string;
  total: number;
  yourShare: number;
  date: string;
  iconColor: string;
  iconLetter: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_MEMBERS: Member[] = [
  { name: 'You', color: '#2B3FE8', balance: 0 },
  { name: 'Rahul', color: '#22C55E', balance: 850 },
  { name: 'Priya', color: '#EC4899', balance: -400 },
  { name: 'Ankit', color: '#F97316', balance: 400 },
];

const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    title: 'Hotel Booking',
    paidBy: 'You',
    total: 4800,
    yourShare: 1200,
    date: 'Mar 20',
    iconColor: '#2B3FE8',
    iconLetter: 'H',
  },
  {
    id: '2',
    title: 'Beach Shack Dinner',
    paidBy: 'Rahul',
    total: 2400,
    yourShare: 600,
    date: 'Mar 21',
    iconColor: '#22C55E',
    iconLetter: 'B',
  },
  {
    id: '3',
    title: 'Scooter Rental',
    paidBy: 'You',
    total: 1200,
    yourShare: 300,
    date: 'Mar 22',
    iconColor: '#F97316',
    iconLetter: 'S',
  },
];

const NET_BALANCE = 850;

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatAmount(n: number): string {
  return '\u20B9' + Math.abs(n).toLocaleString('en-IN');
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface MemberAvatarProps {
  member: Member;
}

const MemberAvatar: React.FC<MemberAvatarProps> = ({ member }) => {
  const balanceStyle =
    member.balance > 0
      ? styles.memberBalanceOwed
      : member.balance < 0
      ? styles.memberBalanceOwe
      : styles.memberBalanceNeutral;

  const balanceLabel =
    member.balance === 0
      ? 'Settled'
      : member.balance > 0
      ? '+' + formatAmount(member.balance)
      : '-' + formatAmount(member.balance);

  return (
    <View style={styles.memberItem}>
      <View style={[styles.memberAvatar, { backgroundColor: member.color }]}>
        <Text style={styles.memberInitial}>{getInitial(member.name)}</Text>
      </View>
      <Text style={styles.memberName} numberOfLines={1}>
        {member.name}
      </Text>
      <Text style={[styles.memberBalance, balanceStyle]} numberOfLines={1}>
        {balanceLabel}
      </Text>
    </View>
  );
};

interface ExpenseRowProps {
  expense: Expense;
  onPress: () => void;
}

const ExpenseRow: React.FC<ExpenseRowProps> = ({ expense, onPress }) => (
  <TouchableOpacity
    style={styles.expenseRow}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <View
      style={[styles.expenseIconCircle, { backgroundColor: expense.iconColor }]}
    >
      <Text style={styles.expenseIconText}>{expense.iconLetter}</Text>
    </View>

    <View style={styles.expenseInfo}>
      <Text style={styles.expenseTitle} numberOfLines={1}>
        {expense.title}
      </Text>
      <Text style={styles.expensePaidBy}>{'paid by ' + expense.paidBy}</Text>
      <Text style={styles.expenseDate}>{expense.date}</Text>
    </View>

    <View style={styles.expenseRight}>
      <Text style={styles.expenseTotal}>{formatAmount(expense.total)}</Text>
      <View style={styles.expenseShareBadge}>
        <Text style={styles.expenseShareText}>
          {'Your share: ' + formatAmount(expense.yourShare)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

// ── Props ──────────────────────────────────────────────────────────────────────

interface GroupDetailScreenProps {
  visible: boolean;
  onClose: () => void;
  onAddExpense?: () => void;
}

// ── Main component ─────────────────────────────────────────────────────────────

const GroupDetailScreen: React.FC<GroupDetailScreenProps> = ({
  visible,
  onClose,
  onAddExpense,
}) => {
  const [expenses] = useState<Expense[]>(MOCK_EXPENSES);

  const handleExpensePress = () => {
    Alert.alert('Expense detail coming soon');
  };

  const handleSettleUp = () => {
    Alert.alert('Settle Up', 'Settle up flow coming soon');
  };

  const handleAddExpense = () => {
    if (onAddExpense) {
      onAddExpense();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={styles.root}>
        <ModalHeader
          title="Goa Trip"
          onBack={onClose}
          onSave={() => {}}
          saveLabel=""
        />

        <FlatList
          data={expenses}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <>
              {/* ── Members row ── */}
              <View style={styles.membersSection}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.membersScroll}
                >
                  {MOCK_MEMBERS.map(member => (
                    <MemberAvatar key={member.name} member={member} />
                  ))}
                </ScrollView>
              </View>

              {/* ── Net balance card ── */}
              <View style={styles.balanceCard}>
                <View style={styles.balanceCardLeft}>
                  <Text style={styles.balanceCardLabel}>
                    {'OVERALL BALANCE'}
                  </Text>
                  <Text style={styles.balanceCardAmount}>
                    {formatAmount(NET_BALANCE)}
                  </Text>
                  <Text style={styles.balanceCardSub}>
                    {'you are owed in total'}
                  </Text>
                </View>
                <View style={styles.balanceCardBadge}>
                  <Text style={styles.balanceCardBadgeText}>
                    {'+' + formatAmount(NET_BALANCE)}
                  </Text>
                </View>
              </View>

              {/* ── Settle Up ── */}
              <View style={styles.settleSection}>
                <TouchableOpacity
                  style={styles.settleBtn}
                  onPress={handleSettleUp}
                  activeOpacity={0.85}
                >
                  <Text style={styles.settleBtnText}>{'Settle Up'}</Text>
                </TouchableOpacity>
              </View>

              {/* ── Expenses header ── */}
              <View style={styles.expensesSection}>
                <View style={styles.expensesSectionHeader}>
                  <Text style={styles.expensesSectionTitle}>{'Expenses'}</Text>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={handleAddExpense}
                    activeOpacity={0.75}
                  >
                    <PlusIcon size={14} color={Colors.primary} />
                    <Text style={styles.addBtnText}>{'Add'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <View style={styles.expenseRowWrapper}>
              <ExpenseRow expense={item} onPress={handleExpensePress} />
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

export default GroupDetailScreen;
