import { GoogleSignin } from '@react-native-google-signin/google-signin';
import apiClient from './apiClient';
import { StorageService } from './storageService';

export interface GoogleAuthUser {
  id: string;
  email: string | null;
  display_name: string;
  membership: 'free' | 'premium_lite' | 'premium_full';
}

export const GoogleAuthApiService = {
  configure(): void {
    GoogleSignin.configure({
      webClientId: '377396948837-6oarsnto4b0hmfguns16t6k89ce71kr7.apps.googleusercontent.com',
      iosClientId: '377396948837-rbeffu8kfs4bvh3276iplp7m8q15g0d8.apps.googleusercontent.com',
    });
  },

  async signIn(): Promise<GoogleAuthUser> {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const result = await GoogleSignin.signIn();
    const idToken = result.data?.idToken ?? (result as any).idToken;
    if (!idToken) throw new Error('Google Sign-In failed: no ID token returned.');

    const displayName = result.data?.user?.name ?? '';

    const { data } = await apiClient.post<{
      success: boolean;
      data: { access_token: string; refresh_token: string; user: GoogleAuthUser };
    }>('/auth/google', { id_token: idToken, display_name: displayName });

    const { access_token, refresh_token, user } = data.data;

    StorageService.setTokens(access_token, refresh_token);
    StorageService.setUser(user.id, user.email ?? '', user.membership);

    return user;
  },

  async signOut(): Promise<void> {
    try {
      await apiClient.delete('/auth/logout');
    } finally {
      StorageService.clearAll();
      try {
        await GoogleSignin.signOut();
      } catch {
        // best-effort
      }
    }
  },

  isSignedIn(): boolean {
    return StorageService.isLoggedIn();
  },
};
