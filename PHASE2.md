# Moniqo — Phase 2 Roadmap

---

## Phase Overview

| Phase             | Timeline | Focus                                                       |
| ----------------- | -------- | ----------------------------------------------------------- |
| Phase 1           | Done     | Core app — accounts, transactions, analytics (local SQLite) |
| Phase 2 (current) | March    | Polish, transaction history, edit/delete, transfer fixes    |
| Phase 3           | Next     | Firebase + Auth + Sync + Splitwise + Monetisation           |

---

## Phase 2 — In Progress

- Transaction History Screen (full list, grouped by date, search + filter)
- Edit & Delete Transactions (tap to edit, long-press to delete)

---

## Phase 2 — Planned Features

### 3. Transfer Exclusion from Analytics

Transfer transactions (category: 'transfer') currently inflate income and expense totals in the Analytics screen. They must be filtered out from all income/expense aggregations since they are neutral balance movements.

- Filter out transactions where category === 'transfer' in analyticsRepository
- Affects: income total, expense total, savings rate, category breakdown, top expenses
- No UI changes needed — purely a data layer fix

### 4. Budget Feature

Allow users to set a monthly spending limit per category and track progress.

- Budget model: { id, categoryId, amount, period: 'monthly', created_at }
- SQLite table: budgets
- UI: Budget screen or section in Analytics showing progress bars per category
- Alert when spending reaches 80% and 100% of budget
- Free tier: 1 active budget. Premium Lite/Full: unlimited budgets

### 5. Recurring Transactions

Allow transactions to repeat automatically on a schedule.

- Recurrence model: { id, title, amount, type, category, account_id, account_type, frequency: 'daily'|'weekly'|'monthly'|'yearly', nextDue: date, note }
- SQLite table: recurring_transactions
- Auto-create transaction on app open if nextDue <= today
- UI: Manage recurring transactions list in Settings or dedicated screen
- Available: Premium Lite and Premium Full

### 6. FAB on All Screens

The floating action button (add transaction) currently only appears on the Dashboard. It should be visible on all screens so users can add a transaction from anywhere without navigating back.

- Move FAB rendering out of the Dashboard-only condition in App.tsx
- Keep the same FabActionSheet flow

### 7. Onboarding Flow

First-launch walkthrough to guide new users.

- 3-4 step carousel: Welcome, Add your accounts, Track spending, Set budgets
- Store onboarding completion flag in AsyncStorage
- Show only once on first launch
- Skip button on every step
- On first launch: automatically activate 3-day Premium Full trial (no payment info required)

### 8. Search & Filter on Transaction History

- Search by title/note keyword
- Filter by: type (income/expense/transfer), category, account, date range
- Filter pill UI below search bar
- Results update in real time

### 9. Export to CSV

- Export all transactions or filtered range to CSV
- Share via native share sheet (react-native Share API)
- Columns: Date, Time, Title, Category, Type, Amount, Account, Note
- Available: Premium Full only

### 10. Dark Mode

- System-aware (follows device setting) with manual override in Settings
- All Colors tokens need dark variants
- Persist preference in AsyncStorage

### 11. Multi-Currency Support

- Add currency field to accounts
- Store exchange rates (manual entry or API)
- Convert all amounts to base currency (INR) for totals
- Available: Premium Full only

### 12. App Lock — Biometrics / PIN

- Lock app on background using react-native-biometrics
- Fallback to 4-digit PIN
- Setting toggle already present in Settings screen
- Available: Premium Lite and Premium Full

### 13. Home Screen Widget

- Show total balance and today's spend on home screen
- iOS: WidgetKit via native module
- Android: Glance widget
- Available: Premium Full only

### 14. In-App Update

- Library: `sp-react-native-in-app-updates` v1.5.0 + `react-native-device-info` (peer dep)
- Android: Native Play Core In-App Updates API — two modes:
  - Flexible: downloads in background, user keeps using app, prompts restart when ready
  - Immediate: full-screen blocking update UI for critical releases
- iOS: iTunes lookup API checks latest store version, shows native Alert prompt, deep links to App Store (Apple does not allow true in-app updates)
- iOS requires `itms-apps` added to `LSApplicationQueriesSchemes` in `Info.plist`
- Implementation: `src/hooks/useInAppUpdate.ts` hook called on app launch in `App.tsx`
- Settings row 'App Version' shows 'Update Available' badge when a newer version is detected

