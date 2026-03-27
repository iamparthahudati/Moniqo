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
import { CashEntry } from '../../types';
import { styles } from './AddCashModal.styles';

// ── Props ─────────────────────────────────────────────────────────────────────

interface AddCashModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: Omit<CashEntry, 'id'> & { id?: string }) => void;
  initial?: CashEntry;
}

// ── Component ─────────────────────────────────────────────────────────────────

const AddCashModal: React.FC<AddCashModalProps> = ({
  visible,
  onClose,
  onSave,
  initial,
}) => {
  const insets = useSafeAreaInsets();
  const isEditMode = Boolean(initial);

  const [label, setLabel] = useState('');
  const [sublabel, setSublabel] = useState('');
  const [amount, setAmount] = useState('');

  // Pre-fill fields when modal opens in edit mode
  useEffect(() => {
    if (visible) {
      if (initial) {
        setLabel(initial.label);
        setSublabel(initial.sublabel);
        setAmount(String(initial.amount));
      } else {
        setLabel('');
        setSublabel('');
        setAmount('');
      }
    }
  }, [visible, initial]);

  const handleSave = useCallback(() => {
    const trimmedLabel = label.trim();

    if (!trimmedLabel) {
      Alert.alert('Validation Error', 'Label is required.');
      return;
    }

    const parsedAmount = parseFloat(amount.trim());

    const payload: Omit<CashEntry, 'id'> & { id?: string } = {
      ...(initial?.id ? { id: initial.id } : {}),
      label: trimmedLabel,
      sublabel: sublabel.trim(),
      amount: isNaN(parsedAmount) ? 0 : parsedAmount,
    };

    onSave(payload);
  }, [label, sublabel, amount, initial, onSave]);

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
              {isEditMode ? 'Edit Cash Entry' : 'Add Cash Entry'}
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
            {/* Label */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Label</Text>
              <TextInput
                style={styles.textInput}
                value={label}
                onChangeText={setLabel}
                placeholder="e.g. Cash in Hand"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="next"
                autoCorrect={false}
              />
            </View>

            {/* Sublabel */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Sublabel</Text>
              <TextInput
                style={styles.textInput}
                value={sublabel}
                onChangeText={setSublabel}
                placeholder="e.g. ESTIMATED"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="next"
                autoCorrect={false}
              />
            </View>

            {/* Amount */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Amount</Text>
              <TextInput
                style={styles.textInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>

            {/* Save button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>
                {isEditMode ? 'Save Changes' : 'Add Cash Entry'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddCashModal;
