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
import { useAccounts } from '../../store/accountsStore';
import { useCategories } from '../../store/categoriesStore';
import { useTransactions } from '../../store/transactionsStore';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';
import { Transaction } from '../../types';
import ModalHeader from '../ui/ModalHeader';

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

type PickerTab = 'date' | 'time';

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

function getDaysInMonth(month: number, yearIdx: number): string[] {
  const y = parseInt(YEARS[yearIdx], 10);
  const count = new Date(y, month + 1, 0).getDate();
  return Array.from({ length: count }, (_, i) => (i + 1).toString());
}

function parseDateFromTransaction(isoDate: string, timeStr: string): Date {
  try {
    const [year, month, day] = isoDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    // Parse time string like "02:30 PM"
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && h !== 12) {
        h += 12;
      }
      if (ampm === 'AM' && h === 12) {
        h = 0;
      }
      d.setHours(h, m, 0, 0);
    }
    return d;
  } catch {
    return new Date();
  }
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
    <View style={[pickerStyles.column, { width }]}>
      <View style={pickerStyles.highlight} pointerEvents="none" />
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
              style={pickerStyles.wheelItem}
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
                  pickerStyles.wheelText,
                  isSelected && pickerStyles.wheelTextSelected,
                  item === '' && pickerStyles.wheelTextHidden,
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
    <View style={pickerStyles.overlay}>
      <TouchableOpacity
        style={pickerStyles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={[pickerStyles.sheet, { paddingBottom: insets.bottom + 12 }]}>
        <View style={pickerStyles.handle} />
        <View style={pickerStyles.tabs}>
          {(['date', 'time'] as PickerTab[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[pickerStyles.tab, tab === t && pickerStyles.tabActive]}
              onPress={() => setTab(t)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  pickerStyles.tabText,
                  tab === t && pickerStyles.tabTextActive,
                ]}
              >
                {t === 'date' ? 'Date' : 'Time'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={pickerStyles.wheelsRow}>
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
              <Text style={pickerStyles.colon}>:</Text>
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
          style={pickerStyles.confirmBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Text style={pickerStyles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── CategoryChip ──────────────────────────────────────────────────────────────

interface CategoryChipProps {
  category: AppCategory;
  isActive: boolean;
  onPress: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = React.memo(
  ({ category, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        chipStyles.chip,
        isActive && {
          backgroundColor: category.color,
          borderColor: category.color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={chipStyles.emoji}>{category.emoji}</Text>
      <Text style={[chipStyles.label, isActive && chipStyles.labelActive]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  ),
);

// ── Type badge ────────────────────────────────────────────────────────────────

function getTypeBadgeColor(type: Transaction['type']): string {
  if (type === 'income') {
    return Colors.incomeGreen;
  }
  if (type === 'expense') {
    return Colors.expenseRed;
  }
  return Colors.primary;
}

function getTypeLabel(type: Transaction['type']): string {
  if (type === 'income') {
    return 'Income';
  }
  if (type === 'expense') {
    return 'Expense';
  }
  return 'Transfer';
}

// ── Main component ────────────────────────────────────────────────────────────

interface EditTransactionModalProps {
  visible: boolean;
  transaction: Transaction;
  onClose: () => void;
  onDelete: (t: Transaction) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  visible,
  transaction,
  onClose,
  onDelete,
}) => {
  const insets = useSafeAreaInsets();
  const { dispatch: txDispatch } = useTransactions();
  const { dispatch: acctDispatch } = useAccounts();
  const { expenseCategories, incomeCategories } = useCategories();

  const initialDate = useMemo(
    () => parseDateFromTransaction(transaction.date, transaction.time),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transaction.id],
  );

  const [amount, setAmount] = useState(Math.abs(transaction.amount).toString());
  const [note, setNote] = useState(transaction.note ?? '');
  const [selectedCategory, setSelectedCategory] = useState(
    transaction.category,
  );
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Reset form when transaction changes
  useEffect(() => {
    if (visible) {
      setAmount(Math.abs(transaction.amount).toString());
      setNote(transaction.note ?? '');
      setSelectedCategory(transaction.category);
      setSelectedDate(
        parseDateFromTransaction(transaction.date, transaction.time),
      );
    }
  }, [visible, transaction]);

  const relevantCategories = useMemo(() => {
    if (transaction.type === 'expense') {
      return expenseCategories;
    }
    if (transaction.type === 'income') {
      return incomeCategories;
    }
    return [];
  }, [transaction.type, expenseCategories, incomeCategories]);

  const handleSave = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      return;
    }

    const isoDate = selectedDate.toISOString().split('T')[0];
    const timeStr = formatDisplayTime(selectedDate);

    // Compute final stored amount (negative for expense, positive for income/transfer)
    let newFinalAmount: number;
    if (transaction.type === 'expense') {
      newFinalAmount = -numAmount;
    } else {
      newFinalAmount = numAmount;
    }

    const allCats = [...expenseCategories, ...incomeCategories];
    const catObj = allCats.find(c => c.id === selectedCategory);
    const title = catObj?.name ?? transaction.title;

    const updated: Transaction = {
      ...transaction,
      title,
      subtitle: note || title,
      amount: newFinalAmount,
      category: selectedCategory,
      date: isoDate,
      time: timeStr,
      note: note || undefined,
    };

    txDispatch({ type: 'UPDATE_TRANSACTION', payload: updated });

    // Adjust account balance for non-transfer transactions
    if (
      transaction.type !== 'transfer' &&
      transaction.account_id &&
      transaction.account_type
    ) {
      const delta = newFinalAmount - transaction.amount;
      if (delta !== 0) {
        if (transaction.account_type === 'bank') {
          acctDispatch({
            type: 'ADJUST_BANK_BALANCE',
            payload: { id: transaction.account_id, delta },
          });
        } else if (transaction.account_type === 'cash') {
          acctDispatch({
            type: 'ADJUST_CASH_BALANCE',
            payload: { id: transaction.account_id, delta },
          });
        } else if (transaction.account_type === 'card') {
          acctDispatch({
            type: 'ADJUST_CARD_BALANCE',
            payload: { id: transaction.account_id, delta },
          });
        } else if (transaction.account_type === 'investment') {
          acctDispatch({
            type: 'ADJUST_INVESTMENT_BALANCE',
            payload: { id: transaction.account_id, delta },
          });
        }
      }
    }

    onClose();
  }, [
    amount,
    note,
    selectedCategory,
    selectedDate,
    transaction,
    expenseCategories,
    incomeCategories,
    txDispatch,
    acctDispatch,
    onClose,
  ]);

  const typeBadgeColor = getTypeBadgeColor(transaction.type);
  const typeLabel = getTypeLabel(transaction.type);
  const isTransfer = transaction.type === 'transfer';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      statusBarTranslucent={false}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={[modalStyles.root, { paddingTop: insets.top }]}>
        <ModalHeader
          title="Edit Transaction"
          onBack={onClose}
          onSave={handleSave}
          saveLabel="Save"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={modalStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Type badge (read-only) ── */}
          <View style={modalStyles.typeBadgeRow}>
            <View
              style={[
                modalStyles.typeBadge,
                {
                  backgroundColor: typeBadgeColor + '1A',
                  borderColor: typeBadgeColor + '40',
                },
              ]}
            >
              <Text
                style={[modalStyles.typeBadgeText, { color: typeBadgeColor }]}
              >
                {typeLabel}
              </Text>
            </View>
          </View>

          {/* ── Amount ── */}
          <View style={modalStyles.amountSection}>
            <Text style={modalStyles.amountLabel}>AMOUNT</Text>
            <View style={modalStyles.amountRow}>
              <Text style={modalStyles.currencySymbol}>{'\u20B9'}</Text>
              <TextInput
                style={modalStyles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          {/* ── Category (hidden for transfer) ── */}
          {!isTransfer && relevantCategories.length > 0 && (
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={modalStyles.categoryScroll}
                keyboardShouldPersistTaps="handled"
              >
                {relevantCategories.map(cat => (
                  <CategoryChip
                    key={cat.id}
                    category={cat}
                    isActive={selectedCategory === cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Date & Time ── */}
          <View style={modalStyles.section}>
            <Text style={modalStyles.sectionTitle}>Date & Time</Text>
            <TouchableOpacity
              style={modalStyles.fieldRow}
              activeOpacity={0.8}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={modalStyles.fieldIcon}>{'\uD83D\uDCC5'}</Text>
              <View style={modalStyles.fieldTextGroup}>
                <Text style={modalStyles.fieldLabel}>SELECTED</Text>
                <Text style={modalStyles.fieldValue}>
                  {formatDisplayDate(selectedDate)}
                  {'   '}
                  <Text style={modalStyles.fieldValueSub}>
                    {formatDisplayTime(selectedDate)}
                  </Text>
                </Text>
              </View>
              <Text style={modalStyles.chevron}>{'\u203A'}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Note ── */}
          <View style={modalStyles.section}>
            <Text style={modalStyles.sectionTitle}>Note</Text>
            <View style={modalStyles.noteRow}>
              <Text style={modalStyles.fieldIcon}>{'\uD83D\uDCDD'}</Text>
              <TextInput
                style={modalStyles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add note (optional)"
                placeholderTextColor={Colors.textMuted}
                multiline={false}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* ── Transfer notice ── */}
          {isTransfer && (
            <View style={modalStyles.section}>
              <View style={modalStyles.transferNotice}>
                <Text style={modalStyles.transferNoticeText}>
                  Balance adjustment is not available for transfer transactions.
                  Only the record will be updated.
                </Text>
              </View>
            </View>
          )}

          {/* ── Delete button ── */}
          <View style={modalStyles.deleteSection}>
            <TouchableOpacity
              style={modalStyles.deleteBtn}
              onPress={() => onDelete(transaction)}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.deleteBtnText}>Delete Transaction</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
      </View>
    </Modal>
  );
};

export default EditTransactionModal;

// ── Styles ────────────────────────────────────────────────────────────────────

const modalStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 48,
  },

  // Type badge
  typeBadgeRow: {
    alignItems: 'center',
    paddingVertical: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  typeBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  typeBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Amount
  amountSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 8,
  },
  amountInput: {
    fontSize: 52,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -2,
    minWidth: 80,
    padding: 0,
    includeFontPadding: false,
  },

  // Section
  section: {
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  // Category chips
  categoryScroll: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingBottom: Spacing.xs,
  },

  // Field row (date)
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldIcon: {
    fontSize: 20,
  },
  fieldTextGroup: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  fieldValueSub: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  chevron: {
    fontSize: 20,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // Note row
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  noteInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
    includeFontPadding: false,
  },

  // Transfer notice
  transferNotice: {
    backgroundColor: Colors.primary + '0D',
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  transferNoticeText: {
    fontSize: 13,
    color: Colors.primary,
    lineHeight: 20,
  },

  // Delete
  deleteSection: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },
  deleteBtn: {
    backgroundColor: Colors.expenseRed + '12',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base + 2,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.expenseRed + '40',
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.expenseRed,
  },
});

const pickerStyles = StyleSheet.create({
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
    backgroundColor: Colors.primary + '14',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.primary + '35',
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

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.white,
  },
});