### 15. Local Push Notifications

- Library: `@notifee/react-native`
- Notification types (toggles already exist in Settings):
  - Transaction Alerts: confirm after each transaction is saved
  - Budget Warnings: when spending hits 80% / 100% of budget
  - Monthly Report: 1st of each month — summary of previous month
  - Weekly Digest: every Monday — last 7 days summary
- All scheduled locally, no server required
- Available: all tiers

---

## Firebase Sync Migration — To Do

> Context: User asked to migrate all transaction and account data from local SQLite to Firebase Firestore so everything syncs in real time. This is a pre-Phase 3 task — do it before the full Phase 3 monetisation work.

---

### Decision: Replace SQLite with Firestore entirely

- Drop `@op-engineering/op-sqlite` and the entire `src/db/` folder
- Firestore becomes the single source of truth (it has built-in offline persistence on mobile)
- All data scoped under `users/{uid}/` — clean multi-user support from day one
- No hybrid SQLite + Firestore — simpler architecture, less code to maintain

---

### Firestore Collection Structure

```
users/{uid}/
  ├── accounts_bank/{docId}        ← BankAccount
  ├── accounts_card/{docId}        ← CardAccount
  ├── accounts_cash/{docId}        ← CashEntry
  ├── accounts_investment/{docId}  ← Investment
  ├── transactions/{docId}         ← Transaction
  └── categories/{docId}           ← AppCategory
```

---

### Files to Create

| File                               | Purpose                                                             |
| ---------------------------------- | ------------------------------------------------------------------- |
| `src/services/firestoreService.ts` | All Firestore CRUD — replaces all 7 repositories                    |
| `src/utils/analytics.ts`           | Client-side analytics computations — replaces `analyticsRepository` |

### Files to Rewrite

| File                             | What Changes                                                            |
| -------------------------------- | ----------------------------------------------------------------------- |
| `src/store/accountsStore.ts`     | Swap SQLite calls for Firestore, use `onSnapshot` for real-time updates |
| `src/store/transactionsStore.ts` | Swap SQLite calls for Firestore, use `onSnapshot` for real-time updates |
| `src/store/categoriesStore.tsx`  | Swap SQLite calls for Firestore, seed default categories on first login |
| `src/services/firebase.ts`       | Add Firestore initialisation                                            |

### Files / Folders to Delete

| Path                   | Reason                                                         |
| ---------------------- | -------------------------------------------------------------- |
| `src/db/`              | Entire SQLite layer — schema, database, seed, all repositories |
| `src/data/mockData.ts` | Mock seed data no longer needed                                |

---

### Implementation Checklist

#### 1. Firestore Service (`src/services/firestoreService.ts`)

- [ ] Helper: `userCol(uid, collection)` — returns typed collection reference
- [ ] Bank accounts: `getBanks`, `addBank`, `updateBank`, `deleteBank`, `incrementBankBalance`
- [ ] Card accounts: `getCards`, `addCard`, `updateCard`, `deleteCard`, `incrementCardDue`
- [ ] Cash accounts: `getCash`, `addCash`, `updateCash`, `deleteCash`, `incrementCashBalance`
- [ ] Investments: `getInvestments`, `addInvestment`, `updateInvestment`, `deleteInvestment`, `incrementInvestmentAmount`
- [ ] Transactions: `getTransactions`, `addTransaction`, `updateTransaction`, `deleteTransaction`
- [ ] Categories: `getCategories`, `addCategory`, `deleteCategory`, `seedDefaultCategories`
- [ ] Use `FieldValue.increment()` for all balance delta operations
- [ ] Use Firestore auto-generated IDs (`doc().id`) — drop `generateId()`

#### 2. Accounts Store (`src/store/accountsStore.ts`)

- [ ] Replace `loadInitialState()` (synchronous SQLite) with `onSnapshot` listeners on all 4 account collections
- [ ] All dispatch actions become async Firestore writes
- [ ] Unsubscribe all listeners on unmount
- [ ] Keep same context API shape so no consumer components need to change

#### 3. Transactions Store (`src/store/transactionsStore.ts`)

- [ ] Replace synchronous `getAllTransactions()` with `onSnapshot` on `transactions` collection
- [ ] `ADD`, `UPDATE`, `DELETE` actions write to Firestore (store updates automatically via listener)
- [ ] Order by `date DESC` in the Firestore query

