import { StyleSheet } from 'react-native';

const Colors = {
  primary: '#2B3FE8',
  primaryDark: '#1E2FD0',
  white: '#FFFFFF',
  background: '#F5F6FA',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  incomeGreen: '#22C55E',
  trialBg: '#EEF1FD',
  recommendedBg: '#2B3FE8',
  freeBadgeBg: '#F1F5F9',
};

export const styles = StyleSheet.create({
  // ── Modal & container ──────────────────────────────────────────────────────
  modal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.textPrimary,
    lineHeight: 20,
    fontWeight: '500',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 36,
  },

  // ── Scroll content ─────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // ── Trial banner ───────────────────────────────────────────────────────────
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.trialBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D0F8',
  },
  trialDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  trialText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    flex: 1,
  },

  // ── Guest prompt ───────────────────────────────────────────────────────────
  guestPrompt: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  guestIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.trialBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  guestIconText: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: '700',
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  guestSignInButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  guestSignInText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },

  // ── Section label ──────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },

  // ── Tier card ──────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  cardRecommended: {
    borderColor: Colors.primary,
  },

  // ── Recommended badge ──────────────────────────────────────────────────────
  recommendedBadge: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  recommendedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 1.2,
  },

  // ── Card body ──────────────────────────────────────────────────────────────
  cardBody: {
    padding: 20,
  },

  // ── Card header row ────────────────────────────────────────────────────────
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tierNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tierName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  activePill: {
    backgroundColor: Colors.trialBg,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#C7D0F8',
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  freePill: {
    backgroundColor: Colors.freeBadgeBg,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  freePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // ── Pricing ────────────────────────────────────────────────────────────────
  priceBlock: {
    alignItems: 'flex-end',
  },
  priceMain: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  priceFree: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: -0.5,
  },
  priceAnnual: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  priceLifetime: {
    fontSize: 12,
    color: Colors.incomeGreen,
    marginTop: 2,
    fontWeight: '600',
  },

  // ── Divider ────────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },

  // ── Feature list ───────────────────────────────────────────────────────────
  featureList: {
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureBullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.trialBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  featureBulletActive: {
    backgroundColor: Colors.primary,
  },
  featureBulletFree: {
    backgroundColor: Colors.freeBadgeBg,
  },
  featureBulletText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    lineHeight: 12,
  },
  featureBulletTextActive: {
    color: Colors.white,
  },
  featureBulletTextFree: {
    color: Colors.textSecondary,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },

  // ── CTA button ─────────────────────────────────────────────────────────────
  ctaButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonLite: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.2,
  },
  ctaButtonTextLite: {
    color: Colors.primary,
  },
  currentPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  currentPlanCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.incomeGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentPlanCheckText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
  },
  currentPlanText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // ── Footer note ────────────────────────────────────────────────────────────
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
    lineHeight: 18,
  },
});
