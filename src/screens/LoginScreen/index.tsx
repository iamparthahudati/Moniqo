import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from '../../components/ui/Button';
import IconButton from '../../components/ui/IconButton';
import { BackIcon } from '../../icons/Icons';
import { AuthApiService } from '../../services/authApiService';
import styles from './styles';

interface LoginScreenProps {
  onBack: () => void;
  onOtpSent: (phoneNumber: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, onOtpSent }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const isDisabled = phone.length < 10 || loading;

  const handleContinue = async () => {
    if (phone.length !== 10) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit phone number.',
      );
      return;
    }

    setLoading(true);
    try {
      const fullPhone = '+91' + phone;
      await AuthApiService.sendOtp(fullPhone);
      onOtpSent(fullPhone);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message ?? 'Failed to send OTP. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <IconButton onPress={onBack} style={styles.backButtonMargin}>
          <BackIcon size={20} color="#1A1D2E" />
        </IconButton>

        <Text style={styles.heading}>Enter your number</Text>
        <Text style={styles.subheading}>
          We will send a one-time password to verify your phone number.
        </Text>

        <Text style={styles.inputLabel}>Phone Number</Text>
        <View style={styles.phoneRow}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="9876543210"
            placeholderTextColor="#9CA3AF"
            editable={!loading}
          />
        </View>

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={isDisabled}
          loading={loading}
          style={styles.continueButtonMargin}
        />

        <Text style={styles.note}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