#### 4. Categories Store (`src/store/categoriesStore.tsx`)

- [ ] On first login: check if categories collection is empty → seed 13 default categories
- [ ] Use `onSnapshot` for live category list
- [ ] `addCategory` and `deleteCategory` write to Firestore

#### 5. Analytics Utility (`src/utils/analytics.ts`)

- [ ] All functions take the in-memory `Transaction[]` array (already loaded via store)
- [ ] `getDailyTotals(transactions, from, to)` — group by date, sum income/expense
- [ ] `getWeeklyTotals(transactions, year, month)` — bucket into W1–W4
- [ ] `getMonthlyTotals(transactions, year)` — group by month
- [ ] `getSpendingByCategory(transactions, from, to)` — group by category, compute % share
- [ ] `getIncomeTotalForRange(transactions, from, to)`
- [ ] `getExpenseTotalForRange(transactions, from, to)`
- [ ] `getSavingsRate(transactions, from, to)`
- [ ] `getTopExpenses(transactions, limit, from?, to?)`
- [ ] All filter out `type === 'transfer'` from income/expense totals

#### 6. Analytics Screen

- [ ] Replace `analyticsRepository` calls with the new `src/utils/analytics.ts` functions
- [ ] Pass transactions from `useTransactions()` store hook

#### 7. Firestore Security Rules (set in Firebase Console)

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

#### 8. Firestore Indexes (set in Firebase Console or `firestore.indexes.json`)

- [ ] `transactions` — composite index: `date DESC`
- [ ] `transactions` — composite index: `(account_id ASC, date DESC)`
- [ ] `transactions` — composite index: `(category ASC, date DESC)`

#### 9. Cleanup

- [ ] Delete `src/db/` folder entirely
- [ ] Delete `src/data/mockData.ts`
- [ ] Remove `@op-engineering/op-sqlite` from `package.json`
- [ ] Remove `op-sqlite` pod from `ios/Podfile` and run `pod install`
- [ ] Remove SQLite native module from `android/app/build.gradle` if added

#### 10. Testing

- [ ] Fresh install: categories seeded correctly on first login
- [ ] Add transaction → appears instantly (onSnapshot)
- [ ] Delete account → transactions linked to it still visible (soft reference, no cascade)
- [ ] Kill app and reopen → data loads from Firestore offline cache
- [ ] Two devices logged in as same user → change on one reflects on other in real time

---

### Key Technical Notes

- **Delta balance updates**: use `FieldValue.increment(delta)` — atomic, no race conditions
- **Analytics**: computed client-side from the in-memory transactions array — no Cloud Functions needed
- **Offline**: Firestore's offline persistence is enabled by default on React Native — app works without internet
- **`date` field**: keep as ISO string `YYYY-MM-DD` — Firestore range queries on strings work fine
- **`created_at`**: store as Firestore `Timestamp` (not Unix ms integer)
- **No `accountsRepository.ts`**: account ops are split across 4 type-specific functions in `firestoreService.ts`
- **`AppCategory` type**: move from `categoryRepository.ts` into `src/types/index.ts` before starting

---

## Phase 3 — Firebase + Monetisation + Splitwise

### Architecture Decision

#### Data Strategy by Membership Tier

```
Free Member
  └── All data: local SQLite only
  └── No cloud sync
  └── No Firestore reads/writes (zero Firebase cost for free users)

Premium Lite
  └── Personal data: SQLite + synced to Firestore
  └── Cloud backup available
  └── No Splitwise

Premium Full
  └── Personal data: SQLite + synced to Firestore in real time
  └── Every transaction synced on save
  └── Splitwise: groups and expenses in Firestore
  └── SMS auto-parsing enabled
  └── All features unlocked
```

#### Why Hybrid SQLite + Firestore

- App works fully offline (SQLite is always the source of truth on device)
- Firestore is the cloud mirror — synced on save for premium users
- Free users never touch Firestore — keeps cloud costs near zero
- If user downgrades: local data stays, cloud sync pauses

#### Firestore Structure

