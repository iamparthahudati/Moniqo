import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../store/authStore';
import { styles } from './ProfileCard.styles';

const ProfileCard: React.FC = () => {
  const { user, isGuest } = useAuth();

  const displayName = user?.displayName ?? 'Moniqo User';
  const identifier = user?.phoneNumber ?? user?.email ?? '';
  const initials = (
    user?.displayName?.[0] ??
    user?.phoneNumber?.[0] ??
    user?.email?.[0] ??
    'M'
  ).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarEmoji}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{displayName}</Text>
        {!!identifier && <Text style={styles.email}>{identifier}</Text>}
        {isGuest && <Text style={styles.email}>Guest Mode</Text>}
      </View>
      <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
        <Text style={styles.editBtnText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileCard;
