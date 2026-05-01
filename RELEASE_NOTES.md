# Moniqo — Release Notes

---

## v1.0.0 — Upcoming Release

> Target: Android (Play Store) + iOS (App Store)
> Status: In Progress

---

## Core App

### Accounts

- [x] Bank accounts — add, edit, delete, balance tracking
- [x] Card accounts — add, edit, delete, due amount tracking
- [x] Investment accounts — add, edit, delete, amount tracking
- [x] Cash entries — add, edit, delete
- [x] Transfer between accounts — creates paired income/expense transactions
- [x] Total balance computed across all account types

### Transactions

- [x] Add income / expense transactions
- [x] Link transactions to accounts
- [x] Edit transactions (tap to edit)
- [x] Delete transactions (long press)
- [x] Transaction history screen — full list grouped by date
- [x] Search transactions by title / note
- [x] Filter by type, category, account, date range
- [x] Transfer transactions excluded from income/expense analytics

### Analytics

- [x] Income vs Expense bar chart — Week / Month / Year views
- [x] Period navigation (previous weeks, months, years)
- [x] Income, Expense, Savings summary cards
- [x] Savings rate progress bar
- [x] Spending by category breakdown with percentages
- [x] Top expenses list
- [x] All analytics computed client-side from live Firestore data
- [x] Transfer transactions excluded from all aggregations

### Budget

- [x] Set monthly budget per category
- [x] Progress bar per budget (green / orange / red thresholds)
- [x] Over-budget indicator
- [x] Total budgeted vs total spent summary card
- [x] Delete budget (long press)
- [x] Budget store migrated to Firestore
- [x] Free tier limit: 1 active budget (feature gated)
- [ ] Budget warning notifications at 80% and 100%

### Categories

- [x] 13 default categories (8 expense + 5 income) seeded on first login
- [x] Add custom categories with emoji, name, color, type
- [x] Delete custom categories
- [x] Categories synced to Firestore per user
- [x] Free tier limit: 5 custom categories (feature gated)

---

## Authentication

- [x] Welcome screen — Google Sign-In, Phone OTP, Continue as Guest
- [x] Phone + OTP login (Firebase Auth) — +91 India default
- [x] Google Sign-In (iOS + Android)
- [x] Guest mode — full app without login, prompt on premium actions
- [x] Auto sign-in on relaunch (Firebase Auth state persistence)
- [x] Sign out
- [ ] Apple Sign-In (required for App Store submission)
- [ ] Referral code entry on signup screen

---

## Firebase & Cloud

- [x] Firebase Auth — Phone OTP + Google
- [x] Firestore — accounts, transactions, categories, budgets synced per user
- [x] Firestore security rules — users can only access their own data
- [x] Firebase Analytics — screen view tracking
- [x] Firebase Crashlytics — crash reporting
- [x] `google-services.json` — SHA-1 + SHA-256 fingerprints registered (debug + release)
- [x] `GoogleService-Info.plist` — iOS Firebase config
- [x] Web client ID configured for Google Sign-In
- [x] Firebase Console — Phone + Google auth providers enabled
- [x] Firestore database created + security rules published
- [ ] Firestore composite index on transactions (date DESC, created_at DESC)

---

## Membership & Monetisation

- [x] 3 membership tiers — Free, Premium Lite, Premium Full
- [x] 3-day Premium Full trial auto-activated on first login (no payment required)
- [x] Trial expiry logic — reverts to Free after 3 days
- [x] `useMembership()` hook — exposes tier, isTrialActive, trialDaysLeft, canAccess()
- [x] Feature access matrix — PREMIUM_LITE_FEATURES + PREMIUM_FULL_FEATURES sets
- [x] Paywall screen — real purchase buttons with live prices
- [x] Restore Purchases button
- [x] Referral code system — 30-day Premium Full reward for referrer
- [x] `updateMembership()` in Firestore service
- [x] Feature gating wired — budget limit, category limit, CSV export, app lock
- [x] `react-native-iap` v14 + `react-native-nitro-modules` installed and wired
- [ ] Google Play product IDs created (you — Play Console)
- [ ] Apple App Store product IDs created (you — App Store Connect)
- [ ] AdMob integration — banner + interstitial for free tier