```
users/{uid}
  ├── displayName: string
  ├── phone: string
  ├── email?: string
  ├── createdAt: timestamp
  ├── membership: 'free' | 'premium_lite' | 'premium_full'
  ├── membershipExpiry?: timestamp
  ├── trialUsed: boolean
  ├── referralCode: string              ← unique code per user
  ├── referredBy?: string               ← uid of who referred them
  ├── referralBonusExpiry?: timestamp   ← 1 month from referral signup
  ├── fcmToken: string
  └── settings: { currency, theme, weekStart, adsEnabled }

users/{uid}/transactions/{id}           ← mirror of SQLite (premium only)
users/{uid}/accounts/{id}              ← mirror of SQLite (premium only)
users/{uid}/budgets/{id}               ← mirror of SQLite (premium only)

groups/{groupId}                        ← Splitwise groups (premium full only)
  ├── name, createdBy, createdAt
  ├── members: [{ uid?, name, phone }]
  └── memberIds: [uid, ...]

groups/{groupId}/expenses/{id}
  ├── title, totalAmount, paidBy
  ├── splits: [{ uid?, name, phone, amount, settled }]
  ├── date, category, note
  └── createdAt

groups/{groupId}/settlements/{id}
  ├── fromUid/fromPhone, toUid/toPhone
  ├── amount, date, note
  └── linkedTransactionId
```

---

### 16. Firebase Integration

Full Firebase setup as the backend foundation.

#### Firebase Services Required

| Service         | Package                                | Purpose                               |
| --------------- | -------------------------------------- | ------------------------------------- |
| Firebase Core   | `@react-native-firebase/app`           | Base SDK, required by all modules     |
| Authentication  | `@react-native-firebase/auth`          | Phone OTP, Google, Apple sign-in      |
| Firestore       | `@react-native-firebase/firestore`     | Cloud data sync, splits, user profile |
| Cloud Messaging | `@react-native-firebase/messaging`     | Remote push notifications             |
| Crashlytics     | `@react-native-firebase/crashlytics`   | Crash reporting                       |
| Analytics       | `@react-native-firebase/analytics`     | User behaviour, screen tracking       |
| Remote Config   | `@react-native-firebase/remote-config` | Feature flags, pricing, A/B testing   |
| Storage         | `@react-native-firebase/storage`       | SQLite backup snapshots               |

#### Setup Steps

- Add `google-services.json` to `android/app/`
- Add `GoogleService-Info.plist` to `ios/Moniqo/`
- Initialize Firebase in `App.tsx` on mount
- Android: add `google-services` plugin to `android/build.gradle` and `android/app/build.gradle`
- iOS: run `pod install` after adding Firebase packages

#### Do We Need Cloud Functions?

- **No** — for most features, direct Firestore read/write from the app is sufficient
- **Yes** — only for sending FCM push notifications to OTHER users (e.g. split activity)
- Decision: skip Cloud Functions in Phase 3, add in Phase 4 only if push-on-split is needed
- Trade-off: users see split updates when they open the app, not via push — acceptable for Phase 3

#### Firestore Security Rules (Critical)

```js
// Users can only access their own data
match /users/{uid} {
  allow read, write: if request.auth.uid == uid;
}
match /users/{uid}/transactions/{id} {
  allow read, write: if request.auth.uid == uid;
}

// Only group members can access group data
match /groups/{groupId}/expenses/{id} {
  allow read, write: if request.auth.uid in
    get(/databases/$(database)/documents/groups/$(groupId)).data.memberIds;
}
```

---

### 17. Login Screen & Authentication

#### Sign-in Methods

- **Phone + OTP** (primary — no password, best UX for Indian users)
- **Google Sign-In** via `@react-native-google-signin/google-signin`
- **Apple Sign-In** via `@invertase/react-native-apple-authentication` (required for iOS App Store)
- **Guest / Skip** — full app works without login, prompt only when cloud features accessed

#### Screens

- `WelcomeScreen` — app branding, sign-in options, "Continue as Guest"
- `LoginScreen` — phone number entry with country code picker (default +91 India)
- `OtpScreen` — 6-digit OTP input, 60-second resend timer, auto-read on Android

#### Auth Flow

```
App launch
  → check Firebase Auth currentUser
  → if no user: WelcomeScreen
  → if user exists: Dashboard (skip login)

WelcomeScreen
  → Phone → LoginScreen → OtpScreen → check referral → Dashboard
  → Google/Apple → one tap → check referral → Dashboard
  → Guest → Dashboard (limited features, prompt on premium action)

On first login (new user):
  → create Firestore user document
  → generate unique referral code
  → activate 3-day Premium Full trial (trialUsed: true)
  → show onboarding flow
```

