import apiClient from './apiClient';
import { StorageService } from './storageService';

export interface AuthUser {
  id: string;
  phone: string;
  display_name: string;
  email?: string;
  membership: 'free' | 'premium_lite' | 'premium_full';
  membership_expiry?: number; // Unix seconds, null if no paid plan
  trial_used: boolean;
  trial_expiry?: number;      // Unix seconds, null if no trial
  referral_code: string;
  referred_by?: string;
  created_at: number;         // Unix milliseconds
}

export interface VerifyOtpResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export const AuthApiService = {
  async sendOtp(phone: string): Promise<void> {
    await apiClient.post('/auth/send-otp', { phone });
  },

  async verifyOtp(phone: string, otp: string): Promise<AuthUser> {
    const { data } = await apiClient.post<{ success: boolean; data: { access_token: string; refresh_token: string; user: AuthUser } }>(
      '/auth/verify-otp',
      { phone, otp },
    );
    StorageService.setTokens(data.data.access_token, data.data.refresh_token);
    StorageService.setUser(data.data.user.id, data.data.user.phone, data.data.user.membership);
    return data.data.user;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.delete('/auth/logout');
    } finally {
      StorageService.clearAll();
    }
  },

  async getProfile(): Promise<AuthUser> {
    const { data } = await apiClient.get<{ success: boolean; data: AuthUser }>('/user/profile');
    return data.data;
  },
};
