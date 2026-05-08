# Moniqo — AdMob & Premium Membership Integration Checklist

> React Native 0.84.1 · Firebase · react-native-iap 14.7.8
> Branch: `feature/admob-integration`
> Last updated: 2026-05-05

---

## LEGEND
- `[ ]` Not started
- `[x]` Complete
- `[~]` In progress / partially done

---

## PART A — PREMIUM MEMBERSHIP SETUP

### A1. Types & Data Model
- [x] `MembershipTier` type defined (`free` | `premium_lite` | `premium_full`)
- [x] `PremiumFeature` union type defined (11 features)
- [x] `UserProfile` interface includes `membership`, `trialUsed`, `trialExpiry`, `membershipExpiry`
- [x] Add `'zero_ads'` to `PremiumFeature` union in `src/types/index.ts`

### A2. Membership Store (`src/store/membershipStore.tsx`)
- [x] Context provider wrapping app
- [x] `tier` state derived from Firestore profile
- [x] `canAccess(feature)` function implemented
- [x] Trial system: 3-day auto-trial on first premium_full purchase
- [x] `isTrialActive` and `trialDaysLeft` computed correctly
- [x] Add `'zero_ads'` to `PREMIUM_FULL_FEATURES` array (Lite intentionally excluded — Lite users see ads per C1)
- [x] Verify `canAccess('zero_ads')` returns `false` for `free` tier (so ads show)

### A3. IAP Hook (`src/hooks/useIAP.ts`)
- [x] Google Play & App Store connection
- [x] SKUs defined: `moniqo_lite_monthly`, `moniqo_lite_annual`, `moniqo_full_monthly`, `moniqo_full_annual`, `moniqo_full_lifetime`
- [x] Purchase initiation with offer tokens
- [x] Purchase listener & Firestore update on success
- [x] Error handling & cancellation detection
- [x] Restore purchases
- [x] Fallback prices (INR): Lite ₹49/mo, ₹399/yr · Full ₹149/mo, ₹999/yr, ₹2,499 lifetime
- [ ] **TEST** — verify purchase flow end-to-end in sandbox (Android internal testing track)
- [ ] **TEST** — verify restore purchase works after reinstall

### A4. Paywall Screen (`src/screens/PaywallScreen.tsx`)
- [x] 3-tier card layout (Free / Premium Lite / Premium Full)
- [x] Monthly / Annual / Lifetime toggle
- [x] Trial banner ("3-day trial active — X days left")
- [x] Guest prompt (sign-in required before purchase)
- [x] "Restore Purchases" button
- [x] Loading states & error display
- [ ] **TEST** — open Paywall from Settings and BottomNavBar
- [ ] **TEST** — confirm correct SKU is passed on each "Upgrade" button tap

### A5. Premium Banner (`src/components/settings/PremiumBanner.tsx`)
- [x] Free tier variant — shows upgrade prompt + feature chips
- [x] Trial active variant — shows "TRIAL ACTIVE" badge + days left
- [x] Premium Lite variant — shows "Upgrade to Full" button
- [x] Premium Full variant — shows "All features unlocked" checkmark
- [ ] **TEST** — each variant renders correctly in Settings screen

### A6. Firestore Integration (`src/services/firestoreService.ts`)
- [x] `updateMembership(uid, tier, expiryMs)` function
- [x] `subscribeToUserProfile(uid, callback)` real-time listener
- [ ] Add Firestore security rules to protect `membership` field (only Cloud Function should write it in production)

### A7. Google Play Console — IAP Products
- [ ] Create subscription product: `moniqo_lite_monthly` (₹49/mo)
- [ ] Create subscription product: `moniqo_lite_annual` (₹399/yr)
- [ ] Create subscription product: `moniqo_full_monthly` (₹149/mo)
- [ ] Create subscription product: `moniqo_full_annual` (₹999/yr)
- [ ] Create one-time product: `moniqo_full_lifetime` (₹2,499)
- [ ] Set all products to **Active** status
- [ ] Add products to internal testing track

---

## PART B — ADMOB INTEGRATION

