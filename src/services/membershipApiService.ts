import apiClient from './apiClient';
import { StorageService } from './storageService';

export type MembershipSku =
  | 'moniqo_lite_monthly'
  | 'moniqo_lite_annual'
  | 'moniqo_full_monthly'
  | 'moniqo_full_annual'
  | 'moniqo_full_lifetime';

export type MembershipTier = 'free' | 'premium_lite' | 'premium_full';

export interface UpgradeResult {
  membership: MembershipTier;
  expiry?: number;
}

export interface ReferralResult {
  reward_days: number;
}

export const MembershipApiService = {
  async upgrade(sku: MembershipSku, purchaseToken: string): Promise<UpgradeResult> {
    const { data } = await apiClient.post<{ success: boolean; data: UpgradeResult }>(
      '/membership/upgrade',
      { sku, purchase_token: purchaseToken },
    );
    // Keep MMKV in sync so the app reflects the new tier immediately
    const userId = StorageService.getUserId() ?? '';
    const phone  = StorageService.getUserPhone() ?? '';
    StorageService.setUser(userId, phone, data.data.membership);
    return data.data;
  },

  async applyReferral(referralCode: string): Promise<ReferralResult> {
    const { data } = await apiClient.post<{ success: boolean; data: ReferralResult }>(
      '/membership/referral',
      { referral_code: referralCode },
    );
    return data.data;
  },
};