#### Referral Code Flow

```
User A shares referral code "MONIQO-A1B2"
        ↓
User B installs app, enters code on signup
        ↓
Firestore: users/B.referredBy = A.uid
Firestore: users/A.referralBonusExpiry = now + 30 days
Firestore: users/A.membership = 'premium_full' (for 30 days)
        ↓
User A gets notified: "Your friend joined! You got 1 month Premium Free"
```

---

### 18. Membership & Monetisation

#### Three Tiers

**Free Member**

- All core features: transactions, accounts, analytics, budgets (1 only), categories (5 custom max)
- Data stored locally in SQLite only — no cloud sync
- Ads shown (banner on Dashboard, interstitial max once per day)
- No Splitwise access
- No SMS parsing
- Referral reward: 1 month Premium Full if referred friend signs up

**Premium Lite**

- Everything in Free, plus:
- Unlimited budgets and custom categories
- Cloud sync to Firestore (transactions, accounts, budgets)
- Cloud backup and restore
- App lock (biometrics/PIN)
- Recurring transactions
- Ads still shown (banner only, no interstitial) — reduced ad load
- No Splitwise
- No SMS parsing
- No widget
- No CSV export

**Premium Full**

- Everything in Premium Lite, plus:
- Zero ads
- Splitwise expense splitting (unlimited groups and members)
- SMS auto-parsing (Android only)
- CSV export
- Multi-currency support
- Home screen widget
- All future premium features

#### Pricing (Suggested)

| Plan         | Monthly      | Annual                          | Lifetime        |
| ------------ | ------------ | ------------------------------- | --------------- |
| Premium Lite | ₹49 / month  | ₹399 / year (~₹33/mo, save 33%) | —               |
| Premium Full | ₹149 / month | ₹999 / year (~₹83/mo, save 44%) | ₹2,499 one-time |

- Annual plan is the recommended default (highlighted in UI)
- Lifetime only for Premium Full — one-time purchase, no recurring
- Pricing stored in Firebase Remote Config so it can be changed without app update

#### 3-Day Free Trial

- Automatically activated on first install — no payment info required
- User gets full Premium Full access for 3 days
- On day 3: notification "Your trial ends tomorrow — upgrade to keep your data synced"
- On expiry: membership reverts to Free, local data stays, cloud sync pauses
- Trial can only be used once per account (trialUsed flag in Firestore)

#### Premium Implementation (Option B — Manual via Firestore)

- No RevenueCat in Phase 3 — keep it simple
- In-app purchase via React Native IAP (`react-native-iap`)
- On successful purchase: update Firestore `users/{uid}.membership` and `membershipExpiry`
- App reads membership status from Firestore on launch and caches in AsyncStorage
- `useMembership()` hook returns current tier, expiry, and feature flags
- Manual verification: Apple/Google receipt stored in Firestore for audit
- Upgrade path: Free → Premium Lite → Premium Full (prorated if upgrading mid-cycle)

#### Ad Integration

- Library: Google AdMob via `react-native-google-mobile-ads`
- Ad placements:
  - Banner: bottom of Dashboard screen (Free and Premium Lite)
  - Interstitial: shown once per day max, on app open (Free only)
  - Never shown during transaction entry (bad UX)
- `useAds()` hook checks membership and returns whether ads should render
- Ad revenue offsets server costs for free users

---

### 19. Data Sync — SQLite to Firestore

#### Sync Strategy (Premium users only)

```
On transaction save (AddTransactionModal)
  → write to SQLite (always, instant)
  → if premium: write to Firestore (async, non-blocking)

On account update
  → write to SQLite
  → if premium: write to Firestore

On app launch (premium user)
  → fetch Firestore data
  → compare with SQLite by created_at / updated_at
  → merge: Firestore wins for conflicts (cloud is source of truth)
```

#### Sync Service

- `src/services/SyncService.ts` — handles all Firestore read/write
- Queue-based: if offline, queue writes and flush when connection restored
- Conflict resolution: last-write-wins by timestamp
- `src/hooks/useSync.ts` — exposes sync status (syncing, synced, error, offline)
- Sync status indicator in Dashboard header (small dot: green=synced, orange=syncing, red=error)

