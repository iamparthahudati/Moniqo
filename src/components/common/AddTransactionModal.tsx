import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AppCategory } from '../../types';
import {
  BankIcon,
  CalendarIcon,
  CashIcon,
  ChevronDownIcon,
  NoteIcon,
} from '../../icons/Icons';
import { useAccounts } from '../../store/accountsStore';
import { useCategories } from '../../store/categoriesStore';
import { useTransactions } from '../../store/transactionsStore';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';
import type {
  BankAccount,
  CardAccount,
  CashEntry,
  Investment,
} from '../../types';
import ModalHeader from '../ui/ModalHeader';
import { styles } from './AddTransactionModal.styles';

// ── Types ─────────────────────────────────────────────────────────────────────

export type TransactionType = 'expense' | 'income';
type PickerTab = 'date' | 'time';

// Unified account selection — either a bank or cash
type SelectedAccount =
  | { kind: 'cash'; entry: CashEntry }
  | { kind: 'bank'; account: BankAccount }
  | { kind: 'card'; account: CardAccount }
  | { kind: 'investment'; account: Investment };

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) =>
  (CURRENT_YEAR - i).toString(),
);
const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, '0'),
);
const AMPM = ['AM', 'PM'];

const ITEM_H = 48;
const VISIBLE = 5;
const PICKER_H = ITEM_H * VISIBLE;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDisplayTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatBalance(n: number): string {
  return (
    '\u20B9' + Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })
  );
}

function getDaysInMonth(month: number, yearIdx: number): string[] {
  const y = parseInt(YEARS[yearIdx], 10);
  const count = new Date(y, month + 1, 0).getDate();
  return Array.from({ length: count }, (_, i) => (i + 1).toString());
}

// ── Wheel column ──────────────────────────────────────────────────────────────

interface WheelColumnProps {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  width: number;
}

