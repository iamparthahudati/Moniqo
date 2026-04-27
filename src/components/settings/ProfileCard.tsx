import auth from '@react-native-firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../store/authStore';
import { styles } from './ProfileCard.styles';

const ProfileCard: React.FC = () => {
  const { user, isGuest } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [inputName, setInputName] = useState('');
  const [saving, setSaving] = useState(false);
  const [localDisplayName, setLocalDisplayName] = useState<string | null>(null);

  const displayName = localDisplayName ?? user?.displayName ?? 'Moniqo User';
  const identifier = user?.phoneNumber ?? user?.email ?? '';
  const initials = (
    (localDisplayName ?? user?.displayName)?.[0] ??
    user?.phoneNumber?.[0] ??
    user?.email?.[0] ??
    'M'
  ).toUpperCase();

  const handleEditPress = () => {
    if (isGuest) {
      Alert.alert('Not available in guest mode');
      return;
    }
    setInputName(displayName);
    setModalVisible(true);
  };

  const handleClose = () => {
    if (saving) return;
    setModalVisible(false);
  };

  const handleSave = async () => {
    const trimmed = inputName.trim();
    if (!trimmed) {
      Alert.alert('Invalid name', 'Display name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found.');
      }
      await currentUser.updateProfile({ displayName: trimmed });
      setLocalDisplayName(trimmed);
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert(
        'Update failed',
        error?.message ?? 'Something went wrong. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>{initials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{displayName}</Text>
          {!!identifier && <Text style={styles.email}>{identifier}</Text>}
          {isGuest && <Text style={styles.email}>Guest Mode</Text>}
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.7}
          onPress={handleEditPress}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Edit Display Name</Text>

            <TextInput
              style={styles.input}
              value={inputName}
              onChangeText={setInputName}
              placeholder="Enter display name"
              placeholderTextColor="#94A3B8"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
              editable={!saving}
            />

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              activeOpacity={0.8}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.7}
              onPress={handleClose}
              disabled={saving}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileCard;
