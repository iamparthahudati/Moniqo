import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './SettingsScreen.styles';

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>App preferences and account settings.</Text>
    </View>
  );
};

export default SettingsScreen;
