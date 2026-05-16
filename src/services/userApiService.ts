import apiClient from './apiClient';
import { StorageService } from './storageService';

export interface UserProfile {
  id: string;
  phone: string;
  display_name: string;
  email?: string;
  membership: 'free' | 'premium_lite' | 'premium_full';
  membership_expiry?: number;
  trial_used: boolean;
  trial_expiry?: number;
  referral_code: string;
  referred_by?: string;
  created_at: number;
}

export interface UpdateProfilePayload {
  display_name?: string;
  email?: string;
}

export const UserApiService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get<{ success: boolean; data: UserProfile }>('/user/profile');
    return data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const { data } = await apiClient.put<{ success: boolean; user: UserProfile }>('/user/profile', payload);
    return data.user;
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete('/user/account');
    StorageService.clearAll();
  },
};
