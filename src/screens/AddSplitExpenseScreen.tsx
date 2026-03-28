import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ModalHeader from '../components/ui/ModalHeader';
import { CalendarIcon, NoteIcon } from '../icons/Icons';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { styles } from './AddSplitExpenseScreen.styles';

// ── Types ──────────────────────────────────────────────────────────────────────

interface SplitMember {
  name: string;
  color: string;
  selected: boolean;
}

type SplitType = 'Equal' | 'Exact' | 'Percentage';

// ── Mock data ──────────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: SplitMember[] = [
  { name: 'You', color: '#2B3FE8', selected: true },
  { name: 'Rahul', color: '#22C55E', selected: true },
  { name: 'Priya', color: '#EC4899', selected: true },
  { name: 'Ankit', color: '#F97316', selected: true },
];

const SPLIT_TYPES: SplitType[] = ['Equal', 'Exact', 'Percentage'];

const MOCK_DATE = 'Mar 28, 2026';

// ── Helpers ────────────────────────────────────────────────────────────────────

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function formatShare(total: number, count: number): string {
  if (count === 0) {
    return '\u20B90';
  }
  const share = total / count;
  return '\u20B9' + share.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface AddSplitExpenseScreenProps {
  visible: boolean;
  onClose: () => void;
}

// ── Main component ─────────────────────────────────────────────────────────────

const AddSplitExpenseScreen: React.FC<AddSplitExpenseScreenProps> = ({
  visible,
  onClose,
}) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [paidByIndex, setPaidByIndex] = useState(0);
  const [members, setMembers] = useState<SplitMember[]>(INITIAL_MEMBERS);
  const [splitType, setSplitType] = useState<SplitType>('Equal');

  const selectedCount = members.filter(m => m.selected).length;
  const numericAmount = parseFloat(amount) || 0;

  const handleToggleMember = (index: number) => {
    setMembers(prev =>
      prev.map((m, i) => (i === index ? { ...m, selected: !m.selected } : m)),
    );
  };

  const handleCyclePaidBy = () => {
    setPaidByIndex(prev => (prev + 1) % INITIAL_MEMBERS.length);
  };

  const handleDatePress = () => {
    Alert.alert('Date picker coming soon');
  };

  const handleSave = () => {
    if (!amount || numericAmount <= 0) {
      Alert.alert('Enter an amount to continue');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Enter a title for this expense');
      return;
    }
    if (selectedCount === 0) {
      Alert.alert('Select at least one member to split with');
      return;
    }
    Alert.alert('Expense Added', 'Split expense saved successfully');
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    setTitle('');
    setPaidByIndex(0);
    setMembers(INITIAL_MEMBERS);
    setSplitType('Equal');
    onClose();
  };

  const paidByMember = INITIAL_MEMBERS[paidByIndex];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={styles.root}>
        <ModalHeader
          title="Add Expense"
          onBack={handleClose}
          onSave={handleSave}
          saveLabel="Add"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Amount ── */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>{'Total Amount'}</Text>
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

          {/* ── Title / Note ── */}
          <View style={styles.section}>
            <View style={styles.inputRow}>
              <NoteIcon size={20} color={Colors.textMuted} />
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="What was it for?"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* ── Paid by ── */}
          <View style={[styles.section, { marginTop: Spacing.base }]}>
            <Text style={styles.sectionTitle}>{'Paid by'}</Text>
            <TouchableOpacity
              style={styles.paidByRow}
              onPress={handleCyclePaidBy}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.paidByAvatar,
                  { backgroundColor: paidByMember.color },
                ]}
              >
                <Text style={styles.paidByAvatarText}>
                  {getInitial(paidByMember.name)}
                </Text>
              </View>
              <View style={styles.paidByInfo}>
                <Text style={styles.paidByLabel}>{'Tap to change'}</Text>
                <Text style={styles.paidByName}>{paidByMember.name}</Text>
              </View>
              <Text style={styles.paidByChevron}>{'\u203A'}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Split type ── */}
          <View style={[styles.section, { marginTop: Spacing.base }]}>
            <Text style={styles.sectionTitle}>{'Split type'}</Text>
            <View style={styles.splitTypeRow}>
              {SPLIT_TYPES.map(type => {
                const isActive = splitType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.splitTypePill,
                      isActive && styles.splitTypePillActive,
                    ]}
                    onPress={() => setSplitType(type)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.splitTypePillText,
                        isActive && styles.splitTypePillTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Split between ── */}
          <View style={[styles.section, { marginTop: Spacing.base }]}>
            <Text style={styles.sectionTitle}>{'Split between'}</Text>
            {members.map((member, index) => {
              const shareLabel = member.selected
                ? formatShare(numericAmount, selectedCount)
                : '\u20B90';
              return (
                <View key={member.name} style={styles.splitMemberRow}>
                  <View
                    style={[
                      styles.splitMemberAvatar,
                      { backgroundColor: member.color },
                    ]}
                  >
                    <Text style={styles.splitMemberAvatarText}>
                      {getInitial(member.name)}
                    </Text>
                  </View>
                  <Text style={styles.splitMemberName}>{member.name}</Text>
                  <Text style={styles.splitMemberAmount}>{shareLabel}</Text>
                  <TouchableOpacity
                    style={[
                      styles.checkCircle,
                      member.selected
                        ? styles.checkCircleActive
                        : styles.checkCircleInactive,
                    ]}
                    onPress={() => handleToggleMember(index)}
                    activeOpacity={0.75}
                  >
                    {member.selected && (
                      <Text style={styles.checkMark}>{'\u2713'}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* ── Date ── */}
          <View style={[styles.section, { marginTop: Spacing.base }]}>
            <Text style={styles.sectionTitle}>{'Date'}</Text>
            <TouchableOpacity
              style={styles.dateRow}
              onPress={handleDatePress}
              activeOpacity={0.8}
            >
              <CalendarIcon size={22} color={Colors.primary} />
              <View style={styles.dateTextGroup}>
                <Text style={styles.dateLabel}>{'Selected'}</Text>
                <Text style={styles.dateValue}>{MOCK_DATE}</Text>
              </View>
              <Text style={styles.paidByChevron}>{'\u203A'}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Submit ── */}
          <View style={styles.submitSection}>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>{'Add Expense'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default AddSplitExpenseScreen;
