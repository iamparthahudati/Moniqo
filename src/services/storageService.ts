import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'moniqo-storage' });

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  USER_PHONE: 'user_phone',
  MEMBERSHIP: 'membership',
} as const;

export const StorageService = {
  setTokens(accessToken: string, refreshToken: string) {
    storage.set(KEYS.ACCESS_TOKEN, accessToken);
    storage.set(KEYS.REFRESH_TOKEN, refreshToken);
  },

  getAccessToken(): string | undefined {
    return storage.getString(KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | undefined {
    return storage.getString(KEYS.REFRESH_TOKEN);
  },

  setUser(userId: string, phone: string, membership: string) {
    storage.set(KEYS.USER_ID, userId);
    storage.set(KEYS.USER_PHONE, phone);
    storage.set(KEYS.MEMBERSHIP, membership);
  },

  getUserId(): string | undefined {
    return storage.getString(KEYS.USER_ID);
  },

  getUserPhone(): string | undefined {
    return storage.getString(KEYS.USER_PHONE);
  },

  getMembership(): string | undefined {
    return storage.getString(KEYS.MEMBERSHIP);
  },

  clearAll() {
    storage.delete(KEYS.ACCESS_TOKEN);
    storage.delete(KEYS.REFRESH_TOKEN);
    storage.delete(KEYS.USER_ID);
    storage.delete(KEYS.USER_PHONE);
    storage.delete(KEYS.MEMBERSHIP);
  },

  isLoggedIn(): boolean {
    return !!storage.getString(KEYS.ACCESS_TOKEN);
  },
};
