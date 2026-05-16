# Moniqo — API & Backend Migration Roadmap

## Overview

Replacing Firebase (Auth + Firestore) with a custom PHP REST API on HostGator.
- **Free users** → SQLite local storage only
- **Premium users** → SQLite + PHP API cloud sync
- **Auth (Phase 1)** → Google Sign-In + JWT (no SMS OTP cost at launch)
- **Auth (Phase 2)** → PHP SMS OTP (after DLT registration is done)
- **Admin** → PHP admin panel with user search

**Mobile project:** `f:\PlayStore\Moniqo`
**PHP backend:** `C:\xampp\htdocs\moniqo-api` (local) → HostGator (production)
**Android versionCode:** `12` (bumped from 11)

---

## Progress Summary

| Section | Done | Total | Status |
|---|---|---|---|
| Mobile — Foundation | 5 | 5 | ✅ Complete |
| Mobile — Feature Flags | 2 | 2 | ✅ Complete |
| Mobile — API Services | 8 | 8 | ✅ Complete |
| Mobile — Auth Migration Phase 1 | 1 | 6 | 🔄 In progress |
| Mobile — Store Migration | 0 | 6 | ⬜ Not started |
| Mobile — Cleanup | 0 | 4 | ⬜ Not started |
| PHP — Core Layer | 5 | 5 | ✅ Complete |
| PHP — Auth Endpoints Phase 1 | 3 | 3 | ✅ Complete |
| PHP — Feature Flags | 1 | 1 | ✅ Complete |
| PHP — User / Accounts / Data | 6 | 9 | 🔄 In progress |
| PHP — Sync / Membership | 0 | 4 | ⬜ Not started |
| PHP — Admin Panel | 0 | 4 | ⬜ Not started |

---

## 🔜 Next Up

**PHP — Data Endpoints** — `api/transactions/index.php`, `api/categories/index.php`, `api/budgets/index.php`
Then: **`src/store/authStore.tsx`** — replace Firebase `onAuthStateChanged` with MMKV token check.

---

## Feature Flags

Controlled via `config.php` (backend) and synced to app via `GET /api/config/features`.
Flip these to enable/disable features without a code deploy.

| Flag | Current | Meaning |
|------|---------|---------|
| `FEATURE_SMS_OTP` | `false` | Phase 2 — needs DLT registration |
| `FEATURE_GOOGLE_LOGIN` | `true` | Active — Phase 1 auth |
| `FEATURE_APPLE_LOGIN` | `false` | iOS only — skip for Play Store launch |
| `FEATURE_CLOUD_SYNC` | `true` | Premium users only |
| `FEATURE_ADS` | `true` | Free users only |

---

## Mobile — React Native

### Foundation (API layer) ✅
- [x] Install `axios` + `react-native-mmkv`
- [x] `src/config/apiConfig.ts` — base URL, auto dev/prod switch
- [x] `src/services/storageService.ts` — JWT token + user info in MMKV
- [x] `src/services/apiClient.ts` — axios instance, auto Bearer token, auto 401 refresh
- [x] `src/services/authApiService.ts` — sendOtp, verifyOtp, logout, getProfile

### Feature Flags ✅
- [x] `src/services/featuresApiService.ts` — fetch flags from backend, fallback to defaults
- [x] `src/store/featuresStore.tsx` — React Context, `useFeatures()`, `useAuthFeatures()`

### API Services ✅
- [x] `src/services/userApiService.ts` — getProfile, updateProfile, deleteAccount
- [x] `src/services/accountsApiService.ts` — bank / card / cash / investment CRUD
- [x] `src/services/googleAuthApiService.ts` — configure, signIn, signOut, isSignedIn
- [x] `src/services/transactionsApiService.ts` — CRUD + filters
- [x] `src/services/categoriesApiService.ts` — CRUD
- [x] `src/services/budgetsApiService.ts` — upsert + delete
- [x] `src/services/syncApiService.ts` — push (free→premium upgrade) + pull (new device restore)
- [x] `src/services/membershipApiService.ts` — IAP upgrade, apply referral code

