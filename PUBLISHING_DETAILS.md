# Moniqo — Google Play Store Publishing Details

---

## 1. App Identity

| Field | Value |
|-------|-------|
| **App Name** | Moniqo |
| **Package Name (applicationId)** | `com.ph.moniqo` |
| **Version Name** | 1.0 |
| **Version Code** | 4 |
| **Bundle ID (iOS)** | `com.ph.moniqo` |

---

## 2. Store Listing — Text Content

### Short Description (max 80 characters)
```
Track expenses, manage budgets & sync finances with Moniqo.
```

### Full Description (max 4000 characters)
```
Moniqo — Personal Finance Manager

Take control of your money with Moniqo, the all-in-one personal finance app designed for smart money management.

TRACK ALL YOUR ACCOUNTS
• Bank accounts, credit cards, investment portfolios, and cash wallets — all in one place.
• Real-time balance overview on a beautiful dashboard.
• Transfer money between accounts with automatic paired transactions.

RECORD EVERY TRANSACTION
• Log income, expenses, and transfers in seconds.
• Organize with 13+ default categories or create your own with custom emoji and colors.
• Full transaction history with search, filters by type, category, account, and date range.

POWERFUL ANALYTICS
• Income vs Expense charts for Week, Month, and Year.
• Spending breakdown by category with percentages.
• Top expenses list and savings rate tracker.
• Navigate through previous and future periods instantly.

BUDGET MANAGEMENT
• Set monthly spending limits per category.
• Visual progress bars with green/orange/red thresholds.
• Stay on top of your finances before you overspend.

PREMIUM LITE — ₹49/month or ₹399/year
• Unlimited budgets and categories
• Cloud sync & backup (Firebase)
• App lock with biometrics or PIN
• Recurring transactions

PREMIUM FULL — ₹149/month, ₹999/year, or ₹2,499 lifetime
• Everything in Premium Lite, plus:
• Zero ads
• CSV export
• Splitwise expense splitting
• SMS auto-parsing (Android)
• Multi-currency support
• Home screen widget
• Full analytics history

TRY FREE FOR 3 DAYS
New users get a free 3-day Premium Full trial — no credit card required.

SECURE & PRIVATE
• Sign in with Google or Phone OTP, or use Guest Mode with no account needed.
• Your data is protected with per-user Firestore security rules.
• Biometric app lock for extra privacy.

Download Moniqo today and start your journey to financial freedom.
```

### App Category
- **Primary:** Finance
- **Secondary:** Tools / Productivity

### Tags / Keywords
```
expense tracker, budget manager, personal finance, money manager, spending tracker,
income tracker, financial planning, budget planner, account manager, finance app India
```

---

## 3. Store Graphics & Assets

| Asset | Spec | File |
|-------|------|------|
| **App Icon (Hi-res)** | 512×512 px PNG | `design/android/play_store_512.png` |
| **Feature Graphic** | 1024×500 px | *(needs to be created)* |
| **Phone Screenshots** | Min 2, max 8 (16:9 or 9:16) | `design/dashboard.png`, `design/analytics.png`, `design/Accounts.png`, `design/addTransaction.png` |
| **Adaptive Icon** | Foreground + Background layers | `design/android/res/mipmap-anydpi-v26/` |

### Screenshots Available
1. `design/dashboard.png` — Dashboard / Home screen
2. `design/analytics.png` — Analytics screen
3. `design/Accounts.png` — Accounts screen
4. `design/addTransaction.png` — Add Transaction screen

> **Action Required:** Create a 1024×500 Feature Graphic for Play Store banner.

---

## 4. Android Version Support

| Setting | Value |
|---------|-------|
| **minSdkVersion** | 24 (Android 7.0 Nougat) |
| **targetSdkVersion** | 36 (Android 15) |
| **compileSdkVersion** | 36 (Android 15) |
| **buildToolsVersion** | 36.0.0 |
| **NDK Version** | 27.1.12297006 |

---

## 5. Permissions

### Declared in AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### Runtime / Implied Permissions
| Permission | Reason |
|------------|--------|
| **Internet** | Firebase sync, Google Sign-In, analytics |
| **Biometrics / Fingerprint** | App lock feature (Premium Lite+) |
| **Notifications** | Monthly reports, weekly digest (via Notifee) |
| **Receive SMS** | SMS auto-parsing — Premium Full (Android only, planned) |

---

## 6. In-App Products (IAP)

> Create all 5 products in **Google Play Console → Monetize → Products**

