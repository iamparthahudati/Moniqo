import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './PremiumBanner.styles';

const FEATURES = [
  { emoji: '\uD83D\uDCCA', label: 'Advanced Reports' },
  { emoji: '\uD83D\uDD14', label: 'Smart Alerts' },
  { emoji: '\uD83E\uDD16', label: 'AI Insights' },
  { emoji: '\uD83C\uDFAF', label: 'Budget Goals' },
  { emoji: '\uD83D\uDCE4', label: 'CSV Export' },
  { emoji: '\u2601\uFE0F', label: 'Cloud Sync' },
];

const PremiumBanner: React.FC = () => {
  const [notified, setNotified] = useState(false);

  const handleNotify = () => {
    setNotified(true);
    Alert.alert(
      'You are on the list!',
      'We will notify you as soon as Pro features are available. Thank you for your interest!',
      [{ text: 'Great', style: 'default' }],
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.gradient}>
        <View style={styles.topRow}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PRO</Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Unlock Pro Features</Text>
        <Text style={styles.subtitle}>
          We are working on powerful tools to help you manage your finances
          smarter. Join the waitlist to be first in line.
        </Text>

        <View style={styles.featureRow}>
          {FEATURES.map(f => (
            <View key={f.label} style={styles.featureChip}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureText}>{f.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.notifyBtn}
          onPress={handleNotify}
          activeOpacity={0.85}
          disabled={notified}
        >
          <Text style={styles.notifyBtnText}>
            {notified
              ? 'You are on the waitlist \u2713'
              : 'Notify Me When Available'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PremiumBanner;
