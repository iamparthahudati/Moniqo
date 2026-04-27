import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ScreenHeader from '../components/ui/ScreenHeader';
import { Budget } from '../db/repositories/budgetRepository';
import { AppCategory } from '../db/repositories/categoryRepository';
import { PlusIcon } from '../icons/Icons';
import { useBudgets } from '../store/budgetStore';
import { useCategories } from '../store/categoriesStore';
import { useTransactions } from '../store/transactionsStore';
import { Colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';
import { styles } from './BudgetScreen.styles';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCurrentMonthPrefix(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function generateBudgetId(): string {
  return 'b_' + Date.now().toString(36);
}

type BarColor =
  | typeof Colors.incomeGreen
  | typeof Colors.accentOrange
  | typeof Colors.expenseRed;

function getBarColor(pct: number): BarColor {
  if (pct >= 90) {
    return Colors.expenseRed;
  }
  if (pct >= 70) {
    return Colors.accentOrange;
  }
  return Colors.incomeGreen;
}

function getBadgeBg(pct: number): string {
  if (pct >= 90) {
    return 'rgba(239,68,68,0.12)';
  }
  if (pct >= 70) {
    return 'rgba(249,115,22,0.12)';
  }
  return 'rgba(34,197,94,0.12)';
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface SummaryCardProps {
  totalBudgeted: number;
  totalSpent: number;
}

const SummaryCard = React.memo<SummaryCardProps>(
  ({ totalBudgeted, totalSpent }) => {
    const pct =
      totalBudgeted > 0
        ? Math.min(Math.round((totalSpent / totalBudgeted) * 100), 100)
        : 0;
    const remaining = Math.max(totalBudgeted - totalSpent, 0);

    return (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>This Month</Text>
        <Text style={styles.summaryTitle}>{formatCurrency(totalBudgeted)}</Text>
        <View style={styles.summarySubrow}>
          <Text style={styles.summarySpentLabel}>
            {formatCurrency(totalSpent)} spent
          </Text>
          <Text style={styles.summaryPctLabel}>{pct}%</Text>
        </View>
        <View style={styles.summaryBarBg}>
          <View
            style={[
              styles.summaryBarFill,
              {
                width: `${pct}%`,
                backgroundColor:
                  pct >= 90
                    ? Colors.expenseRed
                    : pct >= 70
                    ? Colors.accentOrange
                    : 'rgba(255,255,255,0.9)',
              },
            ]}
          />
        </View>
        <View style={styles.summaryFooter}>
          <View style={styles.summaryFooterItem}>
            <Text style={styles.summaryFooterValue}>
              {formatCurrency(totalSpent)}
            </Text>
            <Text style={styles.summaryFooterKey}>Spent</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryFooterItem}>
            <Text style={styles.summaryFooterValue}>
              {formatCurrency(remaining)}
            </Text>
            <Text style={styles.summaryFooterKey}>Remaining</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryFooterItem}>
            <Text style={styles.summaryFooterValue}>
              {formatCurrency(totalBudgeted)}
            </Text>
            <Text style={styles.summaryFooterKey}>Budgeted</Text>
          </View>
        </View>
      </View>
    );
  },
);

SummaryCard.displayName = 'SummaryCard';

// ── Budget card ───────────────────────────────────────────────────────────────

interface BudgetCardProps {
  budget: Budget;
  category: AppCategory | undefined;
  spent: number;
  onLongPress: (id: string) => void;
}

const BudgetCard = React.memo<BudgetCardProps>(
  ({ budget, category, spent, onLongPress }) => {
    const pct =
      budget.amount > 0
        ? Math.min(Math.round((spent / budget.amount) * 100), 100)
        : 0;
    const remaining = budget.amount - spent;
    const isOver = remaining < 0;
    const barColor = getBarColor(pct);
    const badgeBg = getBadgeBg(pct);
    const categoryColor = category?.color ?? Colors.primary;
    const emojiCircleBg = `${categoryColor}18`;

    return (
      <TouchableOpacity
        style={styles.budgetCard}
        onLongPress={() => onLongPress(budget.id)}
        activeOpacity={0.85}
        delayLongPress={400}
      >
        <View style={styles.budgetCardHeader}>
          <View
            style={[
              styles.budgetEmojiCircle,
              { backgroundColor: emojiCircleBg },
            ]}
          >
            <Text style={styles.budgetEmoji}>
              {category?.emoji ?? '\u2022'}
            </Text>
          </View>
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetCategoryName}>
              {category?.name ?? 'Unknown'}
            </Text>
            <View style={styles.budgetAmountRow}>
              <Text style={styles.budgetSpentAmount}>
                {formatCurrency(spent)}
              </Text>
              <Text style={styles.budgetSeparator}>{'/'}</Text>
              <Text style={styles.budgetTotalAmount}>
                {formatCurrency(budget.amount)}
              </Text>
            </View>
          </View>
          <View style={[styles.budgetPctBadge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.budgetPctText, { color: barColor }]}>
              {pct}%
            </Text>
          </View>
        </View>

        <View style={styles.budgetBarBg}>
          <View
            style={[
              styles.budgetBarFill,
              { width: `${pct}%`, backgroundColor: barColor },
            ]}
          />
        </View>

        <View style={styles.budgetFooter}>
          {isOver ? (
            <Text style={styles.budgetOverLabel}>
              {formatCurrency(Math.abs(remaining))} over budget
            </Text>
          ) : (
            <Text style={styles.budgetRemainingLabel}>
              {formatCurrency(remaining)} remaining
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

BudgetCard.displayName = 'BudgetCard';

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState = React.memo(() => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconCircle}>
      <Text style={styles.emptyIconText}>{'\uD83C\uDFAF'}</Text>
    </View>
    <Text style={styles.emptyTitle}>No budgets set</Text>
    <Text style={styles.emptySubtext}>
      Tap + to set a monthly budget for a category
    </Text>
  </View>
));

EmptyState.displayName = 'EmptyState';

// ── Category picker item ──────────────────────────────────────────────────────

interface CategoryPickerItemProps {
  category: AppCategory;
  selected: boolean;
  onPress: (cat: AppCategory) => void;
}

const CategoryPickerItem = React.memo<CategoryPickerItemProps>(
  ({ category, selected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.categoryPickerItem,
        selected && styles.categoryPickerItemSelected,
      ]}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryPickerEmoji}>{category.emoji}</Text>
      <Text style={styles.categoryPickerName}>{category.name}</Text>
      {selected && (
        <View style={styles.categoryPickerCheck}>
          <Text style={styles.categoryPickerCheckText}>{'\u2713'}</Text>
        </View>
      )}
    </TouchableOpacity>
  ),
);

CategoryPickerItem.displayName = 'CategoryPickerItem';

// ── Add Budget Modal ──────────────────────────────────────────────────────────

type ModalStep = 'category' | 'amount';

interface AddBudgetModalProps {
  visible: boolean;
  availableCategories: AppCategory[];
  onClose: () => void;
  onSubmit: (categoryId: string, amount: number) => void;
}

const AddBudgetModal = React.memo<AddBudgetModalProps>(
  ({ visible, availableCategories, onClose, onSubmit }) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [step, setStep] = useState<ModalStep>('category');
    const [selectedCategory, setSelectedCategory] =
      useState<AppCategory | null>(null);
    const [amountText, setAmountText] = useState('');
    const [inputFocused, setInputFocused] = useState(false);
    const [error, setError] = useState('');

    const handleShow = useCallback(() => {
      setStep('category');
      setSelectedCategory(null);
      setAmountText('');
      setError('');
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }, [slideAnim]);

    const handleClose = useCallback(() => {
      Keyboard.dismiss();
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        onClose();
        setStep('category');
        setSelectedCategory(null);
        setAmountText('');
        setError('');
      });
    }, [slideAnim, onClose]);

    const handleSelectCategory = useCallback((cat: AppCategory) => {
      setSelectedCategory(cat);
      setStep('amount');
      setAmountText('');
      setError('');
    }, []);

    const handleChangeCategory = useCallback(() => {
      setStep('category');
      setSelectedCategory(null);
      setAmountText('');
      setError('');
    }, []);

    const handleSubmit = useCallback(() => {
      if (!selectedCategory) {
        return;
      }
      const parsed = parseFloat(amountText.replace(/,/g, ''));
      if (!amountText || isNaN(parsed) || parsed <= 0) {
        setError('Please enter a valid amount greater than 0');
        return;
      }
      onSubmit(selectedCategory.id, parsed);
      handleClose();
    }, [selectedCategory, amountText, onSubmit, handleClose]);

    const translateY = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [600, 0],
    });

    const isSubmitDisabled =
      !selectedCategory ||
      !amountText ||
      parseFloat(amountText.replace(/,/g, '')) <= 0;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onShow={handleShow}
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Animated.View
                style={[styles.sheet, { transform: [{ translateY }] }]}
              >
                <View style={styles.sheetHandle} />

                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>
                    {step === 'category'
                      ? 'Select Category'
                      : 'Set Budget Amount'}
                  </Text>
                  <TouchableOpacity
                    style={styles.sheetCloseBtn}
                    onPress={handleClose}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.sheetCloseText}>{'\u00D7'}</Text>
                  </TouchableOpacity>
                </View>

                {step === 'category' ? (
                  <>
                    <Text style={styles.stepLabel}>Choose a category</Text>
                    {availableCategories.length === 0 ? (
                      <Text style={styles.noCategoriesText}>
                        All expense categories already have a budget set.
                      </Text>
                    ) : (
                      <ScrollView
                        style={styles.categoryPickerList}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                      >
                        {availableCategories.map(cat => (
                          <CategoryPickerItem
                            key={cat.id}
                            category={cat}
                            selected={selectedCategory?.id === cat.id}
                            onPress={handleSelectCategory}
                          />
                        ))}
                      </ScrollView>
                    )}
                  </>
                ) : (
                  <View style={styles.amountInputSection}>
                    {selectedCategory && (
                      <View style={styles.selectedCategoryRow}>
                        <Text style={styles.selectedCategoryEmoji}>
                          {selectedCategory.emoji}
                        </Text>
                        <Text style={styles.selectedCategoryName}>
                          {selectedCategory.name}
                        </Text>
                        <TouchableOpacity
                          style={styles.changeCategoryBtn}
                          onPress={handleChangeCategory}
                        >
                          <Text style={styles.changeCategoryText}>Change</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <Text style={styles.stepLabel}>Monthly budget</Text>

                    <View
                      style={[
                        styles.amountInputWrapper,
                        inputFocused && styles.amountInputWrapperFocused,
                      ]}
                    >
                      <Text style={styles.amountInputPrefix}>{'\u20B9'}</Text>
                      <TextInput
                        style={styles.amountInput}
                        value={amountText}
                        onChangeText={text => {
                          setAmountText(text);
                          if (error) {
                            setError('');
                          }
                        }}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={Colors.textMuted}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                        autoFocus
                      />
                    </View>

                    {error ? (
                      <Text style={styles.amountError}>{error}</Text>
                    ) : (
                      <Text style={styles.amountHint}>
                        Enter the maximum amount you want to spend this month
                      </Text>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.setBudgetBtn,
                        isSubmitDisabled && styles.setBudgetBtnDisabled,
                      ]}
                      onPress={handleSubmit}
                      disabled={isSubmitDisabled}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.setBudgetBtnText}>Set Budget</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  },
);

AddBudgetModal.displayName = 'AddBudgetModal';

// ── Screen ────────────────────────────────────────────────────────────────────

const BudgetScreen: React.FC = () => {
  const { state: budgetState, dispatch } = useBudgets();
  const { expenseCategories } = useCategories();
  const { state: txState } = useTransactions();

  const [modalVisible, setModalVisible] = useState(false);

  const currentMonthPrefix = useMemo(() => getCurrentMonthPrefix(), []);

  const spendingByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const tx of txState.transactions) {
      if (tx.type === 'expense' && tx.date.startsWith(currentMonthPrefix)) {
        const catId = tx.category;
        map[catId] = (map[catId] ?? 0) + Math.abs(tx.amount);
      }
    }
    return map;
  }, [txState.transactions, currentMonthPrefix]);

  const categoryMap = useMemo(() => {
    const map: Record<string, AppCategory> = {};
    for (const cat of expenseCategories) {
      map[cat.id] = cat;
    }
    return map;
  }, [expenseCategories]);

  const budgetedCategoryIds = useMemo(
    () => new Set(budgetState.budgets.map(b => b.categoryId)),
    [budgetState.budgets],
  );

  const availableCategories = useMemo(
    () => expenseCategories.filter(cat => !budgetedCategoryIds.has(cat.id)),
    [expenseCategories, budgetedCategoryIds],
  );

  const { totalBudgeted, totalSpent } = useMemo(() => {
    let budgeted = 0;
    let spent = 0;
    for (const budget of budgetState.budgets) {
      budgeted += budget.amount;
      spent += spendingByCategory[budget.categoryId] ?? 0;
    }
    return { totalBudgeted: budgeted, totalSpent: spent };
  }, [budgetState.budgets, spendingByCategory]);

  const handleDeleteBudget = useCallback(
    (id: string) => {
      Alert.alert(
        'Delete Budget',
        'Are you sure you want to remove this budget?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => dispatch({ type: 'DELETE_BUDGET', payload: { id } }),
          },
        ],
      );
    },
    [dispatch],
  );

  const handleAddBudget = useCallback(
    (categoryId: string, amount: number) => {
      dispatch({
        type: 'UPSERT_BUDGET',
        payload: {
          id: generateBudgetId(),
          categoryId,
          amount,
          period: 'monthly',
          created_at: 0,
        },
      });
    },
    [dispatch],
  );

  const renderBudgetCard = useCallback(
    ({ item }: { item: Budget }) => (
      <BudgetCard
        budget={item}
        category={categoryMap[item.categoryId]}
        spent={spendingByCategory[item.categoryId] ?? 0}
        onLongPress={handleDeleteBudget}
      />
    ),
    [categoryMap, spendingByCategory, handleDeleteBudget],
  );

  const keyExtractor = useCallback((item: Budget) => item.id, []);

  const ListHeader = useMemo(
    () =>
      budgetState.budgets.length > 0 ? (
        <SummaryCard totalBudgeted={totalBudgeted} totalSpent={totalSpent} />
      ) : null,
    [budgetState.budgets.length, totalBudgeted, totalSpent],
  );

  const AddButton = useMemo(
    () => (
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <PlusIcon size={20} color={Colors.white} />
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Budget Goals" rightSlot={AddButton} />

      {budgetState.budgets.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={budgetState.budgets}
          keyExtractor={keyExtractor}
          renderItem={renderBudgetCard}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddBudgetModal
        visible={modalVisible}
        availableCategories={availableCategories}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddBudget}
      />
    </View>
  );
};

export default BudgetScreen;
