import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackIcon } from '../../icons/Icons';
import { Colors } from '../../theme/colors';

interface ModalHeaderProps {
  title: string;
  onBack: () => void;
  onSave: () => void;
  saveLabel?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onBack,
  onSave,
  saveLabel = 'Save',
}) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBack}
      activeOpacity={0.7}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      <BackIcon size={22} color={Colors.textPrimary} />
    </TouchableOpacity>

    <Text style={styles.title} numberOfLines={1}>
      {title}
    </Text>

    <TouchableOpacity
      onPress={onSave}
      activeOpacity={0.7}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      <Text style={styles.saveLabel}>{saveLabel}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    flex: 1,
    textAlign: 'center',
  },
  saveLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default memo(ModalHeader);
