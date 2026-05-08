import MobileAds, {
  AdsConsent,
  AdsConsentDebugGeography,
  AdsConsentStatus,
  RequestConfiguration,
} from 'react-native-google-mobile-ads';

async function requestConsentIfRequired(): Promise<void> {
  const params = __DEV__
    ? {
        debugGeography: AdsConsentDebugGeography.EEA,
        testDeviceIdentifiers: ['EMULATOR'],
      }
    : undefined;

  const info = await AdsConsent.requestInfoUpdate(params);

  if (
    info.isConsentFormAvailable &&
    info.status === AdsConsentStatus.REQUIRED
  ) {
    await AdsConsent.showForm();
  }
}

export async function initializeAds(): Promise<void> {
  try {
    await requestConsentIfRequired();
  } catch {
    // Consent flow failed — proceed anyway so the SDK always initializes.
    // Ads may be non-personalized or limited, but will still load.
  }

  const config: RequestConfiguration = __DEV__
    ? { testDeviceIdentifiers: ['EMULATOR'] }
    : {};

  await MobileAds().setRequestConfiguration(config);
  await MobileAds().initialize();
}
