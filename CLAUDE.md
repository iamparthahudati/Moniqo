# Moniqo — React Native App

## Project Overview

Moniqo is a personal finance tracker app built with React Native (TypeScript).
It targets Indian users, supports INR, and monetizes via Google Play in-app purchases (AdMob ads for free users).

**Companion backend:** `C:\xampp\htdocs\moniqo-api` (PHP + MySQL)
**Live backend URL:** `https://yourdomain.com/moniqo-api` (HostGator)
**Android package:** `com.ph.moniqo`

---

## Tech Stack

- React Native (TypeScript)
- SQLite via `@op-engineering/op-sqlite` — local storage for ALL users
- PHP REST API — cloud sync for premium users only
- JWT authentication — stored in MMKV
- MMKV (`react-native-mmkv`) — fast key-value store for JWT + settings
- Google Mobile Ads (AdMob) — shown to free users only
- React Native IAP — in-app purchases for premium upgrade
- Notifee — local notifications

**Removed / no longer used:**
- Firebase Phone Auth (replaced by PHP + SMS OTP)
- Firebase Google Sign-In (removed entirely)
- Firestore (replaced by SQLite + PHP API)
- Firebase Analytics / Crashlytics (keep or replace separately)

---

## Architecture

### Storage Model

```
Free User
  └── SQLite (local, on-device only)
        All data: accounts, transactions, categories, budgets
        Data is LOST if app is uninstalled

Premium User
  └── SQLite (local, always used as primary)
  └── PHP API (cloud sync, background)
        On upgrade: POST /sync/push → uploads all local data to MySQL
        On new device: GET /sync/pull → downloads all cloud data to SQLite
        On every write: fire-and-forget API call in parallel with SQLite write
```

### Auth Flow

```
1. User enters 10-digit phone number (Indian, +91 prepended)
2. App calls POST /api/auth/send-otp { phone: "+919876543210" }
3. PHP sends SMS via SMS gateway (MSG91 / 2Factor / Fast2SMS)
4. User enters 6-digit OTP
5. App calls POST /api/auth/verify-otp { phone, otp }
6. PHP returns { access_token, refresh_token, user }
7. Tokens stored in MMKV
8. All subsequent API calls: Authorization: Bearer {access_token}
9. On 401: call POST /api/auth/refresh with refresh_token
```

### No Google Login
Google Sign-In has been completely removed. Only phone OTP auth.

---

## Membership Tiers

| Tier | Storage | Ads | Price |
|------|---------|-----|-------|
| `free` | SQLite only | Yes (AdMob) | Free |
| `premium_lite` | SQLite + PHP cloud | No | ₹49/mo, ₹399/yr |
| `premium_full` | SQLite + PHP cloud | No | ₹149/mo, ₹999/yr, ₹2,499 lifetime |

**ALL app features are available to free users.** The only premium benefit is:
- Ad removal
- Cloud backup + multi-device sync

---

## PHP API Contract

**Base URL (local):** `http://10.0.2.2/moniqo-api/api` (Android emulator)
**Base URL (local device):** `http://192.168.x.x/moniqo-api/api` (physical device on same WiFi)
**Base URL (production):** `https://yourdomain.com/moniqo-api/api`

All requests: `Content-Type: application/json`
All protected routes: `Authorization: Bearer {access_token}`

### Auth Endpoints

```
POST /auth/send-otp
  Body: { phone: "+919876543210" }
  Response: { success: true, message: "OTP sent" }

POST /auth/verify-otp
  Body: { phone: "+919876543210", otp: "123456" }
  Response: {
    success: true,
    access_token: "...",
    refresh_token: "...",
    user: { id, phone, display_name, email, membership, referral_code, created_at }
  }

POST /auth/refresh
  Body: { refresh_token: "..." }
  Response: { access_token: "...", refresh_token: "..." }

DELETE /auth/logout
  Response: { success: true }
```

