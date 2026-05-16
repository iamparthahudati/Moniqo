import { open, DB } from '@op-engineering/op-sqlite';

let _db: DB | null = null;

export function getDb(): DB {
  if (!_db) {
    _db = open({ name: 'moniqo.db' });
  }
  return _db;
}