### Auth Migration — Phase 1 (Google Sign-In) 🔄
- [x] `@react-native-google-signin/google-signin` — already installed, `webClientId` configured
- [x] `src/store/authStore.tsx` — replaced Firebase `onAuthStateChanged` with MMKV token check
- [x] Wire `GoogleAuthApiService.configure()` on app startup (called inside `AuthProvider`)
- [ ] `src/screens/LoginScreen` — hide phone field (`sms_otp: false`) — Phase 2 only
- [x] Wire Google Sign-In button → `GoogleAuthApiService.signIn()` → `setUser()` → app opens
- [ ] Remove `@react-native-firebase/auth` usage from codebase
- [ ] Remove `src/services/authService.ts` (Firebase version, replaced by `googleAuthApiService.ts`)

### Auth Migration — Phase 2 (SMS OTP, after DLT) ⏸ Parked
- [ ] `src/screens/LoginScreen` — wire `sendOtp` to `AuthApiService`
- [ ] `src/screens/OtpScreen` — wire `verifyOtp` to `AuthApiService`
- [ ] Show phone login only when `features.auth.sms_otp === true`

### Store Migration (remove Firestore) ⬜
- [ ] `src/store/accountsStore.ts` — replace Firestore with SQLite + API (premium only)
- [ ] `src/store/transactionsStore.ts` — replace Firestore with SQLite + API
- [ ] `src/store/categoriesStore.tsx` — replace Firestore with SQLite + API
- [ ] `src/store/budgetStore.tsx` — replace Firestore with SQLite + API
- [ ] `src/store/membershipStore.tsx` — read membership from MMKV instead of Firestore
- [ ] Remove `src/services/firestoreService.ts`

### Cleanup ⬜
- [ ] Uninstall `@react-native-firebase/firestore`
- [ ] Uninstall `@react-native-firebase/auth`
- [ ] Keep `@react-native-firebase/analytics` + `@react-native-firebase/crashlytics` (optional)
- [ ] Keep `@react-native-google-signin/google-signin` — already rewired to PHP, no Firebase dependency

---

## PHP Backend — `C:\xampp\htdocs\moniqo-api`

### Setup
- [x] Folder created at `C:\xampp\htdocs\moniqo-api`
- [x] `CLAUDE.md` created
- [x] `config.php` — DB creds, JWT secret, SMS config, feature flags, `GOOGLE_CLIENT_ID` set
- [ ] `.htaccess` — pretty URLs, block direct file access
- [ ] Run `schema.sql` in phpMyAdmin to create all tables

### Core Layer ✅
- [x] `core/db.php` — MySQL PDO singleton
- [x] `core/response.php` — standard JSON success/error helpers
- [x] `core/auth.php` — JWT create + verify, Bearer token middleware
- [x] `core/sms.php` — SMS gateway abstraction (fast2sms `route=q` for testing)
- [x] `core/helpers.php` — generateUuid(), generateReferralCode()

### Feature Flags Endpoint ✅
- [x] `api/config/features.php` — `GET /api/config/features` (public, no auth)

### Auth Endpoints — Phase 1 (Google) ✅
- [x] `api/auth/google.php` — verify Google ID token, find/create user, return JWT
- [x] `api/auth/refresh.php` — refresh access token
- [x] `api/auth/logout.php` — invalidate refresh token

### Auth Endpoints — Phase 2 (SMS OTP, after DLT) ⏸ Parked
- [ ] `api/auth/send-otp.php` — *(file exists, needs feature flag gate added)*
- [ ] `api/auth/verify-otp.php` — *(file exists, needs feature flag gate added)*
- [ ] Handle nullable `phone` column for Google users in OTP flow

### User Endpoints ✅
- [x] `api/user/profile.php` — GET / PUT
- [x] `api/user/delete.php` — DELETE all user data

