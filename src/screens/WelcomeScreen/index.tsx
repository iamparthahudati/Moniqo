import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  View,
} from 'react-native';
import Button from '../../components/ui/Button';
import { signInWithGoogle } from '../../services/authService';
import { styles } from './styles';

interface WelcomeScreenProps {
  onPhonePress: () => void;
  onGuestPress: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onPhonePress,
  onGuestPress,
}) => {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
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

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          variant="primary"
          title="Continue with Phone"
          onPress={onPhonePress}
          activeOpacity={0.85}
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