### User Endpoints

```
GET /user/profile
  Response: { id, phone, display_name, email, membership, membership_expiry,
              trial_used, trial_expiry, referral_code, referred_by, created_at }

PUT /user/profile
  Body: { display_name?, email? }
  Response: { success: true, user: {...} }

DELETE /user/account
  Response: { success: true }  ← deletes all user data
```

### Account Endpoints (all protected)

```
GET    /accounts/bank
POST   /accounts/bank        Body: { bank_name, account_type, balance, color, icon, status, note? }
PUT    /accounts/bank/{id}   Body: { bank_name?, account_type?, balance?, color?, icon?, status?, note? }
DELETE /accounts/bank/{id}

GET    /accounts/card
POST   /accounts/card        Body: { card_name, card_type, due_amount, due_label, color, note? }
PUT    /accounts/card/{id}
DELETE /accounts/card/{id}

GET    /accounts/cash
POST   /accounts/cash        Body: { label, sublabel, amount }
PUT    /accounts/cash/{id}
DELETE /accounts/cash/{id}

GET    /accounts/investment
POST   /accounts/investment  Body: { name, amount, icon, color, note? }
PUT    /accounts/investment/{id}
DELETE /accounts/investment/{id}
```

### Transaction Endpoints

```
GET /transactions
  Query params: date_from?, date_to?, account_id?, account_type?, category?, type?, limit?, offset?
  Response: { data: Transaction[], total: number }

POST /transactions
  Body: { title, subtitle, amount, type, category, account_id?, account_type?, date, time, note? }

PUT /transactions/{id}
  Body: same as POST (partial allowed)

DELETE /transactions/{id}
```

### Category Endpoints

```
GET    /categories
POST   /categories    Body: { name, emoji, type, color }
DELETE /categories/{id}
```

### Budget Endpoints

```
GET    /budgets
POST   /budgets       Body: { category_id, amount, period }  ← upsert by category_id
DELETE /budgets/{id}
```

### Sync Endpoints

```
POST /sync/push
  Body: {
    accounts_bank: [...],
    accounts_card: [...],
    accounts_cash: [...],
    accounts_investment: [...],
    transactions: [...],
    categories: [...],
    budgets: [...]
  }
  Response: { success: true, synced_at: timestamp }
  Use: ONE-TIME call when free user upgrades to premium

GET /sync/pull
  Response: {
    user: {...},
    accounts_bank: [...],
    accounts_card: [...],
    accounts_cash: [...],
    accounts_investment: [...],
    transactions: [...],
    categories: [...],
    budgets: [...]
  }
  Use: Restore all data on new device install
```

### Membership Endpoints

```
POST /membership/upgrade
  Body: { sku: "moniqo_lite_monthly" | "moniqo_lite_annual" |
               "moniqo_full_monthly" | "moniqo_full_annual" | "moniqo_full_lifetime",
          purchase_token: "..." }
  Response: { success: true, membership: "premium_lite" | "premium_full", expiry: timestamp }

POST /membership/referral
  Body: { referral_code: "..." }
  Response: { success: true, reward_days: 30 }
```

### Standard API Response Format

```json
Success: { "success": true, "data": {...} }
Error:   { "success": false, "error": "Human readable message", "code": "ERROR_CODE" }
```

---

## Data Models (TypeScript)

