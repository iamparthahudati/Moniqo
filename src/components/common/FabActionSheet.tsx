import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './FabActionSheet.styles';

export type FabAction = 'expense' | 'income' | 'transfer';

interface ActionOption {
  id: FabAction;
  emoji: string;
  label: string;
  sublabel: string;
  bg: string;
}

const OPTIONS: ActionOption[] = [
  {
    id: 'expense',
    emoji: '\uD83D\uDCB8',
    label: 'Expense',
    sublabel: 'Add spending',
    bg: 'rgba(239,68,68,0.1)',
  },
  {
    id: 'income',
    emoji: '\uD83D\uDCB0',
    label: 'Income',
    sublabel: 'Add earning',
    bg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'transfer',
    emoji: '\uD83D\uDD04',
    label: 'Transfer',
    sublabel: 'Between accounts',
    bg: 'rgba(43,63,232,0.1)',
  },
];

interface FabActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (action: FabAction) => void;
}

const FabActionSheet: React.FC<FabActionSheetProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 8 }]}>
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>What would you like to do?</Text>

              <View style={styles.optionsRow}>
                {OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.id}
                    style={styles.option}
                    onPress={() => onSelect(opt.id)}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[styles.optionCircle, { backgroundColor: opt.bg }]}
                    >
                      <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                    </View>
                    <Text style={styles.optionLabel}>{opt.label}</Text>
                    <Text style={styles.optionSublabel}>{opt.sublabel}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FabActionSheet;
