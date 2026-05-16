import React from 'react';
import { Alert, Linking, ScrollView, View } from 'react-native';
import { APP_VERSION, BUILD_NUMBER } from '../../config/version';
import CategoryManager from '../../components/settings/CategoryManager';
import PremiumBanner from '../../components/settings/PremiumBanner';
import ProfileCard from '../../components/settings/ProfileCard';
import {
  SettingGroup,
  SettingRowData,
} from '../../components/settings/SettingRow';
import ScreenHeader from '../../components/ui/ScreenHeader';
import useNotifications from '../../hooks/useNotifications';
import { useToggle } from '../../hooks/useToggle';
import { UserApiService } from '../../services/userApiService';
import { useAuth } from '../../store/authStore';
import { styles } from './styles';

const PRIVACY_POLICY_URL = 'https://moniqo-cc889.web.app/';
const TERMS_URL = 'https://moniqo-cc889.web.app/TERMS_OF_SERVICE.html';

// ── Settings screen ───────────────────────────────────────────────────────────

interface SettingsScreenProps {
  onUpgradePress: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onUpgradePress }) => {
  const { signOut } = useAuth();

  // Notification toggles
  const [txAlerts, toggleTxAlerts] = useToggle(true);
  const [monthlyReport, toggleMonthlyReport] = useToggle(true);
  const [budgetWarnings, toggleBudgetWarnings] = useToggle(false);
  const [weeklyDigest, toggleWeeklyDigest] = useToggle(false);

  const { enableMonthlyReport, enableWeeklyDigest } = useNotifications();

  const handleTxAlerts = () => {
    toggleTxAlerts();
  };

  const handleMonthlyReport = () => {
    if (!monthlyReport) {
      enableMonthlyReport().catch(() => {});
    }
    toggleMonthlyReport();
  };

  const handleBudgetWarnings = () => {
    toggleBudgetWarnings();
  };

  const handleWeeklyDigest = () => {
    if (!weeklyDigest) {
      enableWeeklyDigest().catch(() => {});
    }
    toggleWeeklyDigest();
  };

  const handleDeleteAccount = async () => {
    try {
      await UserApiService.deleteAccount();
      await signOut();
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'Failed to delete account. Please try again.');
    }
  };

  // ── Row definitions ─────────────────────────────────────────────────────────

  const generalRows: SettingRowData[] = [
    {
      id: 'currency',
      emoji: '💱',
      iconBg: 'rgba(43,63,232,0.1)',
      label: 'Default Currency',
      type: 'value',
      value: 'INR ₹',
      onPress: () => Alert.alert('Currency', 'Currency selection coming soon.'),
    },
    {
      id: 'language',
      emoji: '🌍',
      iconBg: 'rgba(59,130,246,0.1)',
      label: 'Language',
      type: 'value',
      value: 'English',
      onPress: () => Alert.alert('Language', 'Language selection coming soon.'),
    },
    {
      id: 'startweek',
      emoji: '📅',
      iconBg: 'rgba(139,92,246,0.1)',
      label: 'Week Starts On',
      type: 'value',
      value: 'Monday',
      onPress: () =>
        Alert.alert('Week Start', 'Week start day selection coming soon.'),
    },
    {
      id: 'dateformat',
      emoji: '🕒',
      iconBg: 'rgba(249,115,22,0.1)',
      label: 'Date Format',
      type: 'value',
      value: 'DD/MM/YYYY',
      onPress: () =>
        Alert.alert('Date Format', 'Date format selection coming soon.'),
    },
  ];

  const notificationRows: SettingRowData[] = [
    {
      id: 'txalerts',
      emoji: '🔔',
      iconBg: 'rgba(34,197,94,0.1)',
      label: 'Transaction Alerts',
      type: 'toggle',
      toggleValue: txAlerts,
      onToggle: handleTxAlerts,
    },
    {
      id: 'monthly',
      emoji: '📊',
      iconBg: 'rgba(43,63,232,0.1)',
      label: 'Monthly Report',
      type: 'toggle',
      toggleValue: monthlyReport,
      onToggle: handleMonthlyReport,
    },
    {
      id: 'budget',
      emoji: '⚠️',
      iconBg: 'rgba(239,68,68,0.1)',
      label: 'Budget Warnings',
      type: 'toggle',
      toggleValue: budgetWarnings,
      onToggle: handleBudgetWarnings,
    },
    {
      id: 'weekly',
      emoji: '📰',
      iconBg: 'rgba(249,115,22,0.1)',
      label: 'Weekly Digest',
      type: 'toggle',
      toggleValue: weeklyDigest,
      onToggle: handleWeeklyDigest,
    },
  ];

  const appearanceRows: SettingRowData[] = [
    {
      id: 'theme',
      emoji: '🌙',
      iconBg: 'rgba(15,23,42,0.08)',
      label: 'Theme',
      type: 'value',
      value: 'Light',
      onPress: () => Alert.alert('Theme', 'Dark mode coming soon.'),
    },
    {
      id: 'appicon',
      emoji: '🎨',
      iconBg: 'rgba(139,92,246,0.1)',
      label: 'App Icon',
      type: 'chevron',
      onPress: () => Alert.alert('App Icon', 'Custom app icons coming soon.'),
    },
    {
      id: 'haptics',
      emoji: '📳',
      iconBg: 'rgba(59,130,246,0.1)',
      label: 'Haptic Feedback',
      type: 'value',
      value: 'On',
      onPress: () => Alert.alert('Haptics', 'Haptic settings coming soon.'),
    },
  ];

  const securityRows: SettingRowData[] = [
    {
      id: 'biometric',
      emoji: '👁️',
      iconBg: 'rgba(43,63,232,0.1)',
      label: 'Face ID / Biometrics',
      type: 'value',
      value: 'Off',
      onPress: () => Alert.alert('Biometrics', 'Biometric lock coming soon.'),
    },
    {
      id: 'passcode',
      emoji: '🔐',
      iconBg: 'rgba(249,115,22,0.1)',
      label: 'App Passcode',
      type: 'chevron',
      onPress: () => Alert.alert('App Passcode', 'Passcode lock coming soon.'),
    },
  ];

  const dataRows: SettingRowData[] = [
    {
      id: 'export',
      emoji: '📤',
      iconBg: 'rgba(34,197,94,0.1)',
      label: 'Export Data',
      type: 'chevron',
      onPress: () => Alert.alert('Export', 'Data export coming soon.'),
    },
    {
      id: 'backup',
      emoji: '☁️',
      iconBg: 'rgba(59,130,246,0.1)',
      label: 'Backup & Restore',
      type: 'chevron',
      onPress: () => Alert.alert('Backup', 'Backup & restore coming soon.'),
    },
    {
      id: 'cache',
      emoji: '🗑️',
      iconBg: 'rgba(148,163,184,0.15)',
      label: 'Clear Cache',
      type: 'chevron',
      onPress: () =>
        Alert.alert('Clear Cache', 'This will clear temporary data.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: () => {} },
        ]),
    },
    {
      id: 'privacy',
      emoji: '🛡️',
      iconBg: 'rgba(43,63,232,0.1)',
      label: 'Privacy Policy',
      type: 'chevron',
      onPress: () =>
        Linking.openURL(PRIVACY_POLICY_URL).catch(() =>
          Alert.alert('Error', 'Could not open the privacy policy.'),
        ),
    },
    {
      id: 'terms',
      emoji: '📜',
      iconBg: 'rgba(139,92,246,0.1)',
      label: 'Terms of Service',
      type: 'chevron',
      onPress: () =>
        Linking.openURL(TERMS_URL).catch(() =>
          Alert.alert('Error', 'Could not open the terms of service.'),
        ),
    },
  ];

  const aboutRows: SettingRowData[] = [
    {
      id: 'version',
      emoji: '📱',
      iconBg: 'rgba(148,163,184,0.15)',
      label: 'App Version',
      type: 'value',
      value: `v${APP_VERSION} (${BUILD_NUMBER})`,
    },
    {
      id: 'rate',
      emoji: '⭐',
      iconBg: 'rgba(249,115,22,0.1)',
      label: 'Rate Moniqo',
      type: 'chevron',
      onPress: () =>
        Alert.alert('Rate Us', 'Thank you! Redirecting to App Store.'),
    },
    {
      id: 'share',
      emoji: '🚀',
      iconBg: 'rgba(34,197,94,0.1)',
      label: 'Share with Friends',
      type: 'chevron',
      onPress: () => Alert.alert('Share', 'Share sheet coming soon.'),
    },
    {
      id: 'feedback',
      emoji: '💬',
      iconBg: 'rgba(59,130,246,0.1)',
      label: 'Send Feedback',
      type: 'chevron',
      onPress: () => Alert.alert('Feedback', 'Opens mail composer.'),
    },
  ];

  const dangerRows: SettingRowData[] = [
    {
      id: 'signout',
      emoji: '🚪',
      iconBg: 'rgba(239,68,68,0.08)',
      label: 'Sign Out',
      type: 'chevron',
      destructive: true,
      onPress: () =>
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
              } catch {
                Alert.alert(
                  'Sign Out Failed',
                  'Something went wrong. Please try again.',
                );
              }
            },
          },
        ]),
    },
    {
      id: 'deleteaccount',
      emoji: '🚫',
      iconBg: 'rgba(239,68,68,0.08)',
      label: 'Delete Account',
      type: 'chevron',
      destructive: true,
      onPress: () =>
        Alert.alert(
          'Delete Account',
          'This will permanently delete all your data. This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: handleDeleteAccount },
          ],
        ),
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <ScreenHeader title="Settings" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile */}
        <ProfileCard />

        {/* Premium */}
        <View style={styles.groupSpacing} />
        <PremiumBanner onUpgradePress={onUpgradePress} />

        {/* Categories */}
        <View style={styles.groupSpacing} />
        <CategoryManager />

        {/* General */}
        <View style={styles.groupSpacing} />
        <SettingGroup title="General" rows={generalRows} />

        {/* Notifications */}
        <View style={styles.groupSpacing} />
        <SettingGroup title="Notifications" rows={notificationRows} />

        {/* Appearance */}
        <View style={styles.groupSpacing} />
        <SettingGroup title="Appearance" rows={appearanceRows} />

        {/* Security */}
        <View style={styles.groupSpacing} />
        <SettingGroup title="Security" rows={securityRows} />

        {/* Data & Privacy */}
        <View style={styles.groupSpacing} />
        <SettingGroup title="Data & Privacy" rows={dataRows} />

        {/* About */}
        <View style={styles.groupSpacing} />
        <SettingGroup title="About" rows={aboutRows} />

        {/* Account */}
        <View style={styles.groupSpacing} />
        <SettingGroup title="Account" rows={dangerRows} />

        <View style={styles.groupSpacing} />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
