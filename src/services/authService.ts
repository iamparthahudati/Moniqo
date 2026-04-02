import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function configureGoogleSignIn(): void {
  GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID', // from Firebase Console → Project Settings → Web client OAuth ID
    iosClientId:
      '377396948837-rbeffu8kfs4bvh3276iplp7m8q15g0d8.apps.googleusercontent.com',
  });
}

export async function signInWithGoogle(): Promise<FirebaseAuthTypes.User> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const signInResult = await GoogleSignin.signIn();
  const idToken = signInResult.data?.idToken ?? (signInResult as any).idToken;
  if (!idToken) {
    throw new Error('Google Sign-In failed: no ID token returned.');
  }
  const credential = auth.GoogleAuthProvider.credential(idToken);
  const userCredential = await auth().signInWithCredential(credential);
  return userCredential.user;
}

export async function sendOtp(
  phoneNumber: string,
): Promise<FirebaseAuthTypes.ConfirmationResult> {
  return auth().signInWithPhoneNumber(phoneNumber);
}

export async function confirmOtp(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string,
): Promise<FirebaseAuthTypes.User> {
  const result = await confirmation.confirm(code);
  return result!.user;
}

export async function signOut(): Promise<void> {
  await auth().signOut();
  try {
    await GoogleSignin.signOut();
  } catch {
    // Google sign-out is best-effort; Firebase session is already cleared
  }
}

export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return auth().currentUser;
}
