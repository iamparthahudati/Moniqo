import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon } from '../../icons/Icons';
import { Colors } from '../../theme/colors';
import { styles } from './SettingRow.styles';

// ── Toggle ────────────────────────────────────────────────────────────────────

interface ToggleProps {
  value: boolean;
  onToggle: () => void;
}

export const Toggle: React.FC<ToggleProps> = React.memo(
  ({ value, onToggle }) => (
    <TouchableOpacity
      style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.toggleThumb,
          value ? styles.toggleThumbOn : styles.toggleThumbOff,
        ]}
      />
    </TouchableOpacity>
  ),
);

// ── Row ───────────────────────────────────────────────────────────────────────

export interface SettingRowData {
  id: string;
  emoji: string;
  iconBg: string;
  label: string;
  type: 'chevron' | 'toggle' | 'value';
  value?: string;
  toggleValue?: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  destructive?: boolean;
}

interface SettingRowProps {
  item: SettingRowData;
  isLast: boolean;
}

export const SettingRow: React.FC<SettingRowProps> = React.memo(
  ({ item, isLast }) => {
    const content = (
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
          <Text style={styles.iconEmoji}>{item.emoji}</Text>
        </View>
        <Text
          style={[
            styles.rowLabel,
            item.destructive && styles.rowLabelDestructive,
          ]}
        >
          {item.label}
        </Text>
        {item.type === 'toggle' && item.onToggle && (
          <Toggle value={item.toggleValue ?? false} onToggle={item.onToggle} />
        )}
        {item.type === 'value' && (
          <Text style={styles.rowValue}>{item.value}</Text>
        )}
        {item.type === 'chevron' && (
          <View style={styles.chevron}>
            <ChevronRightIcon size={16} color={Colors.textMuted} />
          </View>
        )}
      </View>
    );

    return (
      <>
        {item.type === 'toggle' ? (
          <View>{content}</View>
        ) : (
          <TouchableOpacity onPress={item.onPress} activeOpacity={0.7}>
            {content}
          </TouchableOpacity>
        )}
        {!isLast && <View style={styles.rowDivider} />}
      </>
    );
  },
);

// ── Group ─────────────────────────────────────────────────────────────────────

interface SettingGroupProps {
  title: string;
  rows: SettingRowData[];
}

export const SettingGroup: React.FC<SettingGroupProps> = React.memo(
  ({ title, rows }) => (
    <>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.group}>
        {rows.map((row, i) => (
          <SettingRow key={row.id} item={row} isLast={i === rows.length - 1} />
        ))}
      </View>
    </>
  ),
);