---

### 20. SMS Integration — Auto Transaction Parsing (Premium Full)

#### How It Works

- Android: BroadcastReceiver listens for incoming SMS from known bank sender IDs
- iOS: SMS access not available — show manual paste option instead
- Parse SMS body using regex for common Indian bank formats
- Extract: amount, merchant, account last 4 digits, transaction type (debit/credit)
- Show suggestion card on Dashboard: "We detected a transaction — add it?"
- User reviews pre-filled AddTransactionModal and confirms or dismisses

#### Supported Banks

- HDFC Bank (sender: HDFCBK)
- ICICI Bank (sender: ICICIB)
- SBI (sender: SBIINB)
- Axis Bank (sender: AXISBK)
- Kotak Mahindra (sender: KOTAKB)
- Paytm, PhonePe, GPay UPI alerts

#### Permissions

- Android: `READ_SMS` and `RECEIVE_SMS` — request at runtime with clear explanation
- Privacy notice: "SMS is read only on your device and never sent to any server"
- Settings toggle: "Auto-detect transactions from SMS" (default: off, user must opt in)

#### Implementation

- `src/services/SmsParser.ts` — regex engine for parsing bank SMS
- `src/hooks/useSmsListener.ts` — Android SMS BroadcastReceiver bridge
- Suggestion card component on Dashboard above Recent Transactions

---

### 21. Splitwise — Expense Splitting (Premium Full)

#### Core Concept

- Split expenses with friends and track who owes what
- Works with or without the other person having Moniqo
- If they have Moniqo + are logged in: real-time Firestore sync
- If they do not have Moniqo: notify via SMS or WhatsApp deep link

#### Split Types

| Type          | Example                              |
| ------------- | ------------------------------------ |
| Equal         | ₹2400 / 4 people = ₹600 each         |
| Exact amounts | You: ₹1000, Rahul: ₹800, Priya: ₹600 |
| Percentage    | You: 50%, Rahul: 30%, Priya: 20%     |
| By shares     | You: 2 shares, Rahul: 1 share        |

#### Debt Simplification

In a group with many expenses, the app calculates minimum transactions needed to settle all debts — same algorithm as Splitwise.

```
Without simplification:       With simplification:
Rahul owes you ₹600           Rahul owes you ₹200 (net)
You owe Priya ₹400            Priya owes Ankit ₹200
Priya owes Ankit ₹200
```

#### Notifying Non-Moniqo Users

When a split member does not have Moniqo:

- **WhatsApp**: deep link `whatsapp://send?text=...` with pre-filled message showing their share
- **SMS**: `sms:+91XXXXXXXXXX?body=...` deep link with split summary
- **Copy link**: shareable summary text copied to clipboard
- No backend or API needed — all deep links, works instantly

#### Analytics Integration

- Only YOUR share of a split expense counts in Analytics (not the full amount)
- Settled amounts appear as Transfer In transactions in the ledger
- Unsettled amounts shown as "pending recovery" — separate from expense totals

#### Screens

- `SplitsScreen` — you are owed / you owe summary, active groups list
- `GroupDetailScreen` — members, all expenses, net balances, settle up button
- `AddSplitExpenseScreen` — amount, who paid, split type, member selector
- `ExpenseDetailScreen` — per-person breakdown of one expense
- `SettleUpScreen` — mark settled, creates Transfer transaction in ledger

#### No Cloud Functions Needed

- All Firestore reads/writes happen directly from the app
- Real-time sync via Firestore listeners (no polling)
- Push notifications for split activity deferred to Phase 4 (requires Cloud Functions)
- Phase 3 trade-off: users see split updates when they open the app

---

### 22. Push Notifications (Remote via FCM)

- FCM token saved to Firestore on login
- Remote notifications triggered by Cloud Functions (Phase 4)
- Phase 3: local notifications only via `@notifee/react-native`
- Notification types:
  - Transaction saved confirmation
  - Budget warning (80% and 100%)
  - Monthly report (1st of month)
  - Weekly digest (every Monday)
  - Trial expiry reminder (day before trial ends)
  - Referral reward received

---

### 23. Firebase Analytics + Crashlytics

#### Analytics Events to Track