### Account Endpoints ✅
- [x] `api/accounts/bank.php` — GET / POST / PUT / DELETE
- [x] `api/accounts/card.php` — GET / POST / PUT / DELETE
- [x] `api/accounts/cash.php` — GET / POST / PUT / DELETE
- [x] `api/accounts/investment.php` — GET / POST / PUT / DELETE

### Data Endpoints ⬜
- [ ] `api/transactions/index.php` — GET (with filters) / POST / PUT / DELETE
- [ ] `api/categories/index.php` — GET / POST / DELETE
- [ ] `api/budgets/index.php` — GET / POST (upsert) / DELETE

### Sync Endpoints ⬜
- [ ] `api/sync/push.php` — bulk upload local SQLite → MySQL (called once on upgrade)
- [ ] `api/sync/pull.php` — download all cloud data (called on new device)

### Membership Endpoints ⬜
- [ ] `api/membership/upgrade.php` — verify IAP purchase token, set tier + expiry
- [ ] `api/membership/referral.php` — apply referral code, reward 30 days premium

### Admin Panel ⬜
- [ ] `admin/index.php` — password login
- [ ] `admin/dashboard.php` — total users, premium count, revenue this month, new today
- [ ] `admin/users.php` — search by phone or name, view profile, set membership manually
- [ ] `admin/transactions.php` — view any user's transactions (support tool)

### Deployment
- [ ] Export MySQL from phpMyAdmin
- [ ] Upload all files to HostGator `public_html/moniqo-api/` via FTP / cPanel
- [ ] Update `config.php` with HostGator DB credentials (`GOOGLE_CLIENT_ID` already set)
- [ ] Set `ENVIRONMENT = 'production'`
- [ ] Test live: `https://bloomingnews24.com/moniqo-api/api/config/features`

---

## SMS Gateway (Phase 2 — Parked)

Do this only when ready to enable `FEATURE_SMS_OTP = true`.

- [ ] Wait for Fast2SMS KYC approval (submitted — pending)
- [ ] Register on **Jio DLT** (free) — entity + sender ID `MONIQO` + OTP template
- [ ] Add Fast2SMS API key to `config.php` → `SMS_API_KEY`
- [ ] Upgrade Fast2SMS route from `q` (Quick SMS) to `dlt` in `core/sms.php`
- [ ] Set `FEATURE_SMS_OTP = true` in `config.php`
- [ ] Test end-to-end OTP on physical device

---

## Pending from Your Side (blockers / manual steps)

### Immediate (needed to test Google login end-to-end)
- [x] `GOOGLE_CLIENT_ID` — found in `authService.ts`, set in `config.php`
- [ ] Run this SQL in phpMyAdmin (`localhost/phpmyadmin` → moniqo DB → SQL tab):
  ```sql
  ALTER TABLE users
    ADD COLUMN google_id VARCHAR(128) NULL AFTER id,
    ADD COLUMN email VARCHAR(255) NULL AFTER google_id,
    ADD UNIQUE INDEX idx_google_id (google_id),
    ADD UNIQUE INDEX idx_email (email);
  ```

### Google Play / AdMob
- [ ] Add all 5 IAP SKUs in Google Play Console → Monetize → In-app products:
  `moniqo_lite_monthly`, `moniqo_lite_annual`, `moniqo_full_monthly`, `moniqo_full_annual`, `moniqo_full_lifetime`

### HostGator / Domain (before production)
- [ ] Point domain DNS to HostGator
- [ ] Create MySQL database + user in cPanel
- [ ] Upload files via FTP / File Manager
- [ ] Update `config.php` with production DB credentials
- [ ] Test: `https://bloomingnews24.com/moniqo-api/api/config/features`

### SMS OTP — Phase 2
- [ ] Wait for Fast2SMS KYC approval
- [ ] Register on Jio DLT (free) for sender ID `MONIQO`
- [ ] Flip `FEATURE_SMS_OTP = true` in `config.php`

---

## How to Continue in a New Session

Open either project in Claude Code and say:

> "Continue Moniqo API roadmap — next unchecked item"

Claude will read `CLAUDE.md` in both projects and know exactly where to pick up.
