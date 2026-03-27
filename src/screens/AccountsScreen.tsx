import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AddBankModal from '../components/accounts/AddBankModal';
import AddCardModal from '../components/accounts/AddCardModal';
import AddCashModal from '../components/accounts/AddCashModal';
import AddInvestmentModal from '../components/accounts/AddInvestmentModal';
import IconCircle from '../components/ui/IconCircle';
import ScreenHeader from '../components/ui/ScreenHeader';
import {
  BankIcon,
  BitcoinIcon,
  CashIcon,
  ChevronRightIcon,
  CreditCardIcon,
  PiggyIcon,
  PlusIcon,
  TrendLineIcon,
} from '../icons/Icons';
import { computeTotalBalance, useAccounts } from '../store/accountsStore';
import { Colors } from '../theme/colors';
import { BankAccount, CardAccount, CashEntry, Investment } from '../types';
import { formatCurrency, formatCurrencyFull } from '../utils/formatters';
import { styles } from './AccountsScreen.styles';

// ── Icon helpers ──────────────────────────────────────────────────────────────

const getBankIcon = (icon: BankAccount['icon'], color: string) => {
  const bg = `${color}18`;
  return (
    <IconCircle size={48} backgroundColor={bg}>
      {icon === 'piggy' ? (
        <PiggyIcon size={26} color={color} />
      ) : (
        <BankIcon size={24} color={color} />
      )}
    </IconCircle>
  );
};

