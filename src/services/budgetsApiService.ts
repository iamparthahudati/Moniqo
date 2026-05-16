import apiClient from './apiClient';

export interface ApiBudget {
  id: string;
  category_id: string;
  amount: number;
  period: 'monthly';
  created_at: number;
}

export interface UpsertBudgetPayload {
  category_id: string;
  amount: number;
  period: 'monthly';
}

export const BudgetsApiService = {
  async getBudgets(): Promise<ApiBudget[]> {
    const { data } = await apiClient.get<{ success: boolean; data: ApiBudget[] }>('/budgets');
    return data.data;
  },

  async upsertBudget(payload: UpsertBudgetPayload): Promise<ApiBudget> {
    const { data } = await apiClient.post<{ success: boolean; data: ApiBudget }>('/budgets', payload);
    return data.data;
  },

  async deleteBudget(id: string): Promise<void> {
    await apiClient.delete(`/budgets/${id}`);
  },
};
