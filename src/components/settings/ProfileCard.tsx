import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ProfileCard.styles';

const ProfileCard: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarEmoji}>{'\uD83D\uDC68\u200D\uD83D\uDCBC'}</Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>Alex Johnson</Text>
      <Text style={styles.email}>alex.johnson@email.com</Text>
    </View>
    <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
      <Text style={styles.editBtnText}>Edit</Text>
    </TouchableOpacity>
  </View>
);

export default ProfileCard;
