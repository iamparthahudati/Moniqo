import apiClient from './apiClient';
import type { ApiBankAccount, ApiCardAccount, ApiCashEntry, ApiInvestment } from './accountsApiService';
import type { ApiTransaction } from './transactionsApiService';
import type { ApiCategory } from './categoriesApiService';
import type { ApiBudget } from './budgetsApiService';
import type { UserProfile } from './userApiService';

export interface SyncPushPayload {
  accounts_bank: ApiBankAccount[];
  accounts_card: ApiCardAccount[];
  accounts_cash: ApiCashEntry[];
  accounts_investment: ApiInvestment[];
  transactions: ApiTransaction[];
  categories: ApiCategory[];
  budgets: ApiBudget[];
}

export interface SyncPullResponse {
  user: UserProfile;
  accounts_bank: ApiBankAccount[];
  accounts_card: ApiCardAccount[];
  accounts_cash: ApiCashEntry[];
  accounts_investment: ApiInvestment[];
  transactions: ApiTransaction[];
  categories: ApiCategory[];
  budgets: ApiBudget[];
}

export const SyncApiService = {
  // Called once when a free user upgrades to premium — uploads all local SQLite data to cloud
  async push(payload: SyncPushPayload): Promise<{ synced_at: number }> {
    const { data } = await apiClient.post<{ success: boolean; data: { synced_at: number } }>(
      '/sync/push',
      payload,
    );
    return data.data;
  },

  // Called on new device install — downloads all cloud data to restore into SQLite
  async pull(): Promise<SyncPullResponse> {
    const { data } = await apiClient.get<{ success: boolean; data: SyncPullResponse }>('/sync/pull');
    return data.data;
  },
};
