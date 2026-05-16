import apiClient from './apiClient';

export interface AppFeatures {
  auth: {
    sms_otp: boolean;
    google_login: boolean;
    apple_login: boolean;
  };
  premium: {
    cloud_sync: boolean;
  };
  ads: {
    enabled: boolean;
  };
}

// Sensible defaults — used if the API call fails (offline / first launch)
export const DEFAULT_FEATURES: AppFeatures = {
  auth: {
    sms_otp:      false,
    google_login: true,
    apple_login:  false,
  },
  premium: {
    cloud_sync: true,
  },
  ads: {
    enabled: true,
  },
};

export const FeaturesApiService = {
  async getFeatures(): Promise<AppFeatures> {
    try {
      const { data } = await apiClient.get<{ success: boolean; data: AppFeatures }>('/config/features');
      return data.data;
    } catch {
      return DEFAULT_FEATURES;
    }
  },
};
