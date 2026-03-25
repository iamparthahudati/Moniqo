import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BackIcon,
  BankIcon,
  CalendarIcon,
  CashIcon,
  ChevronDownIcon,
  NoteIcon,
} from '../../icons/Icons';
import { Colors } from '../../theme/colors';
import { styles } from './AddTransactionModal.styles';

// ── Types ─────────────────────────────────────────────────────────────────────

type TransactionType = 'expense' | 'income';
type PaymentMethod = 'cash' | 'bank';

interface Category {
  id: string;
  label: string;
  emoji: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { id: 'food', label: 'FOOD', emoji: '\uD83C\uDF74' },
  { id: 'shopping', label: 'SHOPPING', emoji: '\uD83D\uDED2' },
  { id: 'transport', label: 'TRANSPORT', emoji: '\uD83D\uDE97' },
  { id: 'bills', label: 'BILLS', emoji: '\uD83E\uDDFE' },
  { id: 'fun', label: 'FUN', emoji: '\uD83C\uDFAB' },
  { id: 'others', label: 'OTHERS', emoji: '\u2022\u2022\u2022' },
];

const getTodayLabel = (): string => {
  const now = new Date();
  return `Today, ${now.getDate()} ${now.toLocaleString('default', {
    month: 'short',
  })}`;
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface CategoryItemProps {
  category: Category;
  isActive: boolean;
  onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isActive,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.categoryItem, isActive && styles.categoryItemActive]}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <View
      style={[
        styles.categoryIconCircle,
        isActive && styles.categoryIconCircleActive,
      ]}
    >
      <Text style={{ fontSize: 22 }}>{category.emoji}</Text>
    </View>
    <Text
      style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}
    >
      {category.label}
    </Text>
  </TouchableOpacity>
);

// ── Main component ────────────────────────────────────────────────────────────

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  const [txType, setTxType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [note, setNote] = useState('');

  const handleSave = () => {
    // Future: persist transaction
    onClose();
  };

  const handleClose = () => {
    // Reset state on close
    setTxType('expense');
    setAmount('');
    setSelectedCategory('food');
    setPaymentMethod('cash');
    setNote('');
    onClose();
  };

  const isExpense = txType === 'expense';

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
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBack}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <BackIcon size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Transaction</Text>
          <TouchableOpacity onPress={handleSave} activeOpacity={0.7}>
            <Text style={styles.headerSave}>Save</Text>
          </TouchableOpacity>
        </View>

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
                onPress={() => setTxType('expense')}
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
                onPress={() => setTxType('income')}
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Select Category</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <CategoryItem
                  key={cat.id}
                  category={cat}
                  isActive={selectedCategory === cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                />
              ))}
            </View>
          </View>

          {/* ── Payment method ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={[styles.paymentRow, { marginTop: 12 }]}>
              <TouchableOpacity
                style={[
                  styles.paymentBtn,
                  paymentMethod === 'cash' && styles.paymentBtnActive,
                ]}
                onPress={() => setPaymentMethod('cash')}
                activeOpacity={0.8}
              >
                <CashIcon
                  size={20}
                  color={
                    paymentMethod === 'cash'
                      ? Colors.white
                      : Colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.paymentBtnText,
                    paymentMethod === 'cash' && styles.paymentBtnTextActive,
                  ]}
                >
                  Cash
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentBtn,
                  paymentMethod === 'bank' && styles.paymentBtnActive,
                ]}
                onPress={() => setPaymentMethod('bank')}
                activeOpacity={0.8}
              >
                <BankIcon
                  size={20}
                  color={
                    paymentMethod === 'bank'
                      ? Colors.white
                      : Colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.paymentBtnText,
                    paymentMethod === 'bank' && styles.paymentBtnTextActive,
                  ]}
                >
                  Bank Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Date ── */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.dateRow} activeOpacity={0.8}>
              <CalendarIcon size={22} color={Colors.primary} />
              <View style={styles.dateTextGroup}>
                <Text style={styles.dateLabel}>Date</Text>
                <Text style={styles.dateValue}>{getTodayLabel()}</Text>
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
    </Modal>
  );
};

export default AddTransactionModal;
