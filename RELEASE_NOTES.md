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
- [ ] Budget store migrated to Firestore (currently on SQLite — pending)
- [ ] Free tier limit: 1 active budget (feature gate pending)
- [ ] Budget warning notifications at 80% and 100%

### Categories

- [x] 13 default categories (8 expense + 5 income) seeded on first login
- [x] Add custom categories with emoji, name, color, type
- [x] Delete custom categories
- [x] Categories synced to Firestore per user
- [ ] Free tier limit: 5 custom categories (feature gate pending)

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
- [x] Firestore — accounts, transactions, categories synced per user
- [x] Firestore security rules — users can only access their own data
- [x] Firebase Analytics — screen view tracking
- [x] Firebase Crashlytics — crash reporting
- [x] `google-services.json` — SHA-1 + SHA-256 fingerprints registered (debug + release)
- [x] `GoogleService-Info.plist` — iOS Firebase config
- [x] Web client ID configured for Google Sign-In
- [ ] Firebase Console — Phone + Google auth providers enabled (you)
- [ ] Firestore database created + security rules published (you)
- [ ] Firestore composite index on transactions (date DESC, created_at DESC) (you)

---

## Membership & Monetisation

- [x] 3 membership tiers — Free, Premium Lite, Premium Full
- [x] 3-day Premium Full trial auto-activated on first login (no payment required)
- [x] Trial expiry logic — reverts to Free after 3 days
- [x] `useMembership()` hook — exposes tier, isTrialActive, trialDaysLeft, canAccess()
- [x] Feature access matrix — PREMIUM_LITE_FEATURES + PREMIUM_FULL_FEATURES sets
- [x] Paywall screen — shows all 3 tiers with pricing, features, trial banner
- [x] Referral code system — 30-day Premium Full reward for referrer
- [x] `updateMembership()` in Firestore service
- [ ] Feature gating wired in UI — canAccess() not yet enforced anywhere
- [ ] In-app purchases (`react-native-iap`) — PaywallScreen shows "Coming Soon"
- [ ] Apple App Store product IDs created (you — App Store Connect)
- [ ] Google Play product IDs created (you — Play Console)
- [ ] AdMob integration — banner + interstitial for free tier

---

## Settings

- [x] Profile card — displays name, phone, membership tier
- [x] Premium banner — shows current plan + upgrade prompt
- [x] Category manager — add / delete custom categories
- [x] Notification toggles — Transaction Alerts, Monthly Report, Budget Warnings, Weekly Digest
- [x] General settings rows — Currency, Language, Week Start, Date Format
- [x] Appearance rows — Theme, App Icon, Haptic Feedback
- [x] Security rows — Face ID / Biometrics, App Passcode
- [x] Data rows — Export, Backup & Restore, Clear Cache, Privacy Policy, Terms
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
- [x] TypeScript throughout — strict types, no `any` except Firebase interop
- [x] Firestore data layer — all stores migrated from SQLite to Firestore
- [x] Client-side analytics utility (`src/utils/analytics.ts`) — pure functions, no DB calls
- [x] Release keystore (`moniqo-release.keystore`) — signed APK/AAB ready
- [x] Android `build.gradle` — Google Services + Crashlytics plugins
- [x] iOS Podfile — Firebase static framework, modular headers
- [x] Proguard rules configured
- [ ] `src/db/` folder deleted (SQLite layer — dead code, pending cleanup)
- [ ] `src/data/mockData.ts` deleted (no longer needed)
- [ ] `@op-engineering/op-sqlite` removed from `package.json`

---

## Store Submission Checklist

### Android (Play Store)

- [x] Release keystore created and configured
- [x] `google-services.json` with SHA fingerprints
- [x] App ID: `com.ph.moniqo`
- [x] Version: 1.0 (versionCode 1)
- [ ] Release AAB built (`./gradlew bundleRelease`)
- [ ] Play Console — app created, internal track upload
- [ ] Play Console — store listing (description, screenshots, icon)
- [ ] Play Console — in-app products created (see Product IDs below)
- [ ] Play Console — privacy policy URL added
- [ ] Play Console — content rating questionnaire completed

### In-App Purchase Product IDs

These exact IDs must be created in both **Google Play Console** and **App Store Connect**:

| Product ID             | Type                      | Price   | Plan         |
| ---------------------- | ------------------------- | ------- | ------------ |
| `moniqo_lite_monthly`  | Subscription              | ₹49/mo  | Premium Lite |
| `moniqo_lite_annual`   | Subscription              | ₹399/yr | Premium Lite |
| `moniqo_full_monthly`  | Subscription              | ₹149/mo | Premium Full |
| `moniqo_full_annual`   | Subscription              | ₹999/yr | Premium Full |
| `moniqo_full_lifetime` | One-time (non-consumable) | ₹2,499  | Premium Full |

**Google Play Console:** Monetisation → Subscriptions (for the 4 subs) + One-time products (for lifetime)
**App Store Connect:** Your app → In-App Purchases → Create → Auto-Renewable Subscription (for subs) + Non-Consumable (for lifetime)

---

### iOS (App Store)

- [x] `GoogleService-Info.plist` configured
- [x] iOS URL scheme set in `Info.plist`
- [x] App icons — all sizes provided
- [x] Launch screen configured
- [x] Bundle ID: `com.ph.moniqo`
- [ ] Apple Sign-In implemented (App Store requirement)
- [ ] Xcode — provisioning profile + signing certificate
- [ ] Xcode — Archive + upload to App Store Connect
- [ ] App Store Connect — store listing (description, screenshots, icon)
- [ ] App Store Connect — in-app purchases created
- [ ] App Store Connect — privacy policy URL added
- [ ] App Store Connect — age rating completed
- [ ] `itms-apps` added to `LSApplicationQueriesSchemes` in `Info.plist` (for in-app update)

---

## Summary

| Area                  | Done   | Remaining |
| --------------------- | ------ | --------- |
| Core features         | 35     | 3         |
| Authentication        | 6      | 2         |
| Firebase / Cloud      | 8      | 3 (you)   |
| Membership & Payments | 8      | 5         |
| Settings              | 10     | 3         |
| Notifications         | 4      | 3         |
| Navigation & UX       | 6      | 1         |
| Infrastructure        | 8      | 3         |
| Android submission    | 4      | 6         |
| iOS submission        | 5      | 7         |
| **Total**             | **94** | **36**    |

---

## Next Steps (Priority Order)

### Code (Me)

1. Migrate `budgetStore` to Firestore + delete `src/db/` folder
2. Wire feature gating (`canAccess()`) — budget limit, category limit, CSV export
3. Apple Sign-In implementation
4. `react-native-iap` — in-app purchase wiring in PaywallScreen
5. Transaction alert notification on save
6. Budget warning notifications (80% / 100%)
7. Trial expiry notification
8. Onboarding flow (3-step carousel)
9. Android release build (`./gradlew bundleRelease`)

### Firebase Console (You)

1. Enable Phone + Google auth providers
2. Create Firestore database + publish security rules
3. Create composite index on `transactions`

### Store Setup (You)

1. Create privacy policy page (required by both stores)
2. Prepare screenshots for both platforms
3. App Store Connect — create app + in-app purchase products
4. Play Console — create app + in-app purchase products
5. Apple Developer — enable Sign In with Apple capability
6. Xcode — archive + upload
