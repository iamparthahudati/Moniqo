import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './AnalyticsScreen.styles';

const AnalyticsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>
        Charts and spending insights coming soon.
      </Text>
    </View>
  );
};

export default AnalyticsScreen;