---

## In-App Purchase Product IDs

These exact IDs must be created in both **Google Play Console** and **App Store Connect**:

| Product ID             | Name                           | Type                      | Price   | Description                                                                       |
| ---------------------- | ------------------------------ | ------------------------- | ------- | --------------------------------------------------------------------------------- |
| `moniqo_lite_monthly`  | Moniqo Premium Lite — Monthly  | Subscription              | ₹49/mo  | Unlimited budgets, cloud sync, app lock and more. Billed monthly.                 |
| `moniqo_lite_annual`   | Moniqo Premium Lite — Annual   | Subscription              | ₹399/yr | Unlimited budgets, cloud sync, app lock and more. Save 33% vs monthly.            |
| `moniqo_full_monthly`  | Moniqo Premium Full — Monthly  | Subscription              | ₹149/mo | All features — CSV export, zero ads, and everything in Lite. Billed monthly.      |
| `moniqo_full_annual`   | Moniqo Premium Full — Annual   | Subscription              | ₹999/yr | All features — CSV export, zero ads, and everything in Lite. Save 44% vs monthly. |
| `moniqo_full_lifetime` | Moniqo Premium Full — Lifetime | One-time (non-consumable) | ₹2,499  | All Premium Full features, forever. One-time payment, no subscription.            |

**Google Play Console:** Monetisation → Subscriptions (for the 4 subs) + One-time products (for lifetime)
**App Store Connect:** Your app → In-App Purchases → Auto-Renewable Subscription (for subs) + Non-Consumable (for lifetime)

---

## Settings

- [x] Profile card — displays name, phone, membership tier
- [x] Premium banner — shows current plan + upgrade prompt
- [x] Category manager — add / delete custom categories
- [x] Notification toggles — Transaction Alerts, Monthly Report, Budget Warnings, Weekly Digest
- [x] General settings rows — Currency, Language, Week Start, Date Format
- [x] Appearance rows — Theme, App Icon, Haptic Feedback
- [x] Security rows — Face ID / Biometrics (gated), App Passcode (gated)
- [x] Data rows — Export (gated), Backup & Restore, Clear Cache, Privacy Policy, Terms
- [x] About rows — App Version, Rate Moniqo, Share, Feedback
- [x] Sign Out with confirmation
- [x] Delete Account with confirmation
- [ ] App lock — biometrics / PIN (Premium Lite+)
- [ ] Dark mode (system-aware + manual override)
- [ ] CSV export (Premium Full)

---

## Notifications

- [x] `@notifee/react-native` installed
- [x] Notification permission request on login
- [x] Monthly report — scheduled for 1st of each month
- [x] Weekly digest — scheduled every Monday
- [ ] Transaction alert — fire after each transaction saved
- [ ] Budget warning — fire at 80% and 100% of budget
- [ ] Trial expiry reminder — 1 day before trial ends

---

## Navigation & UX

- [x] Bottom navigation bar — Dashboard, Analytics, Budget, Accounts, Settings
- [x] FAB (floating action button) — Add Income, Add Expense, Transfer
- [x] FabActionSheet — animated bottom sheet for FAB actions
- [x] Error boundary — catches and displays runtime errors gracefully
- [x] Safe area handling on all screens (iOS notch + Android status bar)
- [ ] Onboarding flow — 3-step carousel for first-time users

---

## Infrastructure & Code Quality

