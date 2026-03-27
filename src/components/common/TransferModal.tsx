import React, {useCallback, useState} from 'react';
import {
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {generateId} from '../../db/database';
import {
  BankIcon,
  CalendarIcon,
  ChevronDownIcon,
  NoteIcon,
} from '../../icons/Icons';
import {useAccounts} from '../../store/accountsStore';
import {useTransactions} from '../../store/transactionsStore';
import {Colors} from '../../theme/colors';
import {BankAccount} from '../../types';
import {getTodayLabel} from '../../utils/formatters';
import ModalHeader from '../ui/ModalHeader';
import {styles} from './TransferModal.styles';

interface TransferModalProps {
  visible: boolean;
  onClose: () => void;
}

const AccountSelector: React.FC<{
  label: string;
  account: BankAccount;
  onPress: () => void;
}> = ({label, account, onPress}) => (
  <TouchableOpacity
    style={styles.accountRow}
    onPress={onPress}
    activeOpacity={0.75}>
    <View
      style={[
        styles.accountIconCircle,
        {backgroundColor: `${account.color}18`},
      ]}>
      <BankIcon size={22} color={account.color} />
    </View>
    <View style={styles.accountTextGroup}>
      <Text style={styles.accountRowLabel}>{label}</Text>
      <Text style={styles.accountName}>{account.bankName}</Text>
      <Text style={styles.accountBalance}>
        {`\u20B9${account.balance.toLocaleString('en-IN', {
          maximumFractionDigits: 0,
        })}`}
      </Text>
    </View>
    <View style={styles.accountChevron}>
      <ChevronDownIcon size={18} color={Colors.textMuted} />
    </View>
  </TouchableOpacity>
);

const TransferModal: React.FC<TransferModalProps> = ({visible, onClose}) => {
  const insets = useSafeAreaInsets();
  const {state: accountsState, dispatch: acctDispatch} = useAccounts();
  const {dispatch: txDispatch} = useTransactions();

  const [amount, setAmount] = useState('');
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [note, setNote] = useState('');

  const bankAccounts = accountsState.bankAccounts;
  const fromAccount = bankAccounts[fromIndex % bankAccounts.length];
  const toAccount = bankAccounts[toIndex % bankAccounts.length];

  const handleSwap = useCallback(() => {
    setFromIndex(toIndex);
    setToIndex(fromIndex);
  }, [fromIndex, toIndex]);

  const handleSave = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !fromAccount || !toAccount) {
      return;
    }

    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Expense on FROM account
    txDispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: generateId(),
        title: 'Transfer Out',
        subtitle: `To ${toAccount.bankName}`,
        amount: -numAmount,
        type: 'expense',
        category: 'transfer',
        account_id: fromAccount.id,
        account_type: 'bank',
        date: today,
        time: timeStr,
        note: note || undefined,
        created_at: now,
      },
    });

    // Income on TO account
    txDispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: generateId(),
        title: 'Transfer In',
        subtitle: `From ${fromAccount.bankName}`,
        amount: numAmount,
        type: 'income',
        category: 'transfer',
        account_id: toAccount.id,
        account_type: 'bank',
        date: today,
        time: timeStr,
        note: note || undefined,
        created_at: now + 1,
      },
    });

    // Update account balances
    acctDispatch({
      type: 'UPDATE_BANK',
      payload: {...fromAccount, balance: fromAccount.balance - numAmount},
    });
    acctDispatch({
      type: 'UPDATE_BANK',
      payload: {...toAccount, balance: toAccount.balance + numAmount},
    });

    setAmount('');
    setNote('');
    onClose();
  }, [
    amount,
    fromAccount,
    toAccount,
    note,
    txDispatch,
    acctDispatch,
    onClose,
  ]);

  const handleClose = useCallback(() => {
    setAmount('');
    setNote('');
    onClose();
  }, [onClose]);

  if (bankAccounts.length < 2) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
      onRequestClose={handleClose}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <View style={[styles.overlay, {paddingTop: insets.top}]}>
        {/* Header */}
        <ModalHeader
          title="Transfer"
          onBack={handleClose}
          onSave={handleSave}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
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

          {/* From / Arrow / To */}
          <View style={styles.transferFlow}>
            <AccountSelector
              label="FROM"
              account={fromAccount}
              onPress={() =>
                setFromIndex((fromIndex + 1) % bankAccounts.length)
              }
            />
            <View style={styles.accountRowDivider} />
            {/* Swap arrow */}
            <View style={styles.arrowConnector}>
              <TouchableOpacity
                style={styles.arrowCircle}
                onPress={handleSwap}
                activeOpacity={0.8}>
                <Text style={styles.arrowText}>{'\u21C5'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.accountRowDivider} />
            <AccountSelector
              label="TO"
              account={toAccount}
              onPress={() => setToIndex((toIndex + 1) % bankAccounts.length)}
            />
          </View>

          {/* Date */}
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
              style={styles.submitBtn}
              onPress={handleSave}
              activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>Transfer Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TransferModal;
