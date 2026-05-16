import apiClient from './apiClient';

export interface ApiTransaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  account_id?: string;
  account_type?: 'bank' | 'card' | 'cash' | 'investment';
  date: string;
  time: string;
  note?: string;
  created_at: number;
}

export interface TransactionFilters {
  date_from?: string;
  date_to?: string;
  account_id?: string;
  account_type?: 'bank' | 'card' | 'cash' | 'investment';
  category?: string;
  type?: 'income' | 'expense' | 'transfer';
  limit?: number;
  offset?: number;
}

export interface CreateTransactionPayload {
  title: string;
  subtitle: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  account_id?: string;
  account_type?: 'bank' | 'card' | 'cash' | 'investment';
  date: string;
  time: string;
  note?: string;
}

export const TransactionsApiService = {
  async getTransactions(filters?: TransactionFilters): Promise<{ data: ApiTransaction[]; total: number }> {
    const { data } = await apiClient.get<{ success: boolean; data: { data: ApiTransaction[]; total: number } }>(
      '/transactions',
      { params: filters },
    );
    return data.data;
  },

  async createTransaction(payload: CreateTransactionPayload): Promise<ApiTransaction> {
    const { data } = await apiClient.post<{ success: boolean; data: ApiTransaction }>('/transactions', payload);
    return data.data;
  },

  async updateTransaction(id: string, payload: Partial<CreateTransactionPayload>): Promise<ApiTransaction> {
    const { data } = await apiClient.put<{ success: boolean; data: ApiTransaction }>(`/transactions/${id}`, payload);
    return data.data;
  },

  async deleteTransaction(id: string): Promise<void> {
    await apiClient.delete(`/transactions/${id}`);
  },
};
