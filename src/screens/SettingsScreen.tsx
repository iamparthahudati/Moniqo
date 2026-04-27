import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import CategoryManager from '../components/settings/CategoryManager';
import PremiumBanner from '../components/settings/PremiumBanner';
import ProfileCard from '../components/settings/ProfileCard';
import {
  SettingGroup,
  SettingRowData,
} from '../components/settings/SettingRow';
import ScreenHeader from '../components/ui/ScreenHeader';
import useNotifications from '../hooks/useNotifications';
import { useToggle } from '../hooks/useToggle';
import { signOut } from '../services/authService';
import { styles } from './SettingsScreen.styles';

// ── Settings screen ───────────────────────────────────────────────────────────

interface SettingsScreenProps {
  onUpgradePress: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onUpgradePress }) => {
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

  // ── Row definitions ─────────────────────────────────────────────────────────

  const generalRows: SettingRowData[] = [
    {
      id: 'currency',
      emoji: '\uD83D\uDCB1',
      iconBg: 'rgba(43,63,232,0.1)',
      label: 'Default Currency',
      type: 'value',
      value: 'INR \u20B9',
      onPress: () => Alert.alert('Currency', 'Currency selection coming soon.'),
    },
    {
      id: 'language',
      emoji: '\uD83C\uDF0D',
      iconBg: 'rgba(59,130,246,0.1)',
      label: 'Language',
      type: 'value',
      value: 'English',
      onPress: () => Alert.alert('Language', 'Language selection coming soon.'),
    },
    {
      id: 'startweek',
      emoji: '\uD83D\uDCC5',
      iconBg: 'rgba(139,92,246,0.1)',
      label: 'Week Starts On',
      type: 'value',
      value: 'Monday',
      onPress: () =>
        Alert.alert('Week Start', 'Week start day selection coming soon.'),
    },
    {
      id: 'dateformat',
      emoji: '\uD83D\uDD52',
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
      emoji: '\uD83D\uDD14',
      iconBg: 'rgba(34,197,94,0.1)',
      label: 'Transaction Alerts',
      type: 'toggle',
      toggleValue: txAlerts,
      onToggle: handleTxAlerts,
    },
    {
      id: 'monthly',
      emoji: '\uD83D\uDCCA',
      iconBg: 'rgba(43,63,232,0.1)',
      label: 'Monthly Report',
      type: 'toggle',
      toggleValue: monthlyReport,
      onToggle: handleMonthlyReport,
    },
    {
      id: 'budget',
      emoji: '\u26A0\uFE0F',
      iconBg: 'rgba(239,68,68,0.1)',
      label: 'Budget Warnings',
      type: 'toggle',
      toggleValue: budgetWarnings,
      onToggle: handleBudgetWarnings,
    },
    {
      id: 'weekly',
      emoji: '\uD83D\uDCF0',
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
      emoji: '\uD83C\uDF19',
      iconBg: 'rgba(15,23,42,0.08)',
      label: 'Theme',
      type: 'value',
      value: 'Light',
      onPress: () => Alert.alert('Theme', 'Dark mode coming soon.'),
    },
    {
      id: 'appicon',
      emoji: '\uD83C\uDFA8',
      iconBg: 'rgba(139,92,246,0.1)',
      label: 'App Icon',
      type: 'chevron',
      onPress: () => Alert.alert('App Icon', 'Custom app icons coming soon.'),
    },
    {
      id: 'haptics',
      emoji: '\uD83D\uDCF3',
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
      emoji: '\uD83D\uDC41\uFE0F',
      iconBg: 'rgba(43,63,232,0.1)',
      label: 'Face ID / Biometrics',
      type: 'value',
      value: 'Off',
      onPress: () => Alert.alert('Biometrics', 'Biometric lock coming soon.'),
    },
    {
      id: 'passcode',
      emoji: '\uD83D\uDD10',
      iconBg: 'rgba(249,115,22,0.1)',
      label: 'App Passcode',
      type: 'chevron',
      onPress: () => Alert.alert('Passcode', 'Passcode setup coming soon.'),
    },
  ];

  const dataRows: SettingRowData[] = [
    {
      id: 'export',
      emoji: '\uD83D\uDCE4',
      iconBg: 'rgba(34,197,94,0.1)',
      label: 'Export Data',
      type: 'chevron',
      onPress: () => Alert.alert('Export', 'Data export coming soon.'),
    },
    {
      id: 'backup',
      emoji: '\u2601\uFE0F',
      iconBg: 'rgba(59,130,246,0.1)',
      label: 'Backup & Restore',
      type: 'chevron',
      onPress: () => Alert.alert('Backup', 'Backup & restore coming soon.'),
    },
    {
      id: 'cache',
      emoji: '\uD83D\uDDD1\uFE0F',
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
      emoji: '\uD83D\uDEE1\uFE0F',
      iconBg: 'rgba(43,63,232,0.1)',
      label: 'Privacy Policy',
      type: 'chevron',
      onPress: () => Alert.alert('Privacy Policy', 'Opens in browser.'),
    },
    {
      id: 'terms',
      emoji: '\uD83D\uDCDC',
      iconBg: 'rgba(139,92,246,0.1)',
      label: 'Terms of Service',
      type: 'chevron',
      onPress: () => Alert.alert('Terms', 'Opens in browser.'),
    },
  ];

  const aboutRows: SettingRowData[] = [
    {
      id: 'version',
      emoji: '\uD83D\uDCF1',
      iconBg: 'rgba(148,163,184,0.15)',
      label: 'App Version',
      type: 'value',
      value: '1.0.0',
    },
    {
      id: 'rate',
      emoji: '\u2B50',
      iconBg: 'rgba(249,115,22,0.1)',
      label: 'Rate Moniqo',
      type: 'chevron',
      onPress: () =>
        Alert.alert('Rate Us', 'Thank you! Redirecting to App Store.'),
    },
    {
      id: 'share',
      emoji: '\uD83D\uDE80',
      iconBg: 'rgba(34,197,94,0.1)',
      label: 'Share with Friends',
      type: 'chevron',
      onPress: () => Alert.alert('Share', 'Share sheet coming soon.'),
    },
    {
      id: 'feedback',
      emoji: '\uD83D\uDCAC',
      iconBg: 'rgba(59,130,246,0.1)',
      label: 'Send Feedback',
      type: 'chevron',
      onPress: () => Alert.alert('Feedback', 'Opens mail composer.'),
    },
  ];

  const dangerRows: SettingRowData[] = [
    {
      id: 'signout',
      emoji: '\uD83D\uDEAA',
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
      emoji: '\uD83D\uDEAB',
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
            { text: 'Delete', style: 'destructive', onPress: () => {} },
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
