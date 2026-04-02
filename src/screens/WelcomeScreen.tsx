import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { signInWithGoogle } from '../services/authService';
import { styles } from './WelcomeScreen.styles';

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
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
          activeOpacity={0.75}
        >
          {googleLoading ? (
            <ActivityIndicator size="small" color="#EA4335" />
          ) : (
            <>
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.phoneButton}
          onPress={onPhonePress}
          activeOpacity={0.85}
        >
          <Text style={styles.phoneButtonText}>Continue with Phone</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={onGuestPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.guestText, styles.guestUnderline]}>
            Continue as Guest
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;
