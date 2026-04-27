# Firebase Setup — Action Required (Your Side)

These are the manual steps only you can do — they require access to Firebase Console and Apple/Google developer accounts.

---

## 1. Google Sign-In — Web Client ID (CRITICAL — breaks Google login)

**File:** `src/services/authService.ts`

```ts
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // ← replace this
  iosClientId:
    '377396948837-rbeffu8kfs4bvh3276iplp7m8q15g0d8.apps.googleusercontent.com',
});
```

**Steps:**

1. Go to Firebase Console → your project → Project Settings → General
2. Scroll to "Your apps" → find the Web app (or create one if missing)
3. Copy the Web client ID — looks like: `XXXXXXXXX-XXXX.apps.googleusercontent.com`
4. Replace `'YOUR_WEB_CLIENT_ID'` with it in `src/services/authService.ts`

---

## 2. Firebase Phone Auth — Enable in Console

**Steps:**

1. Firebase Console → Authentication → Sign-in method
2. Enable **Phone** provider
3. Enable **Google** provider
4. For testing: add your phone number to the "Phone numbers for testing" list
   - This avoids real SMS during development and bypasses reCAPTCHA

---

## 3. Android — SHA-1 / SHA-256 Fingerprints

Google Sign-In on Android requires your debug and release SHA fingerprints registered in Firebase.

**Get debug SHA-1:**

```bash
cd android && ./gradlew signingReport
```

Look for the `debug` variant SHA1 and SHA-256.

**Steps:**

1. Firebase Console → Project Settings → General → Your Android app
2. Click "Add fingerprint"
3. Add both SHA-1 and SHA-256 from the debug keystore
4. Download the updated `google-services.json` and replace `android/app/google-services.json`

---

## 4. iOS — URL Scheme Verification

Already set in `Info.plist`:

```
com.googleusercontent.apps.377396948837-rbeffu8kfs4bvh3276iplp7m8q15g0d8
```

This matches the `iosClientId` in `authService.ts` — no action needed unless you change the iOS client.

---

## 5. Firestore — Enable & Set Security Rules

**Steps:**

1. Firebase Console → Firestore Database → Create database
2. Start in **production mode**
3. Go to Rules tab and paste:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

4. Publish the rules

---

## 6. Firestore — Add to Firebase Package (Code side — already handled)

`@react-native-firebase/firestore` needs to be installed. This will be done in code — just make sure to run after:

```bash
# iOS
cd ios && pod install

# Android
# gradle sync happens automatically on build
```

---

## 7. Apple Sign-In (Optional — required for App Store)

If you plan to submit to the App Store, Apple requires Sign in with Apple when any third-party login is offered.

**Steps:**

1. Apple Developer Console → Certificates, Identifiers & Profiles → your App ID
2. Enable "Sign In with Apple" capability
3. In Xcode → your target → Signing & Capabilities → add "Sign In with Apple"
4. Install: `@invertase/react-native-apple-authentication`

This can be done later before App Store submission.

---

## Summary Checklist

| #   | Task                                              | Where                             | Status   |
| --- | ------------------------------------------------- | --------------------------------- | -------- |
| 1   | Replace `webClientId` in `authService.ts`         | Firebase Console → Web app        | Pending  |
| 2   | Enable Phone + Google auth providers              | Firebase Console → Authentication | Pending  |
| 3   | Add SHA-1 + SHA-256 fingerprints                  | Firebase Console → Android app    | Pending  |
| 4   | Download updated `google-services.json`           | Firebase Console → Android app    | Pending  |
| 5   | Create Firestore database + set rules             | Firebase Console → Firestore      | Pending  |
| 6   | Run `pod install` after Firestore package install | Terminal                          | Pending  |
| 7   | Apple Sign-In (before App Store only)             | Apple Developer + Xcode           | Optional |
