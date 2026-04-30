import { SQLBatchTuple } from '@op-engineering/op-sqlite';
import { AppCategory } from '../../types';
import { db } from '../database';

export type { AppCategory };

const DEFAULT_CATEGORIES: Omit<AppCategory, 'created_at'>[] = [
  {
    id: 'e1',
    name: 'Food',
    emoji: '🍴',
    type: 'expense',
    color: '#EF4444',
    isDefault: true,
    sortOrder: 0,
  },
  {
    id: 'e2',
    name: 'Shopping',
    emoji: '🛒',
    type: 'expense',
    color: '#3B82F6',
    isDefault: true,
    sortOrder: 1,
  },
  {
    id: 'e3',
    name: 'Transport',
    emoji: '🚗',
    type: 'expense',
    color: '#F97316',
    isDefault: true,
    sortOrder: 2,
  },
  {
    id: 'e4',
    name: 'Bills',
    emoji: '🧾',
    type: 'expense',
    color: '#8B5CF6',
    isDefault: true,
    sortOrder: 3,
  },
  {
    id: 'e5',
    name: 'Health',
    emoji: '🏥',
    type: 'expense',
    color: '#14B8A6',
    isDefault: true,
    sortOrder: 4,
  },
  {
    id: 'e6',
    name: 'Entertainment',
    emoji: '🎫',
    type: 'expense',
    color: '#EC4899',
    isDefault: true,
    sortOrder: 5,
  },
  {
    id: 'e7',
    name: 'Utilities',
    emoji: '⚡',
    type: 'expense',
    color: '#F59E0B',
    isDefault: true,
    sortOrder: 6,
  },
  {
    id: 'e8',
    name: 'Others',
    emoji: '📋',
    type: 'expense',
    color: '#94A3B8',
    isDefault: true,
    sortOrder: 7,
  },
  {
    id: 'i1',
    name: 'Salary',
    emoji: '💰',
    type: 'income',
    color: '#22C55E',
    isDefault: true,
    sortOrder: 0,
  },
  {
    id: 'i2',
    name: 'Freelance',
    emoji: '💻',
    type: 'income',
    color: '#3B82F6',
    isDefault: true,
    sortOrder: 1,
  },
  {
    id: 'i3',
    name: 'Investment',
    emoji: '📈',
    type: 'income',
    color: '#8B5CF6',
    isDefault: true,
    sortOrder: 2,
  },
  {
    id: 'i4',
    name: 'Gift',
    emoji: '🎁',
    type: 'income',
    color: '#EC4899',
    isDefault: true,
    sortOrder: 3,
  },
  {
    id: 'i5',
    name: 'Others',
    emoji: '📋',
    type: 'income',
    color: '#94A3B8',
    isDefault: true,
    sortOrder: 4,
  },
];

export function mapRow(row: Record<string, unknown>): AppCategory {
  return {
    id: row.id as string,
    name: row.name as string,
    emoji: row.emoji as string,
    type: row.type as 'expense' | 'income',
    color: row.color as string,
    isDefault: (row.is_default as number) === 1,
    sortOrder: row.sort_order as number,
    created_at: row.created_at as number,
  };
}

export function getAllCategories(): AppCategory[] {
  const result = db.executeSync(
    'SELECT * FROM categories ORDER BY sort_order ASC',
  );
  return ((result.rows ?? []) as any[]).map(mapRow);
}

export function insertCategory(cat: AppCategory): void {
  db.executeSync(
    `INSERT INTO categories (id, name, emoji, type, color, is_default, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cat.id,
      cat.name,
      cat.emoji,
      cat.type,
      cat.color,
      cat.isDefault ? 1 : 0,
      cat.sortOrder,
      cat.created_at,
    ],
  );
}

export function deleteCategory(id: string): void {
  db.executeSync('DELETE FROM categories WHERE id = ? AND is_default = 0', [
    id,
  ]);
}

export function seedCategoriesIfEmpty(): void {
  const result = db.executeSync('SELECT COUNT(*) AS count FROM categories');
  const count = ((result.rows as any[])?.[0]?.count as number) ?? 0;

  if (count > 0) {
    return;
  }

  const now = Date.now();

  const commands: SQLBatchTuple[] = DEFAULT_CATEGORIES.map(cat => [
    `INSERT INTO categories (id, name, emoji, type, color, is_default, sort_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [cat.id, cat.name, cat.emoji, cat.type, cat.color, 1, cat.sortOrder, now],
  ]);

  db.executeBatch(commands).catch(error => {
    console.error('[seedCategoriesIfEmpty] Failed to seed categories:', error);
  });
}
