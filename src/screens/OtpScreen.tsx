import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TextInput as TextInputType,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackIcon } from '../icons/Icons';
import { confirmOtp, sendOtp } from '../services/authService';
import { Colors } from '../theme/colors';
import styles from './OtpScreen.styles';

interface OtpScreenProps {
  phoneNumber: string;
  confirmation: any;
  onBack: () => void;
  onSuccess: () => void;
}

const OTP_LENGTH = 6;

export default function OtpScreen({
  phoneNumber,
  confirmation,
  onBack,
  onSuccess,
}: OtpScreenProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [resendTimer, setResendTimer] = useState(60);
  const [confirmationResult, setConfirmationResult] =
    useState<any>(confirmation);

  const inputRefs = useRef<TextInputType[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChangeText = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) {
      return;
    }
    try {
      const result = await sendOtp(phoneNumber);
      setConfirmationResult(result);
      setResendTimer(60);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message ?? 'Failed to resend OTP. Please try again.',
      );
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH || loading) {
      return;
    }
    setLoading(true);
    try {
      await confirmOtp(confirmationResult, code);
      onSuccess();
    } catch (error: any) {
      Alert.alert(
        'Verification Failed',
        error?.message ?? 'Invalid code. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const isVerifyDisabled = otp.join('').length < OTP_LENGTH || loading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[styles.content, { paddingTop: Math.max(insets.top + 16, 48) }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <BackIcon size={20} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.heading}>Verify your number</Text>
        <Text style={styles.subheading}>
          {'Enter the 6-digit code sent to '}
          <Text style={styles.phoneHighlight}>{phoneNumber}</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.otpBox,
                focusedIndex === index && styles.otpBoxFocused,
                digit !== '' && styles.otpBoxFilled,
              ]}
            >
              <TextInput
                ref={ref => {
                  if (ref) {
                    inputRefs.current[index] = ref;
                  }
                }}
                style={styles.otpText}
                value={digit}
                onChangeText={text => handleChangeText(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(-1)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                caretHidden
                selectTextOnFocus
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            isVerifyDisabled && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={isVerifyDisabled}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={resendTimer > 0}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.resendLink,
                resendTimer > 0 && styles.resendDisabled,
              ]}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
