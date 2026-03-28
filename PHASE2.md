# Moniqo — Phase 2 Roadmap

## In Progress

- Transaction History Screen (full list, grouped by date, search + filter)
- Edit & Delete Transactions (tap to edit, long-press to delete)

## Planned Features

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
- Free tier: 1 active budget. Premium: unlimited budgets

### 5. Recurring Transactions (Premium)

Allow transactions to repeat automatically on a schedule.

- Recurrence model: { id, title, amount, type, category, account_id, account_type, frequency: 'daily'|'weekly'|'monthly'|'yearly', nextDue: date, note }
- SQLite table: recurring_transactions
- Auto-create transaction on app open if nextDue <= today
- UI: Manage recurring transactions list in Settings or dedicated screen
- Premium only

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

### 8. Search & Filter on Transaction History

- Search by title/note keyword
- Filter by: type (income/expense/transfer), category, account, date range
- Filter pill UI below search bar
- Results update in real time

### 9. Export to CSV (Premium)

- Export all transactions or filtered range to CSV
- Share via native share sheet (react-native Share API)
- Columns: Date, Time, Title, Category, Type, Amount, Account, Note
- Premium only

### 10. Dark Mode

- System-aware (follows device setting) with manual override in Settings
- All Colors tokens need dark variants
- Persist preference in AsyncStorage

### 11. Multi-Currency Support (Premium)

- Add currency field to accounts
- Store exchange rates (manual entry or API)
- Convert all amounts to base currency (INR) for totals
- Premium only

### 12. Cloud Backup — iCloud / Google Drive (Premium)

- Export SQLite DB snapshot to iCloud (iOS) or Google Drive (Android)
- Restore from backup on new device
- Auto-backup toggle in Settings
- Premium only

### 13. App Lock — Biometrics / PIN (Premium)

- Lock app on background using react-native-biometrics or expo-local-authentication
- Fallback to 4-digit PIN
- Setting toggle already present in Settings screen
- Premium only

### 14. Home Screen Widget (Premium)

- Show total balance and today's spend on home screen
- iOS: WidgetKit via native module
- Android: Glance widget
- Premium only

### 15. In-App Update

- Library: `sp-react-native-in-app-updates` v1.5.0 + `react-native-device-info` (peer dep)
- Android: Native Play Core In-App Updates API — two modes:
  - Flexible: downloads in background, user keeps using app, prompts restart when ready
  - Immediate: full-screen blocking update UI for critical releases
- iOS: iTunes lookup API checks latest store version, shows native Alert prompt, deep links to App Store (Apple does not allow true in-app updates)
- iOS requires `itms-apps` added to `LSApplicationQueriesSchemes` in `Info.plist`
- Implementation: `src/hooks/useInAppUpdate.ts` hook called on app launch in `App.tsx`
- Settings row 'App Version' shows 'Update Available' badge when a newer version is detected

### 16. Push Notifications (Local)

- Library: `@notifee/react-native`
- Notification types (toggles already exist in Settings):
  - Transaction Alerts: confirm after each transaction is saved
  - Budget Warnings: when spending hits 80% / 100% of budget
  - Monthly Report: 1st of each month — summary of previous month
  - Weekly Digest: every Monday — last 7 days summary
- All scheduled locally, no server required

### 17. Firebase Integration

Full Firebase setup as the backend foundation for auth, remote notifications, crash reporting, and analytics.

#### Firebase Services Required

| Service               | Package                                | Purpose                                    |
| --------------------- | -------------------------------------- | ------------------------------------------ |
| Firebase Core         | `@react-native-firebase/app`           | Base SDK, required by all other modules    |
| Authentication        | `@react-native-firebase/auth`          | Phone/OTP, Google, Apple sign-in           |
| Cloud Messaging (FCM) | `@react-native-firebase/messaging`     | Remote push notifications                  |
| Crashlytics           | `@react-native-firebase/crashlytics`   | Crash reporting and error tracking         |
| Analytics             | `@react-native-firebase/analytics`     | User behaviour, screen tracking, events    |
| Remote Config         | `@react-native-firebase/remote-config` | Feature flags, premium config, A/B testing |

#### Setup Steps