```typescript
interface UserProfile {
  id: string;
  phone: string;
  displayName: string;
  email?: string;
  membership: 'free' | 'premium_lite' | 'premium_full';
  trialUsed: boolean;
  trialExpiry?: number;
  membershipExpiry?: number;
  referralCode: string;
  referredBy?: string;
  createdAt: number;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  balance: number;
  color: string;
  icon: 'bank' | 'piggy';
  status: 'ACTIVE' | 'INACTIVE';
  note?: string;
  createdAt: number;
}

interface CardAccount {
  id: string;
  cardName: string;
  cardType: string;
  dueAmount: number;
  dueLabel: string;
  color: string;
  note?: string;
  createdAt: number;
}

interface CashEntry {
  id: string;
  label: string;
  sublabel: string;
  amount: number;
  createdAt: number;
}

interface Investment {
  id: string;
  name: string;
  amount: number;
  icon: 'trend' | 'bitcoin' | 'gold' | 'other';
  color: string;
  note?: string;
  createdAt: number;
}

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  accountId?: string;
  accountType?: 'bank' | 'card' | 'cash' | 'investment';
  date: string;       // YYYY-MM-DD
  time: string;
  note?: string;
  createdAt: number;
}

interface AppCategory {
  id: string;
  name: string;
  emoji: string;
  type: 'expense' | 'income';
  color: string;
  isDefault: boolean;
  sortOrder: number;
  createdAt: number;
}

interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly';
  createdAt: number;
}
```

---

## Local SQLite Schema

See `ROADMAP.md` for the full SQLite schema. Tables:
- `accounts_bank`, `accounts_card`, `accounts_cash`, `accounts_investment`
- `transactions` (with indexes on date, account_id, category)
- `categories`, `budgets`

All IDs are UUID strings. Timestamps are Unix milliseconds (INTEGER).

---

## Key Source Files

| File | Purpose |
|------|---------|
| `src/services/authService.ts` | Phone OTP auth (will migrate from Firebase to PHP JWT) |
| `src/services/firestoreService.ts` | Currently Firestore — to be replaced by PHP API service |
| `src/services/apiService.ts` | NEW: PHP API client (JWT, refresh, all CRUD calls) |
| `src/store/authStore.tsx` | Auth state — user, isGuest, JWT tokens |
| `src/store/membershipStore.tsx` | Membership tier, trial, canAccess() |
| `src/store/accountsStore.ts` | Bank/Card/Cash/Investment state |
| `src/store/transactionsStore.ts` | Transactions state |
| `src/store/categoriesStore.tsx` | Categories state |
| `src/store/budgetStore.tsx` | Budget state |
| `src/db/database.ts` | SQLite singleton (op-sqlite) |
| `src/db/repositories/` | SQLite CRUD per entity |
| `src/config/apiConfig.ts` | API base URL (dev vs prod) |
| `src/types/index.ts` | All TypeScript interfaces |
| `src/hooks/useIAP.ts` | In-app purchase integration |

---

## IAP SKUs

| SKU | Tier | Duration |
|-----|------|----------|
| `moniqo_lite_monthly` | premium_lite | 31 days |
| `moniqo_lite_annual` | premium_lite | 366 days |
| `moniqo_full_monthly` | premium_full | 31 days |
| `moniqo_full_annual` | premium_full | 366 days |
| `moniqo_full_lifetime` | premium_full | No expiry |

---

## AdMob Unit IDs

- Banner: `ca-app-pub-9580571842187950/1296395673`
- Interstitial: `ca-app-pub-9580571842187950/2417905650`
- Rewarded: `ca-app-pub-9580571842187950/8934289109`
- Native: `ca-app-pub-9580571842187950/7621207431`

Ads are shown only when `canAccess('zero_ads')` returns false.

---

## Default Categories (seeded on first launch)

**Expense:** Food, Shopping, Transport, Bills, Health, Entertainment, Utilities, Others
**Income:** Salary, Freelance, Investment, Gift, Others

---

## Development Notes

- Phone numbers always stored with country code: `+91XXXXXXXXXX`
- All monetary amounts in INR (Indian Rupee), stored as float
- Dates stored as `YYYY-MM-DD` strings in SQLite, timestamps as Unix ms integers
- IDs generated as UUID v4 on the device, synced as-is to MySQL
- API writes for premium users are fire-and-forget (SQLite is source of truth)
- On API failure, data is safe in SQLite — retry sync later
