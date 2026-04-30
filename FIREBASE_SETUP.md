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

**Why it's missing:** Your `google-services.json` has an empty `oauth_client: []` array.
This happens because no SHA-1 fingerprint has been added to the Android app in Firebase Console yet.
Google Sign-In on Android will not work until this is done.

**Steps:**

1. Get your debug SHA-1:

   ```bash
   cd android && ./gradlew signingReport
   ```

   Look for the `debug` variant SHA-1 and SHA-256.

2. Firebase Console → Project Settings → General → Your Android app → "Add fingerprint"
   Add both SHA-1 and SHA-256.

3. Download the updated `google-services.json` and replace `android/app/google-services.json`.
   The new file will have an `oauth_client` entry with a `client_type: 3` (web client).

4. Copy the `client_id` from that entry — it looks like:
   `377396948837-XXXXXXXXXXXX.apps.googleusercontent.com`

5. Replace `'YOUR_WEB_CLIENT_ID'` in `src/services/authService.ts` with that value.

> **iOS note:** The `iosClientId` is already correctly set from `GoogleService-Info.plist`.
> The `REVERSED_CLIENT_ID` URL scheme in `Info.plist` also matches — iOS Google Sign-In is ready.
377396948837-6oarsnto4b0hmfguns16t6k89ce71kr7.apps.googleusercontent.com
---

## 2. Firebase Phone Auth — Enable in Console

**Steps:**

1. Firebase Console → Authentication → Sign-in method
2. Enable **Phone** provider
3. Enable **Google** provider
4. For testing: add your phone number to the "Phone numbers for testing" list
   - This avoids real SMS during development and bypasses reCAPTCHA

---

## 3. Firestore — Enable & Set Security Rules

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

## 4. Firestore — Composite Indexes

The transactions query orders by `date DESC` then `created_at DESC`. Firestore requires a composite index for this.

**Steps:**

1. Firebase Console → Firestore → Indexes → Composite → Add index
2. Collection: `transactions` (this is a sub-collection — Firestore will auto-detect it on first query)
3. Fields:
   - `date` — Descending
   - `created_at` — Descending
4. Query scope: Collection

> Alternatively, run the app and Firestore will log a direct link in the console to create the missing index automatically.

---

## 5. Apple Sign-In (Optional — required for App Store)

If you plan to submit to the App Store, Apple requires Sign in with Apple when any third-party login is offered.

**Steps:**

1. Apple Developer Console → Certificates, Identifiers & Profiles → your App ID
2. Enable "Sign In with Apple" capability
3. In Xcode → your target → Signing & Capabilities → add "Sign In with Apple"
4. Install: `@invertase/react-native-apple-authentication`

This can be done later before App Store submission.

---

## Summary Checklist

| #   | Task                                      | Where                             | Status   |
| --- | ----------------------------------------- | --------------------------------- | -------- |
| 1   | Add SHA-1 + SHA-256 fingerprints          | Firebase Console → Android app    | Pending  |
| 2   | Download updated `google-services.json`   | Firebase Console → Android app    | Pending  |
| 3   | Replace `webClientId` in `authService.ts` | From updated google-services.json | Pending  |
| 4   | Enable Phone + Google auth providers      | Firebase Console → Authentication | Pending  |
| 5   | Create Firestore database + set rules     | Firebase Console → Firestore      | Pending  |
| 6   | Add composite index on `transactions`     | Firebase Console → Firestore      | Pending  |
| 7   | Apple Sign-In (before App Store only)     | Apple Developer + Xcode           | Optional |

---

## What Is Already Done (Code Side)

| Item                                    | Status |
| --------------------------------------- | ------ |
| `google-services.json` added            | Done   |
| `GoogleService-Info.plist` added        | Done   |
| iOS `Info.plist` URL scheme set         | Done   |
| Android `build.gradle` plugins added    | Done   |
| iOS `Podfile` Firebase static framework | Done   |
| `firebase.ts` (analytics + crashlytics) | Done   |
| `authService.ts` (OTP + Google)         | Done   |
| `authStore.tsx` (auth state + listener) | Done   |
| `firestoreService.ts` (all CRUD)        | Done   |
| `membershipStore.tsx` (tier + trial)    | Done   |
| `accountsStore.ts` → Firestore          | Done   |
| `transactionsStore.ts` → Firestore      | Done   |
| `categoriesStore.tsx` → Firestore       | Done   |
| `analytics.ts` (client-side)            | Done   |
| `AnalyticsScreen.tsx` → analytics.ts    | Done   |
| `App.tsx` wired with all providers      | Done   |
| Firestore security rules (code sample)  | Done   |
