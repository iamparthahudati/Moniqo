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
import { AccountColor, CardAccount } from '../../types';
import { styles } from './AddCardModal.styles';

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

const DEFAULT_COLOR: AccountColor = '#F97316';

// ── Props ─────────────────────────────────────────────────────────────────────

interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (card: Omit<CardAccount, 'id'> & { id?: string }) => void;
  initial?: CardAccount;
}

// ── Component ─────────────────────────────────────────────────────────────────

const AddCardModal: React.FC<AddCardModalProps> = ({
  visible,
  onClose,
  onSave,
  initial,
}) => {
  const insets = useSafeAreaInsets();
  const isEditMode = Boolean(initial);

  const [cardName, setCardName] = useState('');
  const [cardType, setCardType] = useState('');
  const [dueAmount, setDueAmount] = useState('');
  const [dueLabel, setDueLabel] = useState('');
  const [color, setColor] = useState<AccountColor>(DEFAULT_COLOR);

  // Pre-fill fields when modal opens
  useEffect(() => {
    if (visible) {
      if (initial) {
        setCardName(initial.cardName);
        setCardType(initial.cardType);
        setDueAmount(String(initial.dueAmount));
        setDueLabel(initial.dueLabel);
        setColor((initial.color as AccountColor) ?? DEFAULT_COLOR);
      } else {
        setCardName('');
        setCardType('');
        setDueAmount('');
        setDueLabel('');
        setColor(DEFAULT_COLOR);
      }
    }
  }, [visible, initial]);

  const handleSave = useCallback(() => {
    const trimmedName = cardName.trim();

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Card name is required.');
      return;
    }

    const parsedAmount = parseFloat(dueAmount.trim());

    const payload: Omit<CardAccount, 'id'> & { id?: string } = {
      ...(initial?.id ? { id: initial.id } : {}),
      cardName: trimmedName,
      cardType: cardType.trim(),
      dueAmount: isNaN(parsedAmount) ? 0 : parsedAmount,
      dueLabel: dueLabel.trim(),
          created_at: Date.now(),
      color,
    };

    onSave(payload);
  }, [cardName, cardType, dueAmount, dueLabel, color, initial, onSave]);

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
              {isEditMode ? 'Edit Credit Card' : 'Add Credit Card'}
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
            {/* Card Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Card Name</Text>
              <TextInput
                style={styles.textInput}
                value={cardName}
                onChangeText={setCardName}
                placeholder="e.g. ICICI Credit Card"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="next"
                autoCorrect={false}
              />
            </View>

            {/* Card Type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Card Type</Text>
              <TextInput
                style={styles.textInput}
                value={cardType}
                onChangeText={setCardType}
                placeholder="e.g. Platinum Rewards"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="next"
                autoCorrect={false}
              />
            </View>

            {/* Due Amount */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Due Amount</Text>
              <TextInput
                style={styles.textInput}
                value={dueAmount}
                onChangeText={setDueAmount}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>

            {/* Due Label */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Due Label</Text>
              <TextInput
                style={styles.textInput}
                value={dueLabel}
                onChangeText={setDueLabel}
                placeholder="e.g. DUE IN 5 DAYS"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="done"
                autoCorrect={false}
                autoCapitalize="characters"
              />
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

            {/* Save button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>
                {isEditMode ? 'Save Changes' : 'Add Card'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddCardModal;