### Subscriptions (4 products)

#### Product 1: `moniqo_lite_monthly`
| Field | Value |
|-------|-------|
| Product ID | `moniqo_lite_monthly` |
| Name | Moniqo Premium Lite — Monthly |
| Base Plan ID | `lite-monthly` |
| Billing Period | Monthly (P1M) |
| Price | ₹49.00 |
| Free Trial | 3 days |
| Description | Unlimited budgets, cloud sync, app lock & recurring transactions. |

#### Product 2: `moniqo_lite_annual`
| Field | Value |
|-------|-------|
| Product ID | `moniqo_lite_annual` |
| Name | Moniqo Premium Lite — Annual |
| Base Plan ID | `lite-annual` |
| Billing Period | Yearly (P1Y) |
| Price | ₹399.00 |
| Free Trial | 3 days |
| Description | Unlimited budgets, cloud sync, app lock & recurring transactions — save vs monthly. |

#### Product 3: `moniqo_full_monthly`
| Field | Value |
|-------|-------|
| Product ID | `moniqo_full_monthly` |
| Name | Moniqo Premium Full — Monthly |
| Base Plan ID | `full-monthly` |
| Billing Period | Monthly (P1M) |
| Price | ₹149.00 |
| Free Trial | 3 days |
| Description | All Premium Lite features plus zero ads, CSV export, SMS parsing, multi-currency & widget. |

#### Product 4: `moniqo_full_annual`
| Field | Value |
|-------|-------|
| Product ID | `moniqo_full_annual` |
| Name | Moniqo Premium Full — Annual |
| Base Plan ID | `full-annual` |
| Billing Period | Yearly (P1Y) |
| Price | ₹999.00 |
| Free Trial | 3 days |
| Description | All Premium Full features for a full year — best value. |

---

### One-Time Purchase (1 product)

#### Product 5: `moniqo_full_lifetime`
| Field | Value |
|-------|-------|
| Product ID | `moniqo_full_lifetime` |
| Name | Moniqo Premium Full — Lifetime |
| Purchase Option ID | `lifetime-purchase` |
| Type | Non-consumable (Managed product) |
| Price | ₹2,499.00 |
| Description | Pay once, own forever. All Premium Full features with no recurring charges. |

---

## 7. Content Rating

### Questionnaire Answers (IARC / Play Console)
| Question | Answer |
|----------|--------|
| Violence | None |
| Sexual content | None |
| Profanity | None |
| Controlled substances | None |
| User-generated content | No |
| Shares location | No |
| Financial transactions | Yes (subscriptions via Google Play Billing) |
| Personal info collected | Yes (name, phone number, email via Firebase Auth) |
| Target age group | General audience (16+) |

**Expected Rating:** Everyone / PEGI 3

---

## 8. Privacy Policy & Data Safety

### Data Safety (Play Console → Data Safety)

| Data Type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| Name | Yes | No | User profile display |
| Phone number | Yes | No | Firebase Phone Auth |
| Email address | Yes (Google Sign-In) | No | Authentication |
| Financial info (transactions, budgets) | Yes | No | Core app functionality |
| App interactions | Yes | No | Firebase Analytics |
| Crash logs | Yes | No | Firebase Crashlytics |

### Security Practices
- [x] Data is encrypted in transit (Firebase uses TLS)
- [x] Data is encrypted at rest (Firestore)
- [x] Users can request data deletion (via account deletion)
- [ ] Privacy policy URL — **Action Required: host and add URL**

> **Action Required:** Create and host a Privacy Policy page. Add the URL in:
> - Play Console → Store Listing → Privacy Policy URL
> - App Settings screen → Privacy Policy row

---

## 9. Firebase / Google Services

| Service | Details |
|---------|---------|
| **Firebase Project ID** | `moniqo-cc889` |
| **Project Number** | `377396948837` |
| **Android App ID** | `1:377396948837:android:b172dcfe75154eb699fb8c` |
| **Storage Bucket** | `moniqo-cc889.firebasestorage.app` |
| **Google OAuth Web Client ID** | `377396948837-6oarsnto4b0hmfguns16t6k89ce71kr7.apps.googleusercontent.com` |

### Firebase Services Enabled
- [x] Firebase Authentication (Phone OTP + Google Sign-In)
- [x] Cloud Firestore (accounts, transactions, budgets, categories)
- [x] Firebase Analytics
- [x] Firebase Crashlytics
- [x] Firebase Cloud Messaging (via Notifee)

