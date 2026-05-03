import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BellIcon } from '../../icons/Icons';
import { useAuth } from '../../store/authStore';
import { Colors } from '../../theme/colors';
import { getGreeting } from '../../utils/formatters';
import { styles } from './DashboardHeader.styles';

interface DashboardHeaderProps {
  onBellPress?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(
  ({ onBellPress }) => {
    const { user } = useAuth();

    const displayName = useMemo(() => {
      if (user?.displayName) {
        return user.displayName.split(' ')[0];
      }
      if (user?.phoneNumber) {
        const digits = user.phoneNumber.replace(/\D/g, '');
        return `...${digits.slice(-4)}`;
      }
      return null;
    }, [user]);

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
          <Text style={styles.title}>
            {displayName ? displayName : 'Moniqo'}
          </Text>
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