### B1. AdMob Account Setup
- [x] Create Google AdMob account at admob.google.com
- [x] Create Android App in AdMob console (link to `com.moniqo` or your package name)
- [x] Note down **AdMob App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
- [x] Create Banner Ad Unit → note **Banner Ad Unit ID**
- [x] Create Interstitial Ad Unit → note **Interstitial Ad Unit ID**
- [x] Create Rewarded Ad Unit (optional, for premium trial prompts) → note ID

### B2. Package Installation
- [x] Install package:
  ```bash
  npm install react-native-google-mobile-ads
  ```
- [x] For Android — auto-linking handles it (verify in `android/settings.gradle`)
- [ ] For iOS — run `cd ios && pod install` (skip if Android-only for now)

### B3. Android Native Configuration
- [x] Add AdMob App ID to `android/app/src/main/AndroidManifest.xml`:
  ```xml
  <meta-data
      android:name="com.google.android.gms.ads.APPLICATION_ID"
      android:value="ca-app-pub-9580571842187950~1676721970"/>
  ```
- [x] Verify `minSdkVersion` is **21+** in `android/app/build.gradle` (currently 24)
- [x] Add to `android/app/build.gradle` dependencies if missing (auto-handled by the package)

### B4. SDK Initialization (`App.tsx` or `src/services/`)
- [x] Create `src/services/adService.ts`
- [x] Initialize MobileAds SDK on app start:
  ```ts
  import MobileAds from 'react-native-google-mobile-ads';
  await MobileAds().initialize();
  ```
- [x] Set `RequestConfiguration` for test device IDs during development
- [x] Use **Test Ad Unit IDs** while developing (never use real IDs on a dev build):
  - Banner: `ca-app-pub-3940256099942544/6300978111`
  - Interstitial: `ca-app-pub-3940256099942544/1033173712`
  - Rewarded: `ca-app-pub-3940256099942544/5224354917`

### B5. Ad Display Logic — Gate by Membership
- [x] In `membershipStore.tsx` — confirm `canAccess('zero_ads')` is wired up (see A2)
- [x] Free users → show ads
- [x] Premium Lite users → show ads (no zero_ads feature) ← **confirmed intended**
- [x] Premium Full users → zero ads

### B6. Banner Ad Component
- [x] Create `src/components/ads/BannerAdComponent.tsx`:
  - Uses `BannerAd` from `react-native-google-mobile-ads`
  - Reads `canAccess('zero_ads')` from membership context — returns `null` if premium
  - Passes correct `adUnitId` (test ID in `__DEV__`, real ID in production)
  - Handles `onAdFailedToLoad` gracefully (hide instead of crash)
- [x] Add Banner Ad to **Dashboard screen** (below recent transactions)
- [x] Add Banner Ad to **Transaction History screen** (FlatList footer)
- [x] Add Banner Ad to **Analytics screen** (bottom)
- [x] Add Banner Ad to **Budget screen** (FlatList footer)

### B7. Interstitial Ad (Optional — for key transitions)
- [x] Create `src/hooks/useInterstitialAd.ts`
- [x] Show interstitial after every 3rd transaction add (free users only)
- [ ] OR show interstitial when navigating to Analytics (free users only)
- [x] Do NOT show on premium users (`canAccess('zero_ads')` check)
- [x] Add cooldown: don't show more than once per 5 minutes

### B8. Upgrade Prompt on Ad Tap (Optional)
- [ ] On Banner ad tap OR after interstitial — show small modal "Go Premium to remove ads"
- [ ] Link to `PaywallScreen`

### B9. Environment / Ad Unit ID Configuration
- [x] Create `src/config/adConfig.ts`:
  ```ts
  export const AD_UNIT_IDS = {
    banner: __DEV__
      ? 'ca-app-pub-3940256099942544/6300978111'
      : 'ca-app-pub-9580571842187950/1296395673',
    interstitial: __DEV__
      ? 'ca-app-pub-3940256099942544/1033173712'
      : 'ca-app-pub-9580571842187950/2417905650',
    rewarded: __DEV__
      ? 'ca-app-pub-3940256099942544/5224354917'
      : 'ca-app-pub-9580571842187950/8934289109',
    nativeAdvanced: __DEV__
      ? 'ca-app-pub-3940256099942544/2247696110'
      : 'ca-app-pub-9580571842187950/7621207431',
  };
  ```
