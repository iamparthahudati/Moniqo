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
import { BANK_ACCOUNTS } from '../../data/mockData';
import {
  BackIcon,
  BankIcon,
  CalendarIcon,
  ChevronDownIcon,
  NoteIcon,
} from '../../icons/Icons';
import { Colors } from '../../theme/colors';
import { BankAccount } from '../../types';
import { styles } from './TransferModal.styles';

const getTodayLabel = (): string => {
  const now = new Date();
  return `Today, ${now.getDate()} ${now.toLocaleString('default', {
    month: 'short',
  })}`;
};

interface TransferModalProps {
  visible: boolean;
  onClose: () => void;
}

const AccountSelector: React.FC<{
  label: string;
  account: BankAccount;
  onPress: () => void;
}> = ({ label, account, onPress }) => (
  <TouchableOpacity
    style={styles.accountRow}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <View
      style={[
        styles.accountIconCircle,
        { backgroundColor: `${account.color}18` },
      ]}
    >
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

const TransferModal: React.FC<TransferModalProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();

  const [amount, setAmount] = useState('');
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [note, setNote] = useState('');

  const fromAccount = BANK_ACCOUNTS[fromIndex % BANK_ACCOUNTS.length];
  const toAccount = BANK_ACCOUNTS[toIndex % BANK_ACCOUNTS.length];

  const handleSwap = () => {
    setFromIndex(toIndex);
    setToIndex(fromIndex);
  };

  const handleSave = () => {
    setAmount('');
    setNote('');
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    setNote('');
    onClose();
  };

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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBack}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <BackIcon size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transfer</Text>
          <TouchableOpacity onPress={handleSave} activeOpacity={0.7}>
            <Text style={styles.headerSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Amount */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Transfer Amount</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currencySymbol}>{`\u20B9`}</Text>
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
                setFromIndex((fromIndex + 1) % BANK_ACCOUNTS.length)
              }
            />
            <View style={styles.accountRowDivider} />
            {/* Swap arrow */}
            <View style={styles.arrowConnector}>
              <TouchableOpacity
                style={styles.arrowCircle}
                onPress={handleSwap}
                activeOpacity={0.8}
              >
                <Text style={styles.arrowText}>{`\u21C5`}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.accountRowDivider} />
            <AccountSelector
              label="TO"
              account={toAccount}
              onPress={() => setToIndex((toIndex + 1) % BANK_ACCOUNTS.length)}
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
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>Transfer Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TransferModal;
