import React, { useEffect, useRef, useState } from 'react';
import {
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
import Button from '../../components/ui/Button';
import IconButton from '../../components/ui/IconButton';
import { BackIcon } from '../../icons/Icons';
import { AuthApiService } from '../../services/authApiService';
import { SyncApiService } from '../../services/syncApiService';
import { BankRepository } from '../../db/repositories/bankRepository';
import { CardRepository } from '../../db/repositories/cardRepository';
import { CashRepository } from '../../db/repositories/cashRepository';
import { InvestmentRepository } from '../../db/repositories/investmentRepository';
import { TransactionsRepository } from '../../db/repositories/transactionsRepository';
import { CategoriesRepository } from '../../db/repositories/categoriesRepository';
import { BudgetRepository } from '../../db/repositories/budgetRepository';
import { useAuth } from '../../store/authStore';
import { Colors } from '../../theme/colors';
import styles from './styles';

interface OtpScreenProps {
  phoneNumber: string;
  onBack: () => void;
  onSuccess: () => void;
}

const OTP_LENGTH = 6;

export default function OtpScreen({
  phoneNumber,
  onBack,
  onSuccess,
}: OtpScreenProps) {
  const { setUser } = useAuth();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [resendTimer, setResendTimer] = useState(60);

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
      await AuthApiService.sendOtp(phoneNumber);
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
      // 1. Verify OTP with PHP API — stores JWT tokens in MMKV
      const user = await AuthApiService.verifyOtp(phoneNumber, code);

      // 2. Initialize all SQLite tables
      BankRepository.init();
      CardRepository.init();
      CashRepository.init();
      InvestmentRepository.init();
      TransactionsRepository.init();
      CategoriesRepository.init();
      BudgetRepository.init();

      // 3. Pull all cloud data and write into SQLite
      const syncData = await SyncApiService.pull();

      for (const b of syncData.accounts_bank) {
        BankRepository.insert({
          id: b.id, bankName: b.bank_name, accountType: b.account_type,
          balance: b.balance, color: b.color, icon: b.icon,
          status: b.status, note: b.note, created_at: b.created_at,
        });
      }
      for (const c of syncData.accounts_card) {
        CardRepository.insert({
          id: c.id, cardName: c.card_name, cardType: c.card_type,
          dueAmount: c.due_amount, dueLabel: c.due_label,
          color: c.color, note: c.note, created_at: c.created_at,
        });
      }
      for (const cash of syncData.accounts_cash) {
        CashRepository.insert(cash);
      }
      for (const inv of syncData.accounts_investment) {
        InvestmentRepository.insert({
          id: inv.id, name: inv.name, amount: inv.amount,
          icon: inv.icon, color: inv.color, note: inv.note, created_at: inv.created_at,
        });
      }
      for (const tx of syncData.transactions) {
        TransactionsRepository.insert(tx);
      }
      for (const cat of syncData.categories) {
        CategoriesRepository.insert({
          id: cat.id, name: cat.name, emoji: cat.emoji, type: cat.type,
          color: cat.color, isDefault: cat.is_default, sortOrder: cat.sort_order,
          created_at: cat.created_at,
        });
      }
      for (const bud of syncData.budgets) {
        BudgetRepository.upsert({
          id: bud.id, categoryId: bud.category_id,
          amount: bud.amount, period: bud.period, created_at: bud.created_at,
        });
      }

      // 4. Set user in auth store → triggers AuthGate to show main app
      setUser({
        id: user.id,
        phone: user.phone,
        display_name: user.display_name,
        membership: user.membership,
        trial_used: false,
        referral_code: user.referral_code ?? '',
        created_at: user.created_at ?? 0,
      });
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
        <IconButton onPress={onBack} style={styles.backButtonMargin}>
          <BackIcon size={20} color={Colors.textPrimary} />
        </IconButton>

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

        <Button
          title="Verify"
          onPress={handleVerify}
          disabled={isVerifyDisabled}
          loading={loading}
        />

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
