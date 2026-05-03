# ── React Native ──────────────────────────────────────────────────────────────
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**

# ── React Native New Architecture / Nitro Modules ─────────────────────────────
-keep class com.margelo.nitro.** { *; }
-dontwarn com.margelo.nitro.**

# ── Firebase ──────────────────────────────────────────────────────────────────
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# ── Firebase Crashlytics ──────────────────────────────────────────────────────
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
-keep class com.google.firebase.crashlytics.** { *; }

# ── Google Sign-In ────────────────────────────────────────────────────────────
-keep class com.google.android.gms.auth.** { *; }
-keep class com.google.android.gms.common.** { *; }

# ── react-native-iap / Google Play Billing ────────────────────────────────────
-keep class com.android.billingclient.** { *; }
-keep class com.dooboolab.rniap.** { *; }
-dontwarn com.android.billingclient.**

# ── Notifee ───────────────────────────────────────────────────────────────────
-keep class io.invertase.notifee.** { *; }
-dontwarn io.invertase.notifee.**

# ── Kotlin ────────────────────────────────────────────────────────────────────
-keep class kotlin.** { *; }
-keep class kotlinx.** { *; }
-dontwarn kotlin.**
-dontwarn kotlinx.**

# ── OkHttp / Networking ───────────────────────────────────────────────────────
-dontwarn okhttp3.**
-dontwarn okio.**

# ── General ───────────────────────────────────────────────────────────────────
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