- [ ] Never commit real Ad Unit IDs in plain text — use environment variables or `.env` with `react-native-config` if needed

### B10. Build & QA
- [ ] Test with **test ad unit IDs** — ads must appear on free account
- [ ] Test with a **premium_full** account — no ads should appear
- [ ] Verify no crashes on ad load failure (airplane mode test)
- [ ] Check that banners don't overlap bottom navigation bar (use `SafeAreaView` padding)
- [ ] Release build test (`--mode=release`) — test ads must not appear in release

### B11. AdMob Policy Compliance
- [x] App Privacy Policy includes AdMob data disclosure — Settings "Privacy Policy" row opens `PRIVACY_POLICY_URL` via `Linking.openURL`; update URL and policy text at `moniqoapp.com/privacy-policy` to include AdMob disclosure
- [x] Add User Messaging Platform (UMP) consent form for GDPR/CCPA if targeting EU/CA users
  - Package: `react-native-google-mobile-ads` includes UMP support
  - `AdsConsent.requestInfoUpdate()` + `AdsConsent.showForm()` called in `adService.ts` before SDK init
  - `__DEV__` uses `debugGeography: EEA` to simulate consent being required for testing
- [x] Do NOT click your own ads during testing
- [x] Ensure ads are not placed where accidental clicks are likely — banners placed at bottom of scrollable content, never adjacent to action buttons

### B12. Google Play Store — AdMob Declaration
- [ ] In Play Console → App Content → Ads → declare "This app contains ads"
- [ ] Update store listing description to mention "Free version contains ads"

---

## PART C — FINAL INTEGRATION CHECKLIST

### C1. Feature Gating Summary
| Feature | Free | Premium Lite | Premium Full |
|---------|------|-------------|-------------|
| Banner Ads | ✅ Show | ✅ Show | ❌ Hidden |
| Interstitial Ads | ✅ Show | ✅ Show | ❌ Hidden |
| Unlimited Budgets | ❌ | ✅ | ✅ |
| Unlimited Categories | ❌ | ✅ | ✅ |
| Cloud Sync | ❌ | ✅ | ✅ |
| App Lock | ❌ | ✅ | ✅ |
| Recurring Transactions | ❌ | ✅ | ✅ |
| CSV Export | ❌ | ❌ | ✅ |
| Full Analytics History | ❌ | ❌ | ✅ |
| Multi-currency | ❌ | ❌ | ✅ |
| SMS Parsing | ❌ | ❌ | ✅ |
| Splitwise | ❌ | ❌ | ✅ |
| Widget | ❌ | ❌ | ✅ |

### C2. Release Readiness
- [ ] All test ad unit IDs replaced with real IDs in production builds
- [ ] All IAP SKUs active in Play Console
- [ ] Firestore security rules updated
- [ ] Privacy policy updated for AdMob
- [ ] Play Console — Ads declaration done
- [ ] Play Console — IAP products reviewed and approved
- [ ] Internal testing track build passes end-to-end purchase flow
- [ ] App reviewed with a real device on release build (no test ads showing)

---

## LATER IMPLEMENT

### L1. Opt-in 3-Day Free Trial (User-Initiated)
- [ ] After sign-up, show a one-time prompt: "Try Premium free for 3 days — no payment required"
- [ ] User explicitly taps "Start Free Trial" to activate (not automatic on account creation)
- [ ] On confirmation, write `membership: 'premium_full'`, `trialUsed: true`, `trialExpiry: now + 3 days`, `membershipExpiry: trialExpiry` to Firestore via a dedicated `activateTrial(uid)` function
- [ ] Show the trial prompt on the Paywall screen or as a post-login bottom sheet
- [ ] Once `trialUsed: true` is set, never show the prompt again (already handled by `resolveEffectiveTier`)
- [ ] After trial expires, user drops back to free tier with ads (already handled correctly)

---

## NOTES

- **AdMob test IDs** — always use during development. Using real IDs on test builds risks account suspension.
- **IAP sandbox** — use a Google test account for purchase testing in internal track.
- **UMP consent** — required only if you target EU/EEA or California. Can be deferred to a later release if launching India-only first.