const WheelColumn: React.FC<WheelColumnProps> = ({
  items,
  selectedIndex,
  onSelect,
  width,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const pad = Math.floor(VISIBLE / 2);

  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_H,
        animated: false,
      });
    }, 50);
    return () => clearTimeout(t);
  }, [selectedIndex]);

  const padded = useMemo(
    () => [...Array(pad).fill(''), ...items, ...Array(pad).fill('')],
    [items, pad],
  );

  return (
    <View style={[sharedStyles.column, { width }]}>
      <View style={sharedStyles.highlight} pointerEvents="none" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onMomentumScrollEnd={e => {
          const y = e.nativeEvent.contentOffset.y;
          const idx = Math.max(
            0,
            Math.min(Math.round(y / ITEM_H), items.length - 1),
          );
          onSelect(idx);
          scrollRef.current?.scrollTo({ y: idx * ITEM_H, animated: true });
        }}
      >
        {padded.map((item, i) => {
          const realIdx = i - pad;
          const isSelected = realIdx === selectedIndex;
          return (
            <TouchableOpacity
              key={i}
              style={sharedStyles.wheelItem}
              activeOpacity={0.6}
              onPress={() => {
                if (realIdx >= 0 && realIdx < items.length) {
                  onSelect(realIdx);
                  scrollRef.current?.scrollTo({
                    y: realIdx * ITEM_H,
                    animated: true,
                  });
                }
              }}
            >
              <Text
                style={[
                  sharedStyles.wheelText,
                  isSelected && sharedStyles.wheelTextSelected,
                  item === '' && sharedStyles.wheelTextHidden,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// ── Date/Time picker (absolute overlay) ───────────────────────────────────────

interface DateTimePickerProps {
  visible: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onClose: () => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  visible,
  date,
  onConfirm,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<PickerTab>('date');
  const [dayIdx, setDayIdx] = useState(0);
  const [monthIdx, setMonthIdx] = useState(0);
  const [yearIdx, setYearIdx] = useState(0);
  const [hourIdx, setHourIdx] = useState(0);
  const [minuteIdx, setMinuteIdx] = useState(0);
  const [ampmIdx, setAmpmIdx] = useState(0);

  const days = useMemo(
    () => getDaysInMonth(monthIdx, yearIdx),
    [monthIdx, yearIdx],
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    setTab('date');
    const h = date.getHours();
    setDayIdx(Math.min(date.getDate() - 1, days.length - 1));
    setMonthIdx(date.getMonth());
    const yIdx = YEARS.indexOf(date.getFullYear().toString());
    setYearIdx(yIdx >= 0 ? yIdx : 0);
    setHourIdx(h % 12 === 0 ? 11 : (h % 12) - 1);
    setMinuteIdx(date.getMinutes());
    setAmpmIdx(h >= 12 ? 1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (dayIdx >= days.length) {
      setDayIdx(days.length - 1);
    }
  }, [days, dayIdx]);

  const handleConfirm = useCallback(() => {
    const y = parseInt(YEARS[yearIdx], 10);
    let h = hourIdx + 1;
    if (ampmIdx === 1 && h !== 12) {
      h += 12;
    }
    if (ampmIdx === 0 && h === 12) {
      h = 0;
    }
    onConfirm(new Date(y, monthIdx, dayIdx + 1, h, minuteIdx, 0, 0));
  }, [yearIdx, monthIdx, dayIdx, hourIdx, minuteIdx, ampmIdx, onConfirm]);

  if (!visible) {
    return null;
  }

  return (
    <View style={sharedStyles.overlay}>
      <TouchableOpacity
        style={sharedStyles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={[sharedStyles.sheet, { paddingBottom: insets.bottom + 12 }]}>
        <View style={sharedStyles.handle} />
        <View style={sharedStyles.tabs}>
          {(['date', 'time'] as PickerTab[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[sharedStyles.tab, tab === t && sharedStyles.tabActive]}
              onPress={() => setTab(t)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  sharedStyles.tabText,
                  tab === t && sharedStyles.tabTextActive,
                ]}
              >
                {t === 'date' ? 'Date' : 'Time'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={sharedStyles.wheelsRow}>
          {tab === 'date' ? (
            <>
              <WheelColumn
                items={days}
                selectedIndex={dayIdx}
                onSelect={setDayIdx}
                width={56}
              />
              <WheelColumn
                items={MONTHS}
                selectedIndex={monthIdx}
                onSelect={setMonthIdx}
                width={76}
              />
              <WheelColumn
                items={YEARS}
                selectedIndex={yearIdx}
                onSelect={setYearIdx}
                width={76}
              />
            </>
          ) : (
            <>
              <WheelColumn
                items={HOURS}
                selectedIndex={hourIdx}
                onSelect={setHourIdx}
                width={56}
              />
              <Text style={sharedStyles.colon}>:</Text>
              <WheelColumn
                items={MINUTES}
                selectedIndex={minuteIdx}
                onSelect={setMinuteIdx}
                width={64}
              />
              <WheelColumn
                items={AMPM}
                selectedIndex={ampmIdx}
                onSelect={setAmpmIdx}
                width={60}
              />
            </>
          )}
        </View>
        <TouchableOpacity
          style={sharedStyles.confirmBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Text style={sharedStyles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Account picker (absolute overlay) ────────────────────────────────────────

interface AccountPickerProps {
  visible: boolean;
  bankAccounts: BankAccount[];
  cardAccounts: CardAccount[];
  investments: Investment[];
  cashEntries: CashEntry[];
  selected: SelectedAccount | null;
  onSelect: (account: SelectedAccount) => void;
  onClose: () => void;
}

const AccountPicker: React.FC<AccountPickerProps> = ({
  visible,
  bankAccounts,
  cardAccounts,
  investments,
  cashEntries,
  selected,
  onSelect,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  const selectedId =
    selected?.kind === 'cash'
      ? selected.entry.id
      : selected?.kind === 'bank'
      ? selected.account.id
      : selected?.kind === 'card'
      ? selected.account.id
      : selected?.kind === 'investment'
      ? selected.account.id
      : null;

  const totalCount =
    bankAccounts.length +
    cardAccounts.length +
    investments.length +
    cashEntries.length;

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={accountStyles.section}>
      <Text style={accountStyles.sectionLabel}>{title}</Text>
      {children}
    </View>
  );

  const renderRow = (
    id: string,
    name: string,
    sub: string,
    balance: string,
    color: string,
    icon: React.ReactNode,
    onPress: () => void,
  ) => {
    const isActive = selectedId === id;
    return (
      <TouchableOpacity
        key={id}
        style={[accountStyles.row, isActive && accountStyles.rowActive]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <View
          style={[accountStyles.iconBox, { backgroundColor: color + '22' }]}
        >
          {icon}
        </View>
        <View style={accountStyles.info}>
          <Text
            style={[accountStyles.name, isActive && accountStyles.nameActive]}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text style={accountStyles.sub} numberOfLines={1}>
            {sub}
          </Text>
        </View>
        <View style={accountStyles.right}>
          <Text
            style={[
              accountStyles.balance,
              isActive && accountStyles.balanceActive,
            ]}
          >
            {balance}
          </Text>
          {isActive && (
            <View style={accountStyles.checkCircle}>
              <Text style={accountStyles.checkMark}>{'✓'}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={sharedStyles.overlay}>
      <TouchableOpacity
        style={sharedStyles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={[sharedStyles.sheet, { paddingBottom: insets.bottom + 12 }]}>
        <View style={sharedStyles.handle} />
        <Text style={accountStyles.title}>From Account</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={accountStyles.list}
        >
          {totalCount === 0 && (
            <Text style={accountStyles.empty}>
              No accounts added yet. Add accounts from the Accounts screen.
            </Text>
          )}

          {/* Cash */}
          {cashEntries.length > 0 &&
            renderSection(
              'Cash',
              cashEntries.map(entry =>
                renderRow(
                  entry.id,
                  entry.label,
                  entry.sublabel,
                  formatBalance(entry.amount),
                  '#22C55E',
                  <CashIcon size={20} color="#22C55E" />,
                  () => onSelect({ kind: 'cash', entry }),
                ),
              ),
            )}

          {/* Bank Accounts */}
          {bankAccounts.length > 0 &&
            renderSection(
              'Bank Accounts',
              bankAccounts.map(account =>
                renderRow(
                  account.id,
                  account.bankName,
                  account.accountType,
                  formatBalance(account.balance),
                  account.color,
                  <BankIcon size={20} color={account.color} />,
                  () => onSelect({ kind: 'bank', account }),
                ),
              ),
            )}

          {/* Credit Cards */}
          {cardAccounts.length > 0 &&
            renderSection(
              'Credit Cards',
              cardAccounts.map(account =>
                renderRow(
                  account.id,
                  account.cardName,
                  account.cardType,
                  formatBalance(account.dueAmount) + ' due',
                  account.color,
                  <Text style={[accountStyles.cardEmoji]}>{'💳'}</Text>,
                  () => onSelect({ kind: 'card', account }),
                ),
              ),
            )}

          {/* Investments */}
          {investments.length > 0 &&
            renderSection(
              'Investments',
              investments.map(account =>
                renderRow(
                  account.id,
                  account.name,
                  'Investment',
                  formatBalance(account.amount),
                  account.color,
                  <Text style={accountStyles.cardEmoji}>{'📈'}</Text>,
                  () => onSelect({ kind: 'investment', account }),
                ),
              ),
            )}
        </ScrollView>
      </View>
    </View>
  );
};

const accountStyles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  list: {
    maxHeight: 420,
  },
  section: {
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.background,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  rowActive: {
    backgroundColor: `${Colors.primary}08`,
    borderColor: `${Colors.primary}35`,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardEmoji: {
    fontSize: 20,
  },
  info: { flex: 1, overflow: 'hidden' },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  nameActive: { color: Colors.primary },
  sub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  right: { alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  balance: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  balanceActive: { color: Colors.primary },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700',
  },
  empty: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
    lineHeight: 22,
  },
});

// ── Shared overlay styles (used by both pickers) ──────────────────────────────

const sharedStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: Spacing.base,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.base,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    padding: 3,
    marginBottom: Spacing.base,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  wheelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: PICKER_H,
    marginBottom: Spacing.base,
  },
  column: { height: PICKER_H, overflow: 'hidden' },
  highlight: {
    position: 'absolute',
    top: ITEM_H * Math.floor(VISIBLE / 2),
    left: 0,
    right: 0,
    height: ITEM_H,
    backgroundColor: `${Colors.primary}14`,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: `${Colors.primary}35`,
    borderRadius: 8,
    zIndex: 1,
  },
  wheelItem: { height: ITEM_H, alignItems: 'center', justifyContent: 'center' },
  wheelText: { fontSize: 17, fontWeight: '500', color: Colors.textMuted },
  wheelTextSelected: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  wheelTextHidden: { opacity: 0 },
  colon: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: 4,
    alignSelf: 'center',
    marginBottom: 4,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  confirmText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});

// ── Category chip ─────────────────────────────────────────────────────────────

interface CategoryChipProps {
  category: AppCategory;
  isActive: boolean;
  onPress: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = React.memo(
  ({ category, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        isActive && {
          backgroundColor: category.color,
          borderColor: category.color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={styles.categoryChipEmoji}>{category.emoji}</Text>
      <Text
        style={[
          styles.categoryChipLabel,
          isActive && styles.categoryChipLabelActive,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  ),
);

// ── Main component ────────────────────────────────────────────────────────────

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  initialType?: TransactionType;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  initialType = 'expense',
}) => {
  const insets = useSafeAreaInsets();
  const { state: accountsState, dispatch: acctDispatch } = useAccounts();
  const { dispatch: txDispatch } = useTransactions();
  const { expenseCategories, incomeCategories } = useCategories();

  const [txType, setTxType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('e1');
  const [selectedAccount, setSelectedAccount] =
    useState<SelectedAccount | null>(null);
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [accountPickerVisible, setAccountPickerVisible] = useState(false);

  const { bankAccounts, cardAccounts, investments, cashEntries } =
    accountsState;

  // Default account: cash > bank > card > investment
  const defaultAccount = useMemo<SelectedAccount | null>(() => {
    if (cashEntries.length > 0) {
      return { kind: 'cash', entry: cashEntries[0] };
    }
    if (bankAccounts.length > 0) {
      return { kind: 'bank', account: bankAccounts[0] };
    }
    if (cardAccounts.length > 0) {
      return { kind: 'card', account: cardAccounts[0] };
    }
    if (investments.length > 0) {
      return { kind: 'investment', account: investments[0] };
    }
    return null;
  }, [cashEntries, bankAccounts, cardAccounts, investments]);

  useEffect(() => {
    if (visible) {
      setTxType(initialType);
      setSelectedDate(new Date());
      setSelectedCategory(initialType === 'income' ? 'i1' : 'e1');
      setSelectedAccount(defaultAccount);
    }
  }, [visible, initialType, defaultAccount]);

  const handleSetTxType = useCallback((t: TransactionType) => {
    setTxType(t);
    setSelectedCategory(t === 'income' ? 'i1' : 'e1');
  }, []);

  const resetForm = useCallback(() => {
    setAmount('');
    setSelectedCategory('e1');
    setSelectedAccount(defaultAccount);
    setNote('');
    setSelectedDate(new Date());
  }, [defaultAccount]);

  const handleSave = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      return;
    }

    const isoDate = selectedDate.toISOString().split('T')[0];
    const timeStr = formatDisplayTime(selectedDate);
    const finalAmount = txType === 'expense' ? -numAmount : numAmount;

    const allCats = [...expenseCategories, ...incomeCategories];
    const catObj = allCats.find(c => c.id === selectedCategory);
    const title = catObj?.name ?? (txType === 'income' ? 'Income' : 'Expense');

    const accountId =
      selectedAccount?.kind === 'cash'
        ? undefined
        : selectedAccount?.account.id;
    const accountType: 'bank' | 'card' | 'cash' | 'investment' =
      selectedAccount?.kind === 'bank'
        ? 'bank'
        : selectedAccount?.kind === 'card'
        ? 'card'
        : selectedAccount?.kind === 'investment'
        ? 'investment'
        : 'cash';

    txDispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        title,
        subtitle: note || title,
        amount: finalAmount,
        type: txType,
        category: selectedCategory,
        account_id: accountId,
        account_type: accountType,
        date: isoDate,
        time: timeStr,
        note: note || undefined,
        created_at: Date.now(),
      },
    });

    // Adjust account balance
    if (selectedAccount?.kind === 'bank') {
      acctDispatch({
        type: 'ADJUST_BANK_BALANCE',
        payload: { id: selectedAccount.account.id, delta: finalAmount },
      });
    } else if (selectedAccount?.kind === 'cash') {
      acctDispatch({
        type: 'ADJUST_CASH_BALANCE',
        payload: { id: selectedAccount.entry.id, delta: finalAmount },
      });
    } else if (selectedAccount?.kind === 'card') {
      acctDispatch({
        type: 'ADJUST_CARD_BALANCE',
        payload: { id: selectedAccount.account.id, delta: finalAmount },
      });
    } else if (selectedAccount?.kind === 'investment') {
      acctDispatch({
        type: 'ADJUST_INVESTMENT_BALANCE',
        payload: { id: selectedAccount.account.id, delta: finalAmount },
      });
    }

    resetForm();
    onClose();
  }, [
    amount,
    txType,
    selectedCategory,
    selectedAccount,
    note,
    selectedDate,
    expenseCategories,
    incomeCategories,
    txDispatch,
    acctDispatch,
    resetForm,
    onClose,
  ]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const isExpense = txType === 'expense';

  // Account display label
  const accountLabel = useMemo(() => {
    if (!selectedAccount) {
      return 'Select Account';
    }
    if (selectedAccount.kind === 'cash') {
      return selectedAccount.entry.label;
    }
    if (selectedAccount.kind === 'bank') {
      return selectedAccount.account.bankName;
    }
    if (selectedAccount.kind === 'card') {
      return selectedAccount.account.cardName;
    }
    if (selectedAccount.kind === 'investment') {
      return selectedAccount.account.name;
    }
    return 'Select Account';
  }, [selectedAccount]);

  const accountSub = useMemo(() => {
    if (!selectedAccount) {
      return '';
    }
    if (selectedAccount.kind === 'cash') {
      return selectedAccount.entry.sublabel;
    }
    if (selectedAccount.kind === 'bank') {
      return selectedAccount.account.accountType;
    }
    if (selectedAccount.kind === 'card') {
      return selectedAccount.account.cardType;
    }
    if (selectedAccount.kind === 'investment') {
      return 'Investment';
    }
    return '';
  }, [selectedAccount]);

  const accountColor = useMemo(() => {
    if (!selectedAccount) {
      return Colors.textMuted;
    }
    if (selectedAccount.kind === 'cash') {
      return Colors.incomeGreen;
    }
    return selectedAccount.account.color;
  }, [selectedAccount]);

  const accountBalance = useMemo(() => {
    if (!selectedAccount) {
      return '';
    }
    if (selectedAccount.kind === 'cash') {
      return formatBalance(selectedAccount.entry.amount);
    }
    if (selectedAccount.kind === 'bank') {
      return formatBalance(selectedAccount.account.balance);
    }
    if (selectedAccount.kind === 'card') {
      return formatBalance(selectedAccount.account.dueAmount) + ' due';
    }
    if (selectedAccount.kind === 'investment') {
      return formatBalance(selectedAccount.account.amount);
    }
    return '';
  }, [selectedAccount]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={styles.modalRoot}>
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <ModalHeader
            title="Add Transaction"
            onBack={handleClose}
            onSave={handleSave}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Type toggle ── */}
            <View style={styles.typeToggleWrapper}>
              <View style={styles.typeToggle}>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    isExpense ? styles.typeBtnActive : styles.typeBtnInactive,
                  ]}
                  onPress={() => handleSetTxType('expense')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      isExpense
                        ? styles.typeBtnTextActive
                        : styles.typeBtnTextInactive,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeBtn,
                    !isExpense
                      ? styles.typeBtnActiveIncome
                      : styles.typeBtnInactive,
                  ]}
                  onPress={() => handleSetTxType('income')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      !isExpense
                        ? styles.typeBtnTextActive
                        : styles.typeBtnTextInactive,
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Amount ── */}
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <View style={styles.amountRow}>
                <Text style={styles.currencySymbol}>{'\u20B9'}</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            </View>

            {/* ── Category ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
                keyboardShouldPersistTaps="handled"
              >
                {(isExpense ? expenseCategories : incomeCategories).map(cat => (
                  <CategoryChip
                    key={cat.id}
                    category={cat}
                    isActive={selectedCategory === cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* ── Account ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>From Account</Text>
              <TouchableOpacity
                style={[styles.dateRow, { marginTop: Spacing.md }]}
                activeOpacity={0.8}
                onPress={() => setAccountPickerVisible(true)}
              >
                {/* Coloured icon box */}
                <View
                  style={[
                    styles.accountIconBox,
                    { backgroundColor: accountColor + '20' },
                  ]}
                >
                  {selectedAccount?.kind === 'cash' ? (
                    <CashIcon size={20} color={accountColor} />
                  ) : (
                    <BankIcon size={20} color={accountColor} />
                  )}
                </View>
                <View style={styles.dateTextGroup}>
                  <Text style={styles.dateLabel}>
                    {accountSub || 'Tap to select'}
                  </Text>
                  <Text style={styles.dateValue}>{accountLabel}</Text>
                </View>
                <View style={styles.accountBalancePill}>
                  <Text style={styles.accountBalanceText}>
                    {accountBalance}
                  </Text>
                </View>
                <ChevronDownIcon size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* ── Date & Time ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date & Time</Text>
              <TouchableOpacity
                style={[styles.dateRow, { marginTop: Spacing.md }]}
                activeOpacity={0.8}
                onPress={() => setDatePickerVisible(true)}
              >
                <CalendarIcon size={22} color={Colors.primary} />
                <View style={styles.dateTextGroup}>
                  <Text style={styles.dateLabel}>Selected</Text>
                  <Text style={styles.dateValue}>
                    {formatDisplayDate(selectedDate)}
                    {'   '}
                    <Text style={styles.timeValue}>
                      {formatDisplayTime(selectedDate)}
                    </Text>
                  </Text>
                </View>
                <ChevronDownIcon size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* ── Note ── */}
            <View style={styles.section}>
              <View style={styles.noteRow}>
                <NoteIcon size={20} color={Colors.textMuted} />
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add note (optional)"
                  placeholderTextColor={Colors.textMuted}
                  multiline={false}
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* ── Submit ── */}
            <View style={styles.submitSection}>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSave}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>Add Transaction</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Date/Time picker overlay */}
        <DateTimePicker
          visible={datePickerVisible}
          date={selectedDate}
          onConfirm={d => {
            setSelectedDate(d);
            setDatePickerVisible(false);
          }}
          onClose={() => setDatePickerVisible(false)}
        />

        {/* Account picker overlay */}
        <AccountPicker
          visible={accountPickerVisible}
          bankAccounts={bankAccounts}
          cardAccounts={cardAccounts}
          investments={investments}
          cashEntries={cashEntries}
          selected={selectedAccount}
          onSelect={acc => {
            setSelectedAccount(acc);
            setAccountPickerVisible(false);
          }}
          onClose={() => setAccountPickerVisible(false)}
        />
      </View>
    </Modal>
  );
};

export default AddTransactionModal;
