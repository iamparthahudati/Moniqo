import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

/**
 * Log a screen view event. Call this whenever the active screen changes.
 */
export async function logScreenView(screenName: string): Promise<void> {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
}

/**
 * Log a custom event with optional parameters.
 */
export async function logEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): Promise<void> {
  try {
    await analytics().logEvent(name, params);
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
}

// ---------------------------------------------------------------------------
// Crashlytics
// ---------------------------------------------------------------------------

/**
 * Record a non-fatal error to Crashlytics.
 */
export function recordError(error: Error, context?: string): void {
  if (context) {
    crashlytics().log(context);
  }
  crashlytics().recordError(error);
}

/**
 * Log a plain message to the Crashlytics log (visible in crash reports).
 */
export function logMessage(message: string): void {
  crashlytics().log(message);
}

/**
 * Set a user identifier so crashes can be associated with a specific user.
 * Do NOT pass PII — use an internal user ID only.
 */
export async function setUserId(userId: string): Promise<void> {
  try {
    await Promise.all([
      crashlytics().setUserId(userId),
      analytics().setUserId(userId),
    ]);
  } catch (error) {
    crashlytics().recordError(error as Error);
  }
}

/**
 * Set a custom key/value attribute on Crashlytics reports.
 */
export function setAttribute(key: string, value: string): void {
  crashlytics().setAttribute(key, value);
}
