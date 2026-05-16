import React, { useState } from 'react';
import {
  Alert,
  Text,
  View,
} from 'react-native';
import Button from '../../components/ui/Button';
import { BankRepository } from '../../db/repositories/bankRepository';
import { BudgetRepository } from '../../db/repositories/budgetRepository';
import { CardRepository } from '../../db/repositories/cardRepository';
import { CashRepository } from '../../db/repositories/cashRepository';
import { CategoriesRepository } from '../../db/repositories/categoriesRepository';
import { InvestmentRepository } from '../../db/repositories/investmentRepository';
import { TransactionsRepository } from '../../db/repositories/transactionsRepository';
import { GoogleAuthApiService } from '../../services/googleAuthApiService';
import { SyncApiService } from '../../services/syncApiService';
import { useAuth } from '../../store/authStore';
import { styles } from './styles';

interface WelcomeScreenProps {
  onGuestPress: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGuestPress }) => {
  const { setUser } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      GoogleAuthApiService.configure();
      const user = await GoogleAuthApiService.signIn();

      BankRepository.init();
      CardRepository.init();
      CashRepository.init();
      InvestmentRepository.init();
      TransactionsRepository.init();
      CategoriesRepository.init();
      BudgetRepository.init();

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

      setUser({
        id: user.id,
        phone: user.email ?? '',
        display_name: user.display_name,
        membership: user.membership,
        trial_used: false,
        referral_code: '',
        created_at: 0,
      });
    } catch (error: any) {
      Alert.alert(
        'Sign-in Failed',
        error?.message ?? 'Something went wrong. Please try again.',
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>M</Text>
        </View>
        <Text style={styles.logoText}>Moniqo</Text>
        <Text style={styles.tagline}>Your finances, beautifully simple.</Text>
      </View>

      <View style={styles.actionsSection}>
        <Button
          variant="outline"
          title={googleLoading ? '' : 'Continue with Google'}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
          loading={googleLoading}
          style={styles.googleButtonOverride}
        />

        <Button
          variant="ghost"
          title="Continue as Guest"
          onPress={onGuestPress}
        />

        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;
