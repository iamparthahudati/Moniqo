import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { AccountColor, BankAccount } from '../../types';
import { styles } from './AddBankModal.styles';

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCOUNT_COLORS: AccountColor[] = [
  '#003087',
  '#F97316',
  '#1E40AF',
  '#22C55E',
  '#EF4444',
  '#8B5CF6',
  '#0F172A',
  '#F59E0B',
];

const DEFAULT_COLOR: AccountColor = '#003087';

// ── Props ─────────────────────────────────────────────────────────────────────

interface AddBankModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (account: Omit<BankAccount, 'id'> & { id?: string }) => void;
  initial?: BankAccount;
}

// ── Component ─────────────────────────────────────────────────────────────────

const AddBankModal: React.FC<AddBankModalProps> = ({
  visible,
  onClose,
  onSave,
  initial,
}) => {
  const insets = useSafeAreaInsets();
  const isEditMode = Boolean(initial);

  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [balance, setBalance] = useState('');
  const [icon, setIcon] = useState<BankAccount['icon']>('bank');
  const [color, setColor] = useState<AccountColor>(DEFAULT_COLOR);
  const [status, setStatus] = useState<BankAccount['status']>('ACTIVE');

  // Pre-fill fields when modal opens in edit mode
  useEffect(() => {
    if (visible) {
      if (initial) {
        setBankName(initial.bankName);
        setAccountType(initial.accountType);
        setBalance(String(initial.balance));
        setIcon(initial.icon);
        setColor((initial.color as AccountColor) ?? DEFAULT_COLOR);
        setStatus(initial.status);
      } else {
        setBankName('');
        setAccountType('');
        setBalance('');
        setIcon('bank');
        setColor(DEFAULT_COLOR);
        setStatus('ACTIVE');
      }
    }
  }, [visible, initial]);

  const handleSave = useCallback(() => {
    const trimmedName = bankName.trim();
    const trimmedBalance = balance.trim();

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Bank name is required.');
      return;
    }
    if (!trimmedBalance || isNaN(Number(trimmedBalance))) {
      Alert.alert('Validation Error', 'A valid balance is required.');
      return;
    }

    const payload: Omit<BankAccount, 'id'> & { id?: string } = {
      ...(initial?.id ? { id: initial.id } : {}),
      bankName: trimmedName,
      accountType: accountType.trim(),
      balance: parseFloat(trimmedBalance),
      icon,
      color,
      status,
      created_at: initial?.created_at ?? Date.now(),
    };

    onSave(payload);
  }, [bankName, balance, accountType, icon, color, status, initial, onSave]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* ── Drag handle ── */}
          <View style={styles.handleBar} />

          {/* ── Title row ── */}
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>
              {isEditMode ? 'Edit Bank Account' : 'Add Bank Account'}
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.closeBtnText}>x</Text>
            </TouchableOpacity>
          </View>

          {/* ── Form ── */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + Spacing.xl },
            ]}
          >
            {/* Bank Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Bank Name</Text>
              <TextInput
                style={styles.textInput}
                value={bankName}
                onChangeText={setBankName}
                placeholder="e.g. HDFC Bank"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="next"
                autoCorrect={false}
              />
            </View>

            {/* Account Type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Account Type</Text>
              <TextInput
                style={styles.textInput}
                value={accountType}
                onChangeText={setAccountType}
                placeholder="e.g. Savings Account"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="next"
                autoCorrect={false}
              />
            </View>

            {/* Balance */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Balance</Text>
              <TextInput
                style={styles.textInput}
                value={balance}
                onChangeText={setBalance}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>

            {/* Icon type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Icon</Text>
              <View style={styles.pillRow}>
                <TouchableOpacity
                  style={[styles.pill, icon === 'bank' && styles.pillActive]}
                  onPress={() => setIcon('bank')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      icon === 'bank' && styles.pillTextActive,
                    ]}
                  >
                    Bank
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pill, icon === 'piggy' && styles.pillActive]}
                  onPress={() => setIcon('piggy')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      icon === 'piggy' && styles.pillTextActive,
                    ]}
                  >
                    Piggy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Color picker */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Color</Text>
              <View style={styles.swatchRow}>
                {ACCOUNT_COLORS.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.swatch, { backgroundColor: c }]}
                    onPress={() => setColor(c)}
                    activeOpacity={0.8}
                  >
                    {color === c && (
                      <Text style={styles.swatchCheck}>&#10003;</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.pillRow}>
                <TouchableOpacity
                  style={[
                    styles.pill,
                    status === 'ACTIVE' && styles.pillActive,
                  ]}
                  onPress={() => setStatus('ACTIVE')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      status === 'ACTIVE' && styles.pillTextActive,
                    ]}
                  >
                    ACTIVE
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pill,
                    status === 'INACTIVE' && styles.pillActive,
                  ]}
                  onPress={() => setStatus('INACTIVE')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      status === 'INACTIVE' && styles.pillTextActive,
                    ]}
                  >
                    INACTIVE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Save button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>
                {isEditMode ? 'Save Changes' : 'Add Account'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddBankModal;
