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
import { generateId } from '../../db/database';
import {
  BankIcon,
  CalendarIcon,
  CashIcon,
  ChevronDownIcon,
  NoteIcon,
} from '../../icons/Icons';
import { useAccounts } from '../../store/accountsStore';
import { useTransactions } from '../../store/transactionsStore';
import { Colors } from '../../theme/colors';
import { Radius, Shadow, Spacing } from '../../theme/spacing';
import type {
  BankAccount,
  CardAccount,
  CashEntry,
  Investment,
} from '../../types';
import ModalHeader from '../ui/ModalHeader';
import { styles } from './TransferModal.styles';

// ── Types ─────────────────────────────────────────────────────────────────────

type SelectedAccount =
  | { kind: 'cash'; entry: CashEntry }
  | { kind: 'bank'; account: BankAccount }
  | { kind: 'card'; account: CardAccount }
  | { kind: 'investment'; account: Investment };

type PickerTab = 'date' | 'time';

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

function getAccountId(acc: SelectedAccount): string {
  return acc.kind === 'cash' ? acc.entry.id : acc.account.id;
}

function getAccountName(acc: SelectedAccount): string {
  if (acc.kind === 'cash') {
    return acc.entry.label;
  }
  if (acc.kind === 'bank') {
    return acc.account.bankName;
  }
  if (acc.kind === 'card') {
    return acc.account.cardName;
  }
  return acc.account.name;
}

function getAccountSub(acc: SelectedAccount): string {
  if (acc.kind === 'cash') {
    return acc.entry.sublabel;
  }
  if (acc.kind === 'bank') {
    return acc.account.accountType;
  }
  if (acc.kind === 'card') {
    return acc.account.cardType;
  }
  return 'Investment';
}

function getAccountColor(acc: SelectedAccount): string {
  if (acc.kind === 'cash') {
    return Colors.incomeGreen;
  }
  return acc.account.color;
}

function getAccountBalance(acc: SelectedAccount): string {
  if (acc.kind === 'cash') {
    return formatBalance(acc.entry.amount);
  }
  if (acc.kind === 'bank') {
    return formatBalance(acc.account.balance);
  }
  if (acc.kind === 'card') {
    return formatBalance(acc.account.dueAmount) + ' due';
  }
  return formatBalance(acc.account.amount);
}

function getAccountType(
  acc: SelectedAccount,
): 'bank' | 'card' | 'cash' | 'investment' {
  return acc.kind;
}

// ── WheelColumn ───────────────────────────────────────────────────────────────

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

// ── DateTimePicker ────────────────────────────────────────────────────────────

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

// ── AccountPicker ─────────────────────────────────────────────────────────────

interface AccountPickerProps {
  visible: boolean;
  title: string;
  bankAccounts: BankAccount[];
  cardAccounts: CardAccount[];
  investments: Investment[];
  cashEntries: CashEntry[];
  selected: SelectedAccount | null;
  excludeId: string | null;
  onSelect: (account: SelectedAccount) => void;
  onClose: () => void;
}

