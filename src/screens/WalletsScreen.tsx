import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './WalletsScreen.styles';

const WalletsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallets</Text>
      <Text style={styles.subtitle}>
        Manage your linked accounts and wallets here.
      </Text>
    </View>
  );
};

export default WalletsScreen;
