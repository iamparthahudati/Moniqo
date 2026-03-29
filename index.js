/**
 * @format
 */

import crashlytics from '@react-native-firebase/crashlytics';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Enable Crashlytics auto crash collection
crashlytics().setCrashlyticsCollectionEnabled(true);

AppRegistry.registerComponent(appName, () => App);
