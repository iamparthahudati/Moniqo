import React, { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { AppCategory } from '../../db/repositories/categoryRepository';
import { useCategories } from '../../store/categoriesStore';
import { Colors } from '../../theme/colors';
import IconCircle from '../ui/IconCircle';
import TabSwitcher from '../ui/TabSwitcher';
import { styles } from './CategoryManager.styles';

type CategoryType = 'expense' | 'income';

const COLORS = [
  '#EF4444',
  '#3B82F6',
  '#F97316',
  '#8B5CF6',
  '#14B8A6',
  '#EC4899',
  '#F59E0B',
  '#94A3B8',
  '#22C55E',
  '#6366F1',
];

const EMOJI_OPTIONS = [
  '\uD83C\uDF74',
  '\uD83D\uDED2',
  '\uD83D\uDE97',
  '\uD83E\uDDFE',
  '\uD83C\uDFAB',
  '\uD83C\uDFE5',
  '\uD83D\uDCDA',
  '\uD83D\uDCCB',
  '\uD83D\uDCB0',
  '\uD83D\uDCBB',
  '\uD83D\uDCC8',
  '\uD83C\uDF81',
  '\uD83C\uDFE0',
  '\u2708\uFE0F',
  '\uD83D\uDCF1',
  '\u26BD',
  '\uD83D\uDC36',
  '\uD83C\uDF3F',
  '\u2615',
  '\uD83D\uDEE0\uFE0F',
];

const CategoryManager: React.FC = () => {
  const { expenseCategories, incomeCategories, addCategory, deleteCategory } =
    useCategories();

  const [activeTab, setActiveTab] = useState<CategoryType>('expense');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<CategoryType>('expense');
  const [newName, setNewName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);

  const categories =
    activeTab === 'expense' ? expenseCategories : incomeCategories;

  const handleDelete = useCallback(
    (cat: AppCategory) => {
      if (cat.isDefault) {
        Alert.alert('Cannot Delete', 'Default categories cannot be removed.');
        return;
      }
      Alert.alert('Delete Category', `Remove "${cat.name}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCategory(cat.id),
        },
      ]);
    },
    [deleteCategory],
  );

  const handleAdd = useCallback(() => {
    if (!newName.trim()) {
      Alert.alert('Name required', 'Please enter a category name.');
      return;
    }
    const emojiIndex = EMOJI_OPTIONS.indexOf(selectedEmoji);
    const color = COLORS[(emojiIndex >= 0 ? emojiIndex : 0) % COLORS.length];
    addCategory({
      name: newName.trim(),
      emoji: selectedEmoji,
      type: modalType,
      color,
      isDefault: false,
      sortOrder: 999,
    });
    setNewName('');
    setSelectedEmoji(EMOJI_OPTIONS[0]);
    setModalVisible(false);
  }, [newName, selectedEmoji, modalType, addCategory]);

  const openModal = useCallback(() => {
    setModalType(activeTab);
    setNewName('');
    setSelectedEmoji(EMOJI_OPTIONS[0]);
    setModalVisible(true);
  }, [activeTab]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.groupTitle}>Categories</Text>
      <View style={styles.card}>
        {/* Tab switcher */}
        <TabSwitcher
          tabs={['expense', 'income']}
          activeTab={activeTab}
          onSelect={t => setActiveTab(t as CategoryType)}
        />

        {/* Category list */}
        {categories.map((cat, i) => (
          <React.Fragment key={cat.id}>
            <View style={styles.categoryRow}>
              <IconCircle
                size={40}
                backgroundColor={
                  activeTab === 'expense'
                    ? 'rgba(239,68,68,0.1)'
                    : 'rgba(34,197,94,0.1)'
                }
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              </IconCircle>
              <Text style={styles.categoryName}>{cat.name}</Text>
              {cat.isDefault ? (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteBtnText}>{'\u00D7'}</Text>
                </TouchableOpacity>
              )}
            </View>
            {i < categories.length - 1 && (
              <View style={styles.categoryDivider} />
            )}
          </React.Fragment>
        ))}

        {/* Add row */}
        <TouchableOpacity
          style={styles.addRow}
          onPress={openModal}
          activeOpacity={0.7}
        >
          <View style={styles.addCircle}>
            <Text style={styles.addCircleText}>{'+'}</Text>
          </View>
          <Text style={styles.addLabel}>
            Add {activeTab === 'expense' ? 'Expense' : 'Income'} Category
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Category Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalSheet}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Add Category</Text>

                {/* Type toggle inside modal */}
                <TabSwitcher
                  tabs={['expense', 'income']}
                  activeTab={modalType}
                  onSelect={t => setModalType(t as CategoryType)}
                  style={styles.modalTypeRow}
                />

                {/* Emoji picker */}
                <Text style={styles.emojiPickerLabel}>Choose Icon</Text>
                <View style={styles.emojiGrid}>
                  {EMOJI_OPTIONS.map(e => (
                    <TouchableOpacity
                      key={e}
                      style={[
                        styles.emojiOption,
                        selectedEmoji === e && styles.emojiOptionActive,
                      ]}
                      onPress={() => setSelectedEmoji(e)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.emojiOptionText}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Name input */}
                <Text style={styles.nameInputLabel}>Category Name</Text>
                <TextInput
                  style={styles.nameInput}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="e.g. Gym, Rent, Bonus..."
                  placeholderTextColor={Colors.textMuted}
                  returnKeyType="done"
                  maxLength={30}
                />

                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleAdd}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalSaveBtnText}>Add Category</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default CategoryManager;