---

## 10. Signing & Release

### Release Keystore
| Field | Value |
|-------|-------|
| Keystore File | `moniqo-release.keystore` |
| Store Password | `MONIQO_UPLOAD_STORE_PASSWORD` (Gradle property) |
| Key Alias | `MONIQO_UPLOAD_KEY_ALIAS` (Gradle property) |
| Key Password | `MONIQO_UPLOAD_KEY_PASSWORD` (Gradle property) |

### Release Fingerprints (Register in Firebase Console)
```
SHA-1:   3F:F4:67:70:13:11:A3:FE:FD:B5:BA:B9:F7:2B:C9:45:D4:62:81:8C
SHA-256: 2F:8F:15:B8:F2:F1:DA:12:24:AF:D1:83:D8:3F:79:9F:C4:17:3C:74:1D:23:3F:51:E1:DC:09:FC:30:12:C6:A1
```

### Debug Fingerprints (For development)
```
SHA-1:   5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
SHA-256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
```

### Build Output
- Format: **AAB (Android App Bundle)** — required for Play Store
- Minification: **R8 enabled**
- Build command:
  ```bash
  cd android && ./gradlew bundleRelease
  ```
- Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 11. Play Console — Store Listing Checklist

### App Setup
- [ ] Create app in Play Console (App type: App, Free)
- [ ] Set default language: English (United States)
- [ ] Upload signed AAB to Internal Testing track
- [ ] Rollout to Internal Testing → Closed Testing → Production

### Store Listing
- [x] App name: **Moniqo**
- [x] Short description (80 chars)
- [x] Full description (4000 chars)
- [x] App icon 512×512 PNG (`design/android/play_store_512.png`)
- [ ] Feature graphic 1024×500 PNG — **create this**
- [x] Screenshots (min 2) — 4 available in `design/`
- [x] Category: Finance
- [ ] Tags / keywords
- [ ] Privacy policy URL — **host and add**
- [ ] Email address for users: `iamparthahudati@gmail.com`

### Content Rating
- [ ] Complete IARC questionnaire in Play Console
- [ ] Expected result: Everyone / PEGI 3

### Pricing & Distribution
- [ ] Price: Free (with in-app purchases)
- [ ] Countries: India (primary) — optionally worldwide
- [ ] Contains ads: No (ads only shown to free tier users via future AdMob integration)
- [ ] In-app purchases: Yes

### In-App Products
- [ ] Create `moniqo_lite_monthly` subscription
- [ ] Create `moniqo_lite_annual` subscription
- [ ] Create `moniqo_full_monthly` subscription
- [ ] Create `moniqo_full_annual` subscription
- [ ] Create `moniqo_full_lifetime` managed product

### Data Safety
- [ ] Fill Data Safety form in Play Console
- [ ] Declare: Name, Phone, Email, Financial info, App interactions, Crash logs

---

## 12. What's New (Release Notes for v1.0)

```
Initial release of Moniqo — Personal Finance Manager.

• Track bank accounts, credit cards, investments, and cash
• Log income, expense, and transfer transactions
• Analytics dashboard with weekly, monthly, and yearly views
• Budget management with per-category spending limits
• Cloud sync and backup with Firebase
• Google and Phone OTP sign-in, or Guest mode
• 3-day free trial of Premium Full for new users
```

---

## 13. Contact & Support Details (for Play Listing)

| Field | Value |
|-------|-------|
| **Developer Name** | Partha Hudati |
| **Email** | iamparthahudati@gmail.com |
| **Website** | *(add your website or GitHub page)* |
| **Privacy Policy URL** | *(to be created and hosted)* |

---

## 14. Pending Actions Before Submission

| # | Action | Priority |
|---|--------|----------|
| 1 | Create and host **Privacy Policy** page | Critical |
| 2 | Create **Feature Graphic** (1024×500 PNG) | Critical |
| 3 | Create Play Console app and upload AAB | Critical |
| 4 | Create all **5 IAP products** in Play Console | Critical |
| 5 | Complete **Content Rating** questionnaire | Critical |
| 6 | Fill **Data Safety** form | Critical |
| 7 | Add more **screenshots** (ideally 6–8) | Recommended |
| 8 | Add **AdMob** integration for free-tier ads | Optional |
| 9 | Create **Onboarding flow** | Optional |
| 10 | Add **dark mode** support | Optional |

---

*Generated: 2026-05-03 | App version: 1.0 (versionCode: 4)*
