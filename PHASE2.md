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

- Use @notifee/react-native or react-native-push-notification
- Notification types (toggles already exist in Settings):
  - Transaction Alerts: confirm after each transaction is saved
  - Budget Warnings: when spending hits 80% / 100% of budget
  - Monthly Report: 1st of each month — summary of previous month
  - Weekly Digest: every Monday — last 7 days summary
- All scheduled locally, no server required

## Premium Tier — What's Included

| Feature                   | Free       | Premium        |
| ------------------------- | ---------- | -------------- |
| Accounts                  | Up to 3    | Unlimited      |
| Budgets                   | 1 category | All categories |
| Recurring transactions    | No         | Yes            |
| Export to CSV             | No         | Yes            |
| Analytics history         | 3 months   | All time       |
| Custom categories         | Up to 5    | Unlimited      |
| Multi-currency            | No         | Yes            |
| Cloud backup              | No         | Yes            |
| App lock (Biometrics/PIN) | No         | Yes            |
| Home screen widget        | No         | Yes            |

### Premium Implementation

- Use react-native-purchases (RevenueCat) for subscription management
- Products: Monthly plan, Annual plan (best value), Lifetime one-time purchase
- PremiumBanner component already exists in Settings screen
- Gate premium features with a usePremium() hook that checks subscription status
- Graceful degradation: show upgrade prompt when free limit is hit, never hard-block

## Priority Order

```
1. Transaction History + Edit/Delete        (done in phase 2 start)
2. FAB on all screens                       (quick win)
3. Transfer exclusion from Analytics        (data accuracy)
4. Budget feature                           (retention driver)
5. Push notifications (local)               (engagement)
6. Recurring transactions                   (power users)
7. Onboarding flow                          (new user retention)
8. Search & filter                          (usability)
9. In-app update                            (maintenance)
10. Dark mode                               (polish)
11. Premium infrastructure (RevenueCat)     (monetisation)
12. Export CSV                              (premium value)
13. App lock                                (premium value)
14. Multi-currency                          (premium value)
15. Cloud backup                            (premium value)
16. Widget                                  (premium value)
```
