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
import { AccountColor, Investment } from '../../types';
import { styles } from './AddInvestmentModal.styles';

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

const DEFAULT_COLOR: AccountColor = '#1E40AF';

const ICON_OPTIONS: { value: Investment['icon']; label: string }[] = [
  { value: 'trend', label: 'Trend' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'gold', label: 'Gold' },
  { value: 'other', label: 'Other' },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface AddInvestmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (inv: Omit<Investment, 'id'> & { id?: string }) => void;
  initial?: Investment;
}

// ── Component ─────────────────────────────────────────────────────────────────

const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({
  visible,
  onClose,
  onSave,
  initial,
}) => {
  const insets = useSafeAreaInsets();
  const isEditMode = Boolean(initial);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [icon, setIcon] = useState<Investment['icon']>('trend');
  const [color, setColor] = useState<AccountColor>(DEFAULT_COLOR);

  // Pre-fill fields when modal opens
  useEffect(() => {
    if (visible) {
      if (initial) {
        setName(initial.name);
        setAmount(String(initial.amount));
        setIcon(initial.icon);
        setColor((initial.color as AccountColor) ?? DEFAULT_COLOR);
      } else {
        setName('');
        setAmount('');
        setIcon('trend');
        setColor(DEFAULT_COLOR);
      }
    }
  }, [visible, initial]);

  const handleSave = useCallback(() => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Investment name is required.');
      return;
    }

    const parsedAmount = parseFloat(amount.trim());

    const payload: Omit<Investment, 'id'> & { id?: string } = {
      ...(initial?.id ? { id: initial.id } : {}),
      name: trimmedName,
      amount: isNaN(parsedAmount) ? 0 : parsedAmount,
      icon,
      color,
    };

    onSave(payload);
  }, [name, amount, icon, color, initial, onSave]);

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
              {isEditMode ? 'Edit Investment' : 'Add Investment'}
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
            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Mutual Funds"
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

            {/* Icon type */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Icon</Text>
              <View style={styles.pillRow}>
                {ICON_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.pill,
                      icon === option.value && styles.pillActive,
                    ]}
                    onPress={() => setIcon(option.value)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        icon === option.value && styles.pillTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
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

            {/* Save button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>
                {isEditMode ? 'Save Changes' : 'Add Investment'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddInvestmentModal;
