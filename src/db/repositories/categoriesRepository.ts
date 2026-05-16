import { getDb } from '../database';
import { AppCategory } from '../../types';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const DEFAULT_CATEGORIES: Omit<AppCategory, 'id' | 'created_at'>[] = [
  { name: 'Food',          emoji: '🍔', type: 'expense', color: '#F97316', isDefault: true, sortOrder: 1 },
  { name: 'Shopping',      emoji: '🛍️', type: 'expense', color: '#8B5CF6', isDefault: true, sortOrder: 2 },
  { name: 'Transport',     emoji: '🚗', type: 'expense', color: '#3B82F6', isDefault: true, sortOrder: 3 },
  { name: 'Bills',         emoji: '📄', type: 'expense', color: '#EF4444', isDefault: true, sortOrder: 4 },
  { name: 'Health',        emoji: '💊', type: 'expense', color: '#22C55E', isDefault: true, sortOrder: 5 },
  { name: 'Entertainment', emoji: '🎬', type: 'expense', color: '#F59E0B', isDefault: true, sortOrder: 6 },
  { name: 'Utilities',     emoji: '💡', type: 'expense', color: '#06B6D4', isDefault: true, sortOrder: 7 },
  { name: 'Others',        emoji: '📦', type: 'expense', color: '#6B7280', isDefault: true, sortOrder: 8 },
  { name: 'Salary',        emoji: '💼', type: 'income',  color: '#22C55E', isDefault: true, sortOrder: 1 },
  { name: 'Freelance',     emoji: '💻', type: 'income',  color: '#3B82F6', isDefault: true, sortOrder: 2 },
  { name: 'Investment',    emoji: '📈', type: 'income',  color: '#F59E0B', isDefault: true, sortOrder: 3 },
  { name: 'Gift',          emoji: '🎁', type: 'income',  color: '#EC4899', isDefault: true, sortOrder: 4 },
  { name: 'Others',        emoji: '📦', type: 'income',  color: '#6B7280', isDefault: true, sortOrder: 5 },
];

export const CategoriesRepository = {
  init(): void {
    getDb().executeSync(`
      CREATE TABLE IF NOT EXISTS categories (
        id         TEXT    PRIMARY KEY,
        name       TEXT    NOT NULL,
        emoji      TEXT    NOT NULL,
        type       TEXT    NOT NULL CHECK(type IN ('expense','income')),
        color      TEXT    NOT NULL,
        is_default INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `);
  },

  isSeeded(): boolean {
    const result = getDb().executeSync(
      'SELECT COUNT(*) as count FROM categories WHERE is_default = 1',
    );
    return ((result.rows[0]?.count as number) ?? 0) > 0;
  },

  seedDefaults(): void {
    const now = Date.now();
    const db = getDb();
    for (const cat of DEFAULT_CATEGORIES) {
      db.executeSync(
        'INSERT OR IGNORE INTO categories (id, name, emoji, type, color, is_default, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [generateId(), cat.name, cat.emoji, cat.type, cat.color, 1, cat.sortOrder, now],
      );
    }
  },

  getAll(): AppCategory[] {
    const result = getDb().executeSync(
      'SELECT * FROM categories ORDER BY type ASC, sort_order ASC, created_at ASC',
    );
    return result.rows.map(row => ({
      id:        row.id as string,
      name:      row.name as string,
      emoji:     row.emoji as string,
      type:      row.type as 'expense' | 'income',
      color:     row.color as string,
      isDefault: Boolean(row.is_default),
      sortOrder: row.sort_order as number,
      created_at: row.created_at as number,
    }));
  },

  insert(cat: AppCategory): void {
    getDb().executeSync(
      'INSERT OR IGNORE INTO categories (id, name, emoji, type, color, is_default, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [cat.id, cat.name, cat.emoji, cat.type, cat.color, cat.isDefault ? 1 : 0, cat.sortOrder, cat.created_at],
    );
  },

  delete(id: string): void {
    getDb().executeSync(
      'DELETE FROM categories WHERE id = ? AND is_default = 0',
      [id],
    );
  },
};
