import apiClient from './apiClient';
import { AppCategory } from '../types';

export interface ApiCategory {
  id: string;
  name: string;
  emoji: string;
  type: 'expense' | 'income';
  color: string;
  is_default: boolean;
  sort_order: number;
  created_at: number;
}

export const CategoriesApiService = {
  async getCategories(): Promise<ApiCategory[]> {
    const { data } = await apiClient.get<{ success: boolean; data: ApiCategory[] }>('/categories');
    return data.data;
  },

  async createCategory(cat: AppCategory): Promise<void> {
    await apiClient.post('/categories', {
      id:         cat.id,
      name:       cat.name,
      emoji:      cat.emoji,
      type:       cat.type,
      color:      cat.color,
      is_default: cat.isDefault ? 1 : 0,
      sort_order: cat.sortOrder,
      created_at: cat.created_at,
    });
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