- Add `google-services.json` to `android/app/`
- Add `GoogleService-Info.plist` to `ios/Moniqo/`
- Initialize Firebase in `App.tsx` on mount
- Android: add `google-services` plugin to `android/build.gradle` and `android/app/build.gradle`
- iOS: run `pod install` after adding Firebase packages

#### FCM — Remote Push Notifications

- Request notification permission on first launch (after onboarding)
- Save FCM token to user profile in Firestore for server-side targeting
- Handle foreground, background, and quit-state messages via `@react-native-firebase/messaging`
- Notification channels on Android (transaction alerts, budget warnings, promotions)
- Deep link from notification to relevant screen (e.g. tap budget warning → opens Budget screen)

#### Crashlytics

- Automatic crash reporting enabled by default
- Log custom errors: `crashlytics().recordError(error)`
- Set user attributes on login: `crashlytics().setUserId(uid)`
- Non-fatal error boundaries around critical screens

#### Analytics

- Track key events: `app_open`, `transaction_added`, `budget_set`, `premium_viewed`, `premium_purchased`
- Screen tracking: log screen name on every navigation change
- User properties: account_count, is_premium, preferred_currency

#### Remote Config

- Feature flags: `enable_splitwise`, `enable_sms_parsing`, `force_update_version`
- Premium pricing config: monthly_price, annual_price, lifetime_price
- Default values bundled in app, fetched and cached on launch with 1-hour TTL

### 18. Login Screen & Authentication

Full authentication flow using Firebase Auth.

#### Sign-in Methods

- **Phone + OTP** (primary — no password needed, best UX for Indian users)
- **Google Sign-In** via `@react-native-google-signin/google-signin`
- **Apple Sign-In** via `@invertase/react-native-apple-authentication` (required for iOS App Store)
- **Guest / Skip** — allow using the app without an account, prompt to sign in when cloud features are accessed

#### Screens

- `LoginScreen` — phone number entry with country code picker (default +91)
- `OtpScreen` — 6-digit OTP input with 60-second resend timer
- `WelcomeScreen` — shown before login, app branding + sign-in options

#### Flow

```
App launch
  → check AsyncStorage for auth token
  → if no token: WelcomeScreen → LoginScreen → OtpScreen → Onboarding → Dashboard
  → if token valid: Dashboard directly
  → if token expired: silent refresh via Firebase, fallback to LoginScreen
```

#### Data Model (Firestore)

```
users/{uid}
  displayName: string
  phone: string
  email?: string
  createdAt: timestamp
  isPremium: boolean
  premiumExpiry?: timestamp
  fcmToken: string
  settings: { currency, theme, weekStart }
```

#### Local vs Cloud Data

- All financial data (transactions, accounts) stays in SQLite on-device
- User profile, premium status, and FCM token synced to Firestore
- Cloud backup (phase 2 item 12) will optionally sync SQLite snapshot to Firebase Storage

### 19. SMS Integration — Auto Transaction Parsing

Automatically detect bank SMS messages and suggest transactions without manual entry.

#### How It Works

- Android: Read incoming SMS via `react-native-get-sms-android` or a native BroadcastReceiver
- iOS: SMS access is not available — show a manual paste option instead
- Parse SMS body using regex patterns for common Indian bank formats (HDFC, ICICI, SBI, Axis, Kotak)
- Extract: amount, merchant/payee, account last 4 digits, transaction type (debit/credit)
- Show a suggestion card on the Dashboard: "We detected a transaction — add it?"
- User reviews pre-filled AddTransactionModal and confirms or dismisses

#### Supported SMS Patterns

- Debit: "debited", "spent", "withdrawn", "paid"
- Credit: "credited", "received", "deposited"
- Amount: Rs./INR/₹ followed by amount with optional commas
- Account: "a/c XX1234" or "account ending XXXX"

#### Permissions

- Android: `READ_SMS` and `RECEIVE_SMS` permissions — request at runtime with explanation
- Show clear privacy notice: "SMS is read only on your device and never sent to any server"

#### Implementation