const AccountPicker: React.FC<AccountPickerProps> = ({
  visible,
  title,
  bankAccounts,
  cardAccounts,
  investments,
  cashEntries,
  selected,
  excludeId,
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

  const renderSection = (sectionTitle: string, children: React.ReactNode) => (
    <View style={accountStyles.section}>
      <Text style={accountStyles.sectionLabel}>{sectionTitle}</Text>
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
    const isExcluded = excludeId === id;
    return (
      <TouchableOpacity
        key={id}
        style={[
          accountStyles.row,
          isActive && accountStyles.rowActive,
          isExcluded && accountStyles.rowExcluded,
        ]}
        onPress={isExcluded ? undefined : onPress}
        activeOpacity={isExcluded ? 1 : 0.75}
      >
        <View
          style={[accountStyles.iconBox, { backgroundColor: color + '22' }]}
        >
          {icon}
        </View>
        <View style={accountStyles.info}>
          <Text
            style={[
              accountStyles.name,
              isActive && accountStyles.nameActive,
              isExcluded && accountStyles.nameExcluded,
            ]}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text style={accountStyles.sub} numberOfLines={1}>
            {isExcluded ? 'Already selected' : sub}
          </Text>
        </View>
        <View style={accountStyles.right}>
          <Text
            style={[
              accountStyles.balance,
              isActive && accountStyles.balanceActive,
              isExcluded && accountStyles.nameExcluded,
            ]}
          >
            {balance}
          </Text>
          {isActive && !isExcluded && (
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
        <Text style={accountStyles.title}>{title}</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={accountStyles.list}
        >
          {totalCount === 0 && (
            <Text style={accountStyles.empty}>
              No accounts added yet. Add accounts from the Accounts screen.
            </Text>
          )}

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
                  <Text style={accountStyles.cardEmoji}>{'💳'}</Text>,
                  () => onSelect({ kind: 'card', account }),
                ),
              ),
            )}

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

// ── AccountRow (inline selector button) ──────────────────────────────────────

interface AccountRowProps {
  label: string;
  account: SelectedAccount | null;
  onPress: () => void;
}

const AccountRow: React.FC<AccountRowProps> = ({ label, account, onPress }) => {
  const color = account ? getAccountColor(account) : Colors.textMuted;
  const name = account ? getAccountName(account) : 'Select Account';
  const sub = account ? getAccountSub(account) : 'Tap to choose';
  const balance = account ? getAccountBalance(account) : '';

  return (
    <TouchableOpacity
      style={styles.accountRow}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={[styles.accountIconCircle, { backgroundColor: color + '18' }]}
      >
        {account?.kind === 'cash' ? (
          <CashIcon size={22} color={color} />
        ) : (
          <BankIcon size={22} color={color} />
        )}
      </View>
      <View style={styles.accountTextGroup}>
        <Text style={styles.accountRowLabel}>{label}</Text>
        <Text style={styles.accountName}>{name}</Text>
        <Text style={styles.accountBalance}>{balance || sub}</Text>
      </View>
      <View style={styles.accountChevron}>
        <ChevronDownIcon size={18} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

// ── Shared overlay styles ─────────────────────────────────────────────────────

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

// ── Account picker styles ─────────────────────────────────────────────────────

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
  rowExcluded: {
    opacity: 0.4,
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
  nameExcluded: { color: Colors.textMuted },
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

// ── Warning banner ────────────────────────────────────────────────────────────

const warningStyles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    backgroundColor: '#FEF3C7',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#FCD34D',
    ...Shadow.sm,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
});

// ── TransferModal ─────────────────────────────────────────────────────────────

interface TransferModalProps {
  visible: boolean;
  onClose: () => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { state: accountsState, dispatch: acctDispatch } = useAccounts();
  const { dispatch: txDispatch } = useTransactions();

  const { bankAccounts, cardAccounts, investments, cashEntries } =
    accountsState;

  const totalAccountCount =
    bankAccounts.length +
    cardAccounts.length +
    investments.length +
    cashEntries.length;

  // Derive a sensible default for the first available account
  const firstAccount = useMemo<SelectedAccount | null>(() => {
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

  const secondAccount = useMemo<SelectedAccount | null>(() => {
    const firstId = firstAccount ? getAccountId(firstAccount) : null;
    if (cashEntries.length > 1) {
      const e = cashEntries.find(c => c.id !== firstId);
      if (e) {
        return { kind: 'cash', entry: e };
      }
    }
    if (bankAccounts.length > 0) {
      const a = bankAccounts.find(b => b.id !== firstId);
      if (a) {
        return { kind: 'bank', account: a };
      }
    }
    if (cardAccounts.length > 0) {
      const a = cardAccounts.find(c => c.id !== firstId);
      if (a) {
        return { kind: 'card', account: a };
      }
    }
    if (investments.length > 0) {
      const a = investments.find(i => i.id !== firstId);
      if (a) {
        return { kind: 'investment', account: a };
      }
    }
    return null;
  }, [firstAccount, cashEntries, bankAccounts, cardAccounts, investments]);

  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState<SelectedAccount | null>(null);
  const [toAccount, setToAccount] = useState<SelectedAccount | null>(null);
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [fromPickerVisible, setFromPickerVisible] = useState(false);
  const [toPickerVisible, setToPickerVisible] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setAmount('');
      setNote('');
      setSelectedDate(new Date());
      setFromAccount(firstAccount);
      setToAccount(secondAccount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleSwap = useCallback(() => {
    const temp = fromAccount;
    setFromAccount(toAccount);
    setToAccount(temp);
  }, [fromAccount, toAccount]);

  const applyBalanceDelta = useCallback(
    (acc: SelectedAccount, delta: number) => {
      if (acc.kind === 'bank') {
        acctDispatch({
          type: 'ADJUST_BANK_BALANCE',
          payload: { id: acc.account.id, delta },
        });
      } else if (acc.kind === 'cash') {
        acctDispatch({
          type: 'ADJUST_CASH_BALANCE',
          payload: { id: acc.entry.id, delta },
        });
      } else if (acc.kind === 'card') {
        // Transferring FROM a card increases its due amount (more owed)
        // Transferring TO a card reduces its due amount (paying it off)
        acctDispatch({
          type: 'ADJUST_CARD_BALANCE',
          payload: { id: acc.account.id, delta },
        });
      } else if (acc.kind === 'investment') {
        acctDispatch({
          type: 'ADJUST_INVESTMENT_BALANCE',
          payload: { id: acc.account.id, delta },
        });
      }
    },
    [acctDispatch],
  );

  const handleSave = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !fromAccount || !toAccount) {
      return;
    }

    const isoDate = selectedDate.toISOString().split('T')[0];
    const timeStr = formatDisplayTime(selectedDate);
    const now = Date.now();

    const fromName = getAccountName(fromAccount);
    const toName = getAccountName(toAccount);

    // Expense record on the FROM account
    txDispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: generateId(),
        title: 'Transfer Out',
        subtitle: `To ${toName}`,
        amount: -numAmount,
        type: 'transfer',
        category: 'transfer',
        account_id:
          fromAccount.kind === 'cash' ? undefined : fromAccount.account.id,
        account_type: getAccountType(fromAccount),
        date: isoDate,
        time: timeStr,
        note: note || undefined,
        created_at: now,
      },
    });

    // Income record on the TO account
    txDispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: generateId(),
        title: 'Transfer In',
        subtitle: `From ${fromName}`,
        amount: numAmount,
        type: 'transfer',
        category: 'transfer',
        account_id:
          toAccount.kind === 'cash' ? undefined : toAccount.account.id,
        account_type: getAccountType(toAccount),
        date: isoDate,
        time: timeStr,
        note: note || undefined,
        created_at: now + 1,
      },
    });

    // Adjust balances:
    // FROM account loses the amount (delta = -numAmount)
    // Exception: card FROM gets +numAmount (spending on card increases due)
    if (fromAccount.kind === 'card') {
      applyBalanceDelta(fromAccount, numAmount);
    } else {
      applyBalanceDelta(fromAccount, -numAmount);
    }

    // TO account gains the amount (delta = +numAmount)
    // Exception: card TO gets -numAmount (paying off card reduces due)
    if (toAccount.kind === 'card') {
      applyBalanceDelta(toAccount, -numAmount);
    } else {
      applyBalanceDelta(toAccount, numAmount);
    }

    setAmount('');
    setNote('');
    onClose();
  }, [
    amount,
    fromAccount,
    toAccount,
    note,
    selectedDate,
    txDispatch,
    applyBalanceDelta,
    onClose,
  ]);

  const handleClose = useCallback(() => {
    setAmount('');
    setNote('');
    onClose();
  }, [onClose]);

  const fromId = fromAccount ? getAccountId(fromAccount) : null;
  const toId = toAccount ? getAccountId(toAccount) : null;

  const canSave =
    !!fromAccount && !!toAccount && fromId !== toId && parseFloat(amount) > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={[styles.overlay, { paddingTop: insets.top }]}>
        <ModalHeader
          title="Transfer"
          onBack={handleClose}
          onSave={handleSave}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Not enough accounts warning */}
          {totalAccountCount < 2 && (
            <View style={warningStyles.container}>
              <Text style={warningStyles.text}>
                You need at least 2 accounts to make a transfer. Add more
                accounts from the Accounts screen.
              </Text>
            </View>
          )}

          {/* Amount */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Transfer Amount</Text>
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

          {/* From / Swap / To */}
          <View style={styles.transferFlow}>
            <AccountRow
              label="FROM"
              account={fromAccount}
              onPress={() => setFromPickerVisible(true)}
            />
            <View style={styles.accountRowDivider} />
            <View style={styles.arrowConnector}>
              <TouchableOpacity
                style={styles.arrowCircle}
                onPress={handleSwap}
                activeOpacity={0.8}
              >
                <Text style={styles.arrowText}>{'\u21C5'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.accountRowDivider} />
            <AccountRow
              label="TO"
              account={toAccount}
              onPress={() => setToPickerVisible(true)}
            />
          </View>

          {/* Same-account warning */}
          {fromId && toId && fromId === toId && (
            <View style={[warningStyles.container, { marginTop: Spacing.sm }]}>
              <Text style={warningStyles.text}>
                FROM and TO accounts must be different.
              </Text>
            </View>
          )}

          {/* Date */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.dateRow}
              activeOpacity={0.8}
              onPress={() => setDatePickerVisible(true)}
            >
              <CalendarIcon size={22} color={Colors.primary} />
              <View style={styles.dateTextGroup}>
                <Text style={styles.dateLabel}>Date & Time</Text>
                <Text style={styles.dateValue}>
                  {formatDisplayDate(selectedDate)}
                  {'   '}
                  <Text style={transferStyles.timeValue}>
                    {formatDisplayTime(selectedDate)}
                  </Text>
                </Text>
              </View>
              <ChevronDownIcon size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Note */}
          <View style={styles.section}>
            <View style={styles.noteRow}>
              <NoteIcon size={20} color={Colors.textMuted} />
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add note (optional)"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Submit */}
          <View style={styles.submitSection}>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                !canSave && transferStyles.submitDisabled,
              ]}
              onPress={canSave ? handleSave : undefined}
              activeOpacity={canSave ? 0.85 : 1}
            >
              <Text style={styles.submitBtnText}>Transfer Now</Text>
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

      {/* FROM account picker overlay */}
      <AccountPicker
        visible={fromPickerVisible}
        title="From Account"
        bankAccounts={bankAccounts}
        cardAccounts={cardAccounts}
        investments={investments}
        cashEntries={cashEntries}
        selected={fromAccount}
        excludeId={toId}
        onSelect={acc => {
          setFromAccount(acc);
          setFromPickerVisible(false);
        }}
        onClose={() => setFromPickerVisible(false)}
      />

      {/* TO account picker overlay */}
      <AccountPicker
        visible={toPickerVisible}
        title="To Account"
        bankAccounts={bankAccounts}
        cardAccounts={cardAccounts}
        investments={investments}
        cashEntries={cashEntries}
        selected={toAccount}
        excludeId={fromId}
        onSelect={acc => {
          setToAccount(acc);
          setToPickerVisible(false);
        }}
        onClose={() => setToPickerVisible(false)}
      />
    </Modal>
  );
};

const transferStyles = StyleSheet.create({
  timeValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  submitDisabled: {
    opacity: 0.45,
  },
});

export default TransferModal;
