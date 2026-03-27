import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { APP_TITLE } from '../../data/mockData';
import { BellIcon } from '../../icons/Icons';
import { Colors } from '../../theme/colors';
import { getGreeting } from '../../utils/formatters';
import { styles } from './DashboardHeader.styles';

interface DashboardHeaderProps {
  onBellPress?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(
  ({ onBellPress }) => {
    return (
      <View style={styles.container}>
        <View style={styles.avatar}>
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>
              {'\uD83D\uDC68\u200D\uD83D\uDCBC'}
            </Text>
          </View>
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.title}>{APP_TITLE}</Text>
        </View>
        <TouchableOpacity
          style={styles.bellButton}
          onPress={onBellPress}
          activeOpacity={0.7}
        >
          <BellIcon size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    );
  },
);

export default DashboardHeader;
