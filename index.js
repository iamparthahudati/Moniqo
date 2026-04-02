/**
 * @format
 */

import notifee from '@notifee/react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Enable Crashlytics crash collection
crashlytics().setCrashlyticsCollectionEnabled(true);

// Register Notifee background event handler
notifee.onBackgroundEvent(async () => {
  // Background notification events handled here if needed in future
});

AppRegistry.registerComponent(appName, () => App);