- `src/services/SmsParser.ts` — regex engine for parsing bank SMS
- `src/hooks/useSmsListener.ts` — listens for new SMS on Android
- Suggestion card component on Dashboard above Recent Transactions
- Settings toggle: "Auto-detect transactions from SMS" (default: off, user must opt in)
- Premium consideration: basic SMS parsing free, advanced multi-bank parsing premium

### 20. Splitwise-Style Expense Splitting

Allow users to split expenses with friends and track who owes what.

#### Core Concept

- Create a group or a one-off split with named participants
- Add an expense, assign who paid and split amounts (equal, percentage, or custom)
- Track balances: who owes you, who you owe
- Settle up: mark a balance as paid (creates a transfer transaction)

#### Data Model

```
Group: { id, name, members: Member[], created_at }
Member: { id, name, phone?, userId? }
SplitExpense: { id, groupId, title, totalAmount, paidBy: memberId, splits: Split[], date, note, category }
Split: { memberId, amount, settled: boolean }
Settlement: { id, fromMemberId, toMemberId, amount, date }
```

#### Screens

- `SplitsScreen` — list of active groups and one-off splits, total you are owed / you owe
- `GroupDetailScreen` — members, expenses, and net balances within a group
- `AddSplitExpenseScreen` — add expense, select who paid, split equally or custom
- `SettleUpScreen` — mark a split as settled, creates a transaction record

#### Integration with Transactions

- Settled splits automatically create a Transfer transaction in the main ledger
- Split expenses optionally appear in Analytics as expenses (your share only)

#### Sharing & Invites

- Share group invite via deep link or WhatsApp
- If invitee has Moniqo: syncs via Firestore (requires login)
- If invitee does not have Moniqo: track locally, share summary via SMS/WhatsApp text

#### Premium Consideration

- Free: up to 3 members per group, 1 active group
- Premium: unlimited groups and members, Firestore sync across devices

---

## Premium Tier — What's Included

| Feature                     | Free               | Premium        |
| --------------------------- | ------------------ | -------------- |
| Accounts                    | Up to 3            | Unlimited      |
| Budgets                     | 1 category         | All categories |
| Recurring transactions      | No                 | Yes            |
| Export to CSV               | No                 | Yes            |
| Analytics history           | 3 months           | All time       |
| Custom categories           | Up to 5            | Unlimited      |
| Multi-currency              | No                 | Yes            |
| Cloud backup                | No                 | Yes            |
| App lock (Biometrics/PIN)   | No                 | Yes            |
| Home screen widget          | No                 | Yes            |
| SMS auto-parsing (advanced) | Basic only         | All banks      |
| Expense splitting           | 1 group, 3 members | Unlimited      |
| Remote sync (Splitwise)     | No                 | Yes            |

### Premium Implementation

- Use `react-native-purchases` (RevenueCat) for subscription management
- Products: Monthly plan, Annual plan (best value), Lifetime one-time purchase
- Premium status synced to Firestore `users/{uid}.isPremium` field
- PremiumBanner component already exists in Settings screen
- Gate premium features with a `usePremium()` hook that checks subscription status
- Remote Config controls pricing and feature flag visibility
- Graceful degradation: show upgrade prompt when free limit is hit, never hard-block

---

## Priority Order

```
1.  Transaction History + Edit/Delete        (done in phase 2 start)
2.  FAB on all screens                       (quick win)
3.  Transfer exclusion from Analytics        (data accuracy)
4.  Firebase Core setup                      (foundation for everything below)
5.  Login screen + Firebase Auth             (user identity)
6.  FCM remote push notifications            (engagement)
7.  Budget feature                           (retention driver)
8.  SMS integration                          (killer feature for Indian market)
9.  Local push notifications                 (engagement)
10. Recurring transactions                   (power users)
11. Expense splitting (Splitwise)            (social/viral feature)
12. Onboarding flow                          (new user retention)
13. Search & filter                          (usability)
14. In-app update                            (maintenance)
15. Crashlytics + Analytics                  (observability)
16. Remote Config                            (feature flags)
17. Dark mode                                (polish)
18. Premium infrastructure (RevenueCat)      (monetisation)
19. Export CSV                               (premium value)
20. App lock                                 (premium value)
21. Multi-currency                           (premium value)
22. Cloud backup                             (premium value)
23. Widget                                   (premium value)
```
