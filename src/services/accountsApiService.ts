import apiClient from './apiClient';

// API response shapes (snake_case from PHP backend)
export interface ApiBankAccount {
  id: string;
  bank_name: string;
  account_type: string;
  balance: number;
  color: string;
  icon: 'bank' | 'piggy';
  status: 'ACTIVE' | 'INACTIVE';
  note?: string;
  created_at: number;
}

export interface ApiCardAccount {
  id: string;
  card_name: string;
  card_type: string;
  due_amount: number;
  due_label: string;
  color: string;
  note?: string;
  created_at: number;
}

export interface ApiCashEntry {
  id: string;
  label: string;
  sublabel: string;
  amount: number;
  created_at: number;
}

export interface ApiInvestment {
  id: string;
  name: string;
  amount: number;
  icon: 'trend' | 'bitcoin' | 'gold' | 'other';
  color: string;
  note?: string;
  created_at: number;
}

// POST/PUT payloads
export interface CreateBankPayload {
  bank_name: string;
  account_type: string;
  balance: number;
  color: string;
  icon: 'bank' | 'piggy';
  status: 'ACTIVE' | 'INACTIVE';
  note?: string;
}

export interface CreateCardPayload {
  card_name: string;
  card_type: string;
  due_amount: number;
  due_label: string;
  color: string;
  note?: string;
}

export interface CreateCashPayload {
  label: string;
  sublabel: string;
  amount: number;
}

export interface CreateInvestmentPayload {
  name: string;
  amount: number;
  icon: 'trend' | 'bitcoin' | 'gold' | 'other';
  color: string;
  note?: string;
}

type List<T> = { success: boolean; data: T[] };
type Single<T> = { success: boolean; data: T };

export const AccountsApiService = {
  // ── Bank ──────────────────────────────────────────────────────────────────

  async getBankAccounts(): Promise<ApiBankAccount[]> {
    const { data } = await apiClient.get<List<ApiBankAccount>>('/accounts/bank');
    return data.data;
  },

  async createBankAccount(payload: CreateBankPayload): Promise<ApiBankAccount> {
    const { data } = await apiClient.post<Single<ApiBankAccount>>('/accounts/bank', payload);
    return data.data;
  },

  async updateBankAccount(id: string, payload: Partial<CreateBankPayload>): Promise<ApiBankAccount> {
    const { data } = await apiClient.put<Single<ApiBankAccount>>(`/accounts/bank/${id}`, payload);
    return data.data;
  },

  async deleteBankAccount(id: string): Promise<void> {
    await apiClient.delete(`/accounts/bank/${id}`);
  },

  // ── Card ──────────────────────────────────────────────────────────────────

  async getCardAccounts(): Promise<ApiCardAccount[]> {
    const { data } = await apiClient.get<List<ApiCardAccount>>('/accounts/card');
    return data.data;
  },

  async createCardAccount(payload: CreateCardPayload): Promise<ApiCardAccount> {
    const { data } = await apiClient.post<Single<ApiCardAccount>>('/accounts/card', payload);
    return data.data;
  },

  async updateCardAccount(id: string, payload: Partial<CreateCardPayload>): Promise<ApiCardAccount> {
    const { data } = await apiClient.put<Single<ApiCardAccount>>(`/accounts/card/${id}`, payload);
    return data.data;
  },

  async deleteCardAccount(id: string): Promise<void> {
    await apiClient.delete(`/accounts/card/${id}`);
  },

  // ── Cash ──────────────────────────────────────────────────────────────────

  async getCashEntries(): Promise<ApiCashEntry[]> {
    const { data } = await apiClient.get<List<ApiCashEntry>>('/accounts/cash');
    return data.data;
  },

  async createCashEntry(payload: CreateCashPayload): Promise<ApiCashEntry> {
    const { data } = await apiClient.post<Single<ApiCashEntry>>('/accounts/cash', payload);
    return data.data;
  },

  async updateCashEntry(id: string, payload: Partial<CreateCashPayload>): Promise<ApiCashEntry> {
    const { data } = await apiClient.put<Single<ApiCashEntry>>(`/accounts/cash/${id}`, payload);
    return data.data;
  },

  async deleteCashEntry(id: string): Promise<void> {
    await apiClient.delete(`/accounts/cash/${id}`);
  },

  // ── Investment ────────────────────────────────────────────────────────────

  async getInvestments(): Promise<ApiInvestment[]> {
    const { data } = await apiClient.get<List<ApiInvestment>>('/accounts/investment');
    return data.data;
  },

  async createInvestment(payload: CreateInvestmentPayload): Promise<ApiInvestment> {
    const { data } = await apiClient.post<Single<ApiInvestment>>('/accounts/investment', payload);
    return data.data;
  },

  async updateInvestment(id: string, payload: Partial<CreateInvestmentPayload>): Promise<ApiInvestment> {
    const { data } = await apiClient.put<Single<ApiInvestment>>(`/accounts/investment/${id}`, payload);
    return data.data;
  },

  async deleteInvestment(id: string): Promise<void> {
    await apiClient.delete(`/accounts/investment/${id}`);
  },
};
