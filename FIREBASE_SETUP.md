# Firebase Setup — Action Required (Your Side)

These are the manual steps only you can do — they require access to Firebase Console and Apple/Google developer accounts.

---

## 1. Add SHA Fingerprints to Firebase (CRITICAL — Android Google Sign-In won't work without this)

The `webClientId` is already set in `src/services/authService.ts`. But Android Google Sign-In
also requires your keystore fingerprints registered in Firebase so it can verify the app identity.

### Fingerprints (already generated — just add these in Firebase Console)

**Debug keystore** (for development builds):

```
SHA-1:   5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
SHA-256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
```

**Release keystore** (`moniqo-release.keystore`) — for production / Play Store:

```
SHA-1:   3F:F4:67:70:13:11:A3:FE:FD:B5:BA:B9:F7:2B:C9:45:D4:62:81:8C
SHA-256: 2F:8F:15:B8:F2:F1:DA:12:24:AF:D1:83:D8:3F:79:9F:C4:17:3C:74:1D:23:3F:51:E1:DC:09:FC:30:12:C6:A1
```

**Steps:**

1. Firebase Console → Project Settings → General → Your Android app (`com.ph.moniqo`)
2. Click **"Add fingerprint"** — add all 4 values above (both SHA-1 and SHA-256 for both keystores)
3. Download the updated `google-services.json` and replace `android/app/google-services.json`

> **iOS note:** The `iosClientId` is already correctly set from `GoogleService-Info.plist`.
> The `REVERSED_CLIENT_ID` URL scheme in `Info.plist` also matches — iOS Google Sign-In is ready.

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
2. Start in **production mode**, pick region `asia-south1` (Mumbai) for India
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

4. Click **Publish**

---

## 4. Firestore — Composite Index on Transactions

The transactions listener orders by `date DESC` then `created_at DESC` — Firestore needs a
composite index for this. The easiest way is to let the app tell you:

1. Run the app after Firestore is created
2. On first load, Firestore will log an error in Metro/Xcode with a direct link:
   ```
   The query requires an index. You can create it here: https://console.firebase.google.com/...
   ```
3. Tap/open that link → Firebase Console opens with the index pre-filled → click **Create**
4. Wait ~2 minutes for it to build

---

## 5. Apple Sign-In (Optional — required before App Store submission)

If you plan to submit to the App Store, Apple requires Sign in with Apple when any third-party login is offered.

**Steps:**

1. Apple Developer Console → Certificates, Identifiers & Profiles → your App ID
2. Enable "Sign In with Apple" capability
3. In Xcode → your target → Signing & Capabilities → add "Sign In with Apple"
4. Install: `@invertase/react-native-apple-authentication`

---

## Summary Checklist

| #   | Task                                                 | Status   |
| --- | ---------------------------------------------------- | -------- |
| 1   | `webClientId` set in `authService.ts`                | Done     |
| 2   | iOS `iosClientId` set in `authService.ts`            | Done     |
| 3   | iOS URL scheme set in `Info.plist`                   | Done     |
| 4   | Android `build.gradle` Google Services plugin        | Done     |
| 5   | iOS Podfile Firebase static framework                | Done     |
| 6   | Add debug SHA-1 + SHA-256 fingerprints in Firebase   | Done     |
| 7   | Add release SHA-1 + SHA-256 fingerprints in Firebase | Done     |
| 8   | Download updated `google-services.json`              | Done     |
| 9   | Enable Phone + Google auth providers in Firebase     | Done     |
| 10  | Create Firestore database + set security rules       | Done     |
| 11  | Create composite index on `transactions`             | Pending  |
| 12  | Apple Sign-In (before App Store only)                | Optional |

---

## What Is Already Done (Code Side)

| File                                    | Status |
| --------------------------------------- | ------ |
| `google-services.json` added            | Done   |
| `GoogleService-Info.plist` added        | Done   |
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