- [x] React Native 0.84.1 + New Architecture enabled
- [x] TypeScript throughout — zero errors
- [x] Firestore data layer — all stores migrated from SQLite to Firestore
- [x] `src/db/` SQLite layer deleted entirely
- [x] `src/data/mockData.ts` deleted
- [x] Client-side analytics utility (`src/utils/analytics.ts`) — pure functions
- [x] Release keystore (`moniqo-release.keystore`) — signed AAB ready
- [x] Android `build.gradle` — Google Services + Crashlytics plugins
- [x] R8 minification enabled — smaller APK size
- [x] Proguard rules configured for React Native, Firebase, IAP, Nitro
- [x] iOS Podfile — Firebase static framework, modular headers

---

## Store Submission Checklist

### App Logo Requirements

You need to prepare the following logo assets:

**Google Play Store:**
| Asset | Size | Format | Notes |
| --- | --- | --- | --- |
| App icon | 512 × 512 px | PNG (no alpha) | Shown on Play Store listing |
| Feature graphic | 1024 × 500 px | PNG or JPG | Banner shown at top of listing |

**Apple App Store:**
| Asset | Size | Format | Notes |
| --- | --- | --- | --- |
| App Store icon | 1024 × 1024 px | PNG (no alpha, no rounded corners) | Apple adds rounding automatically |

**Tips for the logo:**

- Use the "M" lettermark from the app's welcome screen as the base
- Background color: `#2B3FE8` (Moniqo primary blue)
- White "M" on blue background works well for both stores
- No transparency allowed on Play Store or App Store icons
- Keep it simple — icons are viewed at small sizes

---

### Android (Play Store)

- [x] Release keystore created and configured
- [x] `google-services.json` with SHA fingerprints
- [x] App ID: `com.ph.moniqo`
- [x] versionCode 2, versionName 1.0
- [x] Release AAB built and signed (`app-release.aab` — 56MB)
- [x] R8 minification enabled
- [ ] Play Console — app created, internal track upload
- [ ] Play Console — store listing (description, screenshots, **logo**)
- [ ] Play Console — in-app products created (5 product IDs above)
- [ ] Play Console — privacy policy URL added
- [ ] Play Console — content rating questionnaire completed

### iOS (App Store)

- [x] `GoogleService-Info.plist` configured
- [x] iOS URL scheme set in `Info.plist`
- [x] App icons — all sizes provided
- [x] Launch screen configured
- [x] Bundle ID: `com.ph.moniqo`
- [ ] Apple Sign-In implemented (App Store requirement)
- [ ] Xcode — provisioning profile + signing certificate
- [ ] Xcode — Archive + upload to App Store Connect
- [ ] App Store Connect — store listing (description, screenshots, **logo**)
- [ ] App Store Connect — in-app purchases created (5 product IDs above)
- [ ] App Store Connect — privacy policy URL added
- [ ] App Store Connect — age rating completed

---

## Summary

| Area                  | Done    | Remaining |
| --------------------- | ------- | --------- |
| Core features         | 37      | 1         |
| Authentication        | 6       | 2         |
| Firebase / Cloud      | 9       | 1         |
| Membership & Payments | 11      | 3         |
| Settings              | 10      | 3         |
| Notifications         | 4       | 3         |
| Navigation & UX       | 6       | 1         |
| Infrastructure        | 11      | 0         |
| Android submission    | 5       | 5         |
| iOS submission        | 5       | 6         |
| **Total**             | **104** | **25**    |

---

## Next Steps (Priority Order)

### Code (Me)

1. Apple Sign-In implementation
2. Transaction alert notification on save
3. Budget warning notifications (80% / 100%)
4. Trial expiry notification
5. Onboarding flow (3-step carousel)
6. Rebuild release AAB after R8 enabled (`./gradlew bundleRelease`)

### Store Setup (You)

1. Design app logo (512×512 for Play, 1024×1024 for App Store)
2. Create privacy policy page (required by both stores)
3. Prepare screenshots for both platforms
4. Play Console — create app + upload AAB + create 5 IAP products
5. App Store Connect — create app + create 5 IAP products
6. Apple Developer — enable Sign In with Apple capability
7. Firestore composite index on `transactions` (tap link from error log)