- `app_open`, `transaction_added`, `transaction_deleted`
- `budget_set`, `budget_exceeded`
- `split_created`, `split_settled`
- `premium_viewed`, `premium_purchased`, `trial_started`, `trial_expired`
- `referral_shared`, `referral_redeemed`
- `sms_suggestion_accepted`, `sms_suggestion_dismissed`

#### Crashlytics

- Automatic crash reporting
- Set user context on login: `crashlytics().setUserId(uid)`
- Log non-fatal errors in sync service and SMS parser
- Error boundaries around critical screens

#### Remote Config Keys

| Key                            | Default | Purpose                             |
| ------------------------------ | ------- | ----------------------------------- |
| `premium_lite_monthly_price`   | 49      | Pricing (changeable without update) |
| `premium_lite_annual_price`    | 399     | Pricing                             |
| `premium_full_monthly_price`   | 149     | Pricing                             |
| `premium_full_annual_price`    | 999     | Pricing                             |
| `premium_full_lifetime_price`  | 2499    | Pricing                             |
| `trial_duration_days`          | 3       | Trial length                        |
| `enable_sms_parsing`           | false   | Feature flag                        |
| `enable_splitwise`             | false   | Feature flag                        |
| `interstitial_frequency_hours` | 24      | Ad frequency cap                    |
| `referral_bonus_days`          | 30      | Referral reward duration            |

---

## Membership Feature Matrix

| Feature                   | Free                  | Premium Lite | Premium Full  |
| ------------------------- | --------------------- | ------------ | ------------- |
| Transactions              | Unlimited             | Unlimited    | Unlimited     |
| Accounts                  | Up to 3               | Unlimited    | Unlimited     |
| Budgets                   | 1                     | Unlimited    | Unlimited     |
| Custom categories         | Up to 5               | Unlimited    | Unlimited     |
| Recurring transactions    | No                    | Yes          | Yes           |
| Cloud sync (Firestore)    | No                    | Yes          | Yes           |
| Cloud backup              | No                    | Yes          | Yes           |
| App lock (biometrics/PIN) | No                    | Yes          | Yes           |
| Ads                       | Banner + interstitial | Banner only  | No ads        |
| Splitwise splitting       | No                    | No           | Yes           |
| SMS auto-parsing          | No                    | No           | Yes (Android) |
| CSV export                | No                    | No           | Yes           |
| Multi-currency            | No                    | No           | Yes           |
| Home screen widget        | No                    | No           | Yes           |
| Analytics history         | 3 months              | All time     | All time      |
| 3-day free trial          | Yes (auto)            | —            | —             |
| Referral reward           | 1 month Premium Full  | —            | —             |

---

## Priority Order — Phase 3

```
1.  Firebase Core + Auth setup              (foundation)
2.  Login screen (Phone OTP + Google)       (user identity)
3.  Firestore user profile + membership     (membership system)
4.  3-day trial activation on first launch  (conversion)
5.  Referral code system                    (viral growth)
6.  useMembership() hook + feature gating   (gates all premium features)
7.  AdMob integration                       (free tier revenue)
8.  SQLite → Firestore sync service         (premium value)
9.  Local push notifications (@notifee)     (engagement)
10. SMS integration (Android)               (killer feature)
11. Splitwise — local split tracking        (social feature)
12. Splitwise — Firestore sync              (real-time splits)
13. In-app purchase (react-native-iap)      (monetisation)
14. Crashlytics + Analytics events          (observability)
15. Remote Config                           (pricing + flags)
16. In-app update                           (maintenance)
17. Onboarding flow                         (new user retention)
18. Dark mode                               (polish)
19. CSV export                              (premium value)
20. Multi-currency                          (premium value)
21. Home screen widget                      (premium value)
22. Cloud Functions + remote push           (Phase 4)
```

---

## Phase 2 Priority Order

```
1.  Transaction History + Edit/Delete        (done)
2.  FAB on all screens                       (quick win)
3.  Transfer exclusion from Analytics        (data accuracy)
4.  Budget feature                           (retention driver)
5.  Local push notifications                 (engagement)
6.  Recurring transactions                   (power users)
7.  Onboarding flow                          (new user retention)
8.  Search & filter on history               (usability)
9.  In-app update                            (maintenance)
10. Dark mode                                (polish)
11. App lock                                 (security)
```