const getInvestIcon = (icon: Investment['icon'], color: string) => {
  switch (icon) {
    case 'bitcoin':
      return <BitcoinIcon size={22} color={color} />;
    case 'trend':
    default:
      return <TrendLineIcon size={22} color={color} />;
  }
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface TotalBalanceCardProps {
  total: number;
  accountCount: number;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = React.memo(
  ({ total, accountCount }) => (
    <View style={styles.totalCard}>
      <Text style={styles.totalLabel}>Total Balance</Text>
      <Text style={styles.totalAmount}>{formatCurrencyFull(total)}</Text>
      <View style={styles.totalSubRow}>
        <Text style={styles.totalSubText}>
          Across {accountCount} account{accountCount !== 1 ? 's' : ''}
        </Text>
        <View style={styles.totalBadge}>
          <TrendLineIcon size={11} color={Colors.incomeGreen} />
          <Text style={styles.totalBadgeText}>Active</Text>
        </View>
      </View>
    </View>
  ),
);

interface BankAccountRowProps {
  account: BankAccount;
  onEdit: (account: BankAccount) => void;
  onDelete: (id: string) => void;
}

const BankAccountRow: React.FC<BankAccountRowProps> = React.memo(
  ({ account, onEdit, onDelete }) => (
    <TouchableOpacity
      style={styles.accountCard}
      activeOpacity={0.75}
      onPress={() => onEdit(account)}
      onLongPress={() => onDelete(account.id)}
    >
      {getBankIcon(account.icon, account.color)}
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{account.bankName}</Text>
        <Text style={styles.accountType}>{account.accountType}</Text>
      </View>
      <View style={styles.accountRight}>
        <Text style={styles.accountBalance}>
          {formatCurrency(account.balance)}
        </Text>
        <Text
          style={
            account.status === 'ACTIVE'
              ? styles.accountStatus
              : styles.accountStatusInactive
          }
        >
          {account.status}
        </Text>
      </View>
      <View style={styles.chevron}>
        <ChevronRightIcon size={16} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  ),
);

interface CardAccountRowProps {
  card: CardAccount;
  onEdit: (card: CardAccount) => void;
  onDelete: (id: string) => void;
}

const CardAccountRow: React.FC<CardAccountRowProps> = React.memo(
  ({ card, onEdit, onDelete }) => (
    <TouchableOpacity
      style={styles.accountCard}
      activeOpacity={0.75}
      onPress={() => onEdit(card)}
      onLongPress={() => onDelete(card.id)}
    >
      <IconCircle size={48} backgroundColor={`${card.color}18`}>
        <CreditCardIcon size={24} color={card.color} />
      </IconCircle>
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{card.cardName}</Text>
        <Text style={styles.accountType}>{card.cardType}</Text>
      </View>
      <View style={styles.accountRight}>
        <Text style={styles.accountDueDash}>{'-'}</Text>
        <Text style={styles.accountDueAmount}>
          {formatCurrency(card.dueAmount)}
        </Text>
        <Text style={styles.accountStatusDue}>{card.dueLabel}</Text>
      </View>
      <View style={styles.chevron}>
        <ChevronRightIcon size={16} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  ),
);

interface InvestmentCardProps {
  inv: Investment;
  onEdit: (inv: Investment) => void;
  onDelete: (id: string) => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = React.memo(
  ({ inv, onEdit, onDelete }) => (
    <TouchableOpacity
      style={styles.investCard}
      activeOpacity={0.75}
      onPress={() => onEdit(inv)}
      onLongPress={() => onDelete(inv.id)}
    >
      <IconCircle size={40} backgroundColor={`${inv.color}18`}>
        {getInvestIcon(inv.icon, inv.color)}
      </IconCircle>
      <View>
        <Text style={styles.investName}>{inv.name}</Text>
        <Text style={styles.investAmount}>{formatCurrency(inv.amount)}</Text>
      </View>
    </TouchableOpacity>
  ),
);

interface CashRowProps {
  entry: CashEntry;
  onEdit: (entry: CashEntry) => void;
  onDelete: (id: string) => void;
}

const CashRow: React.FC<CashRowProps> = React.memo(
  ({ entry, onEdit, onDelete }) => (
    <TouchableOpacity
      style={styles.cashCard}
      activeOpacity={0.75}
      onPress={() => onEdit(entry)}
      onLongPress={() => onDelete(entry.id)}
    >
      <IconCircle size={48} backgroundColor={'rgba(43,63,232,0.08)'}>
        <CashIcon size={22} color={Colors.primary} />
      </IconCircle>
      <View style={styles.cashInfo}>
        <Text style={styles.cashLabel}>{entry.label}</Text>
        <Text style={styles.cashSublabel}>{entry.sublabel}</Text>
      </View>
      <Text style={styles.cashAmount}>{formatCurrency(entry.amount)}</Text>
    </TouchableOpacity>
  ),
);

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptySection: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyText}>No {label} yet</Text>
  </View>
);

// ── Screen ────────────────────────────────────────────────────────────────────

type ModalType = 'bank' | 'card' | 'investment' | 'cash' | null;

const AccountsScreen: React.FC = () => {
  const { state, dispatch } = useAccounts();
  const { bankAccounts, cardAccounts, investments, cashEntries } = state;

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingBank, setEditingBank] = useState<BankAccount | undefined>();
  const [editingCard, setEditingCard] = useState<CardAccount | undefined>();
  const [editingInvestment, setEditingInvestment] = useState<
    Investment | undefined
  >();
  const [editingCash, setEditingCash] = useState<CashEntry | undefined>();

  // ── Computed values ─────────────────────────────────────────────────────────
  const totalBalance = useMemo(() => computeTotalBalance(state), [state]);
  const totalAccountCount = useMemo(
    () =>
      bankAccounts.length +
      cardAccounts.length +
      investments.length +
      cashEntries.length,
    [bankAccounts, cardAccounts, investments, cashEntries],
  );

  // ── Open modals ─────────────────────────────────────────────────────────────
  const openAddBank = useCallback(() => {
    setEditingBank(undefined);
    setActiveModal('bank');
  }, []);

  const openAddCard = useCallback(() => {
    setEditingCard(undefined);
    setActiveModal('card');
  }, []);

  const openAddInvestment = useCallback(() => {
    setEditingInvestment(undefined);
    setActiveModal('investment');
  }, []);

  const openAddCash = useCallback(() => {
    setEditingCash(undefined);
    setActiveModal('cash');
  }, []);

  const openEditBank = useCallback((account: BankAccount) => {
    setEditingBank(account);
    setActiveModal('bank');
  }, []);

  const openEditCard = useCallback((card: CardAccount) => {
    setEditingCard(card);
    setActiveModal('card');
  }, []);

  const openEditInvestment = useCallback((inv: Investment) => {
    setEditingInvestment(inv);
    setActiveModal('investment');
  }, []);

  const openEditCash = useCallback((entry: CashEntry) => {
    setEditingCash(entry);
    setActiveModal('cash');
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setEditingBank(undefined);
    setEditingCard(undefined);
    setEditingInvestment(undefined);
    setEditingCash(undefined);
  }, []);

  // ── Delete helpers ──────────────────────────────────────────────────────────
  const confirmDelete = useCallback((label: string, onConfirm: () => void) => {
    Alert.alert(
      `Delete ${label}`,
      `Are you sure you want to remove this ${label.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onConfirm },
      ],
    );
  }, []);

  const handleDeleteBank = useCallback(
    (id: string) =>
      confirmDelete('Bank Account', () =>
        dispatch({ type: 'DELETE_BANK', payload: { id } }),
      ),
    [confirmDelete, dispatch],
  );

  const handleDeleteCard = useCallback(
    (id: string) =>
      confirmDelete('Credit Card', () =>
        dispatch({ type: 'DELETE_CARD', payload: { id } }),
      ),
    [confirmDelete, dispatch],
  );

  const handleDeleteInvestment = useCallback(
    (id: string) =>
      confirmDelete('Investment', () =>
        dispatch({ type: 'DELETE_INVESTMENT', payload: { id } }),
      ),
    [confirmDelete, dispatch],
  );

  const handleDeleteCash = useCallback(
    (id: string) =>
      confirmDelete('Cash Entry', () =>
        dispatch({ type: 'DELETE_CASH', payload: { id } }),
      ),
    [confirmDelete, dispatch],
  );

  // ── Save handlers ───────────────────────────────────────────────────────────
  const handleSaveBank = useCallback(
    (data: Omit<BankAccount, 'id'> & { id?: string }) => {
      if (data.id) {
        dispatch({ type: 'UPDATE_BANK', payload: data as BankAccount });
      } else {
        dispatch({ type: 'ADD_BANK', payload: data as BankAccount });
      }
      closeModal();
    },
    [dispatch, closeModal],
  );

  const handleSaveCard = useCallback(
    (data: Omit<CardAccount, 'id'> & { id?: string }) => {
      if (data.id) {
        dispatch({ type: 'UPDATE_CARD', payload: data as CardAccount });
      } else {
        dispatch({ type: 'ADD_CARD', payload: data as CardAccount });
      }
      closeModal();
    },
    [dispatch, closeModal],
  );

  const handleSaveInvestment = useCallback(
    (data: Omit<Investment, 'id'> & { id?: string }) => {
      if (data.id) {
        dispatch({ type: 'UPDATE_INVESTMENT', payload: data as Investment });
      } else {
        dispatch({ type: 'ADD_INVESTMENT', payload: data as Investment });
      }
      closeModal();
    },
    [dispatch, closeModal],
  );

  const handleSaveCash = useCallback(
    (data: Omit<CashEntry, 'id'> & { id?: string }) => {
      if (data.id) {
        dispatch({ type: 'UPDATE_CASH', payload: data as CashEntry });
      } else {
        dispatch({ type: 'ADD_CASH', payload: data as CashEntry });
      }
      closeModal();
    },
    [dispatch, closeModal],
  );

  // ── Add menu ────────────────────────────────────────────────────────────────
  const showAddMenu = useCallback(() => {
    Alert.alert('Add Account', 'What would you like to add?', [
      { text: 'Bank Account', onPress: openAddBank },
      { text: 'Credit Card', onPress: openAddCard },
      { text: 'Investment', onPress: openAddInvestment },
      { text: 'Cash Entry', onPress: openAddCash },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [openAddBank, openAddCard, openAddInvestment, openAddCash]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Accounts"
        rightSlot={
          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.7}
            onPress={showAddMenu}
          >
            <PlusIcon size={22} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Total Balance */}
        <TotalBalanceCard
          total={totalBalance}
          accountCount={totalAccountCount}
        />

        {/* Banks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Banks</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={openAddBank}>
              <Text style={styles.viewAll}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {bankAccounts.length === 0 ? (
            <EmptySection label="bank accounts" />
          ) : (
            bankAccounts.map(acc => (
              <BankAccountRow
                key={acc.id}
                account={acc}
                onEdit={openEditBank}
                onDelete={handleDeleteBank}
              />
            ))
          )}
        </View>

        {/* Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cards</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={openAddCard}>
              <Text style={styles.viewAll}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {cardAccounts.length === 0 ? (
            <EmptySection label="credit cards" />
          ) : (
            cardAccounts.map(card => (
              <CardAccountRow
                key={card.id}
                card={card}
                onEdit={openEditCard}
                onDelete={handleDeleteCard}
              />
            ))
          )}
        </View>

        {/* Investments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Investments</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={openAddInvestment}>
              <Text style={styles.viewAll}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {investments.length === 0 ? (
            <EmptySection label="investments" />
          ) : (
            <View style={styles.investGrid}>
              {investments.map(inv => (
                <InvestmentCard
                  key={inv.id}
                  inv={inv}
                  onEdit={openEditInvestment}
                  onDelete={handleDeleteInvestment}
                />
              ))}
            </View>
          )}
        </View>

        {/* Cash */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cash</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={openAddCash}>
              <Text style={styles.viewAll}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {cashEntries.length === 0 ? (
            <EmptySection label="cash entries" />
          ) : (
            cashEntries.map(entry => (
              <CashRow
                key={entry.id}
                entry={entry}
                onEdit={openEditCash}
                onDelete={handleDeleteCash}
              />
            ))
          )}
        </View>

        <Text style={styles.hintText}>Tap to edit • Long press to delete</Text>
      </ScrollView>

      {/* ── Modals ── */}
      <AddBankModal
        visible={activeModal === 'bank'}
        onClose={closeModal}
        onSave={handleSaveBank}
        initial={editingBank}
      />
      <AddCardModal
        visible={activeModal === 'card'}
        onClose={closeModal}
        onSave={handleSaveCard}
        initial={editingCard}
      />
      <AddInvestmentModal
        visible={activeModal === 'investment'}
        onClose={closeModal}
        onSave={handleSaveInvestment}
        initial={editingInvestment}
      />
      <AddCashModal
        visible={activeModal === 'cash'}
        onClose={closeModal}
        onSave={handleSaveCash}
        initial={editingCash}
      />
    </View>
  );
};

export default AccountsScreen;
