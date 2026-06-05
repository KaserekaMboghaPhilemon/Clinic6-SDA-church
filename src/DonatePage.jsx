import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { translations } from './translations';

/*
  DonatePage architecture:
  - Currency layer: quick groups + full searchable list.
  - Conversion layer: USD tiers mapped to selected currency.
  - Checkout layer: payment details, QR payload, and status modal.
*/

/*
  DonatePage architecture:
  - Currency layer: quick groups + full searchable currency list.
  - Conversion layer: USD base tiers converted via live/fallback rates.
  - Checkout layer: payment instructions, QR payload, and modal feedback.
*/

/* Base impact amounts are maintained in USD, then converted for display/use. */
const IMPACT_TIERS = [
  { labelKey: 'seat', usd: 25 },
  { labelKey: 'row', usd: 150 },
  { labelKey: 'block', usd: 500 },
];

// Static currency metadata used as a fallback when live rates are unavailable.
const CURRENCY_META = {
  USD: { code: 'USD', name: 'US Dollar', countryCode: 'us', locale: 'en-US', rate: 1, decimals: 2, step: 1 },
  EUR: { code: 'EUR', name: 'Euro', countryCode: 'eu', locale: 'de-DE', rate: 0.92, decimals: 2, step: 1 },
  GBP: { code: 'GBP', name: 'British Pound', countryCode: 'gb', locale: 'en-GB', rate: 0.79, decimals: 2, step: 1 },
  KES: { code: 'KES', name: 'Kenyan Shilling', countryCode: 'ke', locale: 'en-KE', rate: 130, decimals: 0, step: 50 },
  UGX: { code: 'UGX', name: 'Ugandan Shilling', countryCode: 'ug', locale: 'en-UG', rate: 3700, decimals: 0, step: 1000 },
  TZS: { code: 'TZS', name: 'Tanzanian Shilling', countryCode: 'tz', locale: 'sw-TZ', rate: 2600, decimals: 0, step: 1000 },
  RWF: { code: 'RWF', name: 'Rwandan Franc', countryCode: 'rw', locale: 'rw-RW', rate: 1320, decimals: 0, step: 500 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', countryCode: 'ca', locale: 'en-CA', rate: 1.37, decimals: 2, step: 1 },
  AUD: { code: 'AUD', name: 'Australian Dollar', countryCode: 'au', locale: 'en-AU', rate: 1.51, decimals: 2, step: 1 },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', countryCode: 'nz', locale: 'en-NZ', rate: 1.64, decimals: 2, step: 1 },
  CHF: { code: 'CHF', name: 'Swiss Franc', countryCode: 'ch', locale: 'de-CH', rate: 0.9, decimals: 2, step: 1 },
  JPY: { code: 'JPY', name: 'Japanese Yen', countryCode: 'jp', locale: 'ja-JP', rate: 157, decimals: 0, step: 10 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', countryCode: 'cn', locale: 'zh-CN', rate: 7.25, decimals: 2, step: 1 },
  INR: { code: 'INR', name: 'Indian Rupee', countryCode: 'in', locale: 'en-IN', rate: 83.4, decimals: 0, step: 10 },
  BRL: { code: 'BRL', name: 'Brazilian Real', countryCode: 'br', locale: 'pt-BR', rate: 5.4, decimals: 2, step: 1 },
  ZAR: { code: 'ZAR', name: 'South African Rand', countryCode: 'za', locale: 'en-ZA', rate: 18.2, decimals: 2, step: 1 },
  NGN: { code: 'NGN', name: 'Nigerian Naira', countryCode: 'ng', locale: 'en-NG', rate: 1510, decimals: 0, step: 50 },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', countryCode: 'gh', locale: 'en-GH', rate: 15.2, decimals: 2, step: 1 },
  EGP: { code: 'EGP', name: 'Egyptian Pound', countryCode: 'eg', locale: 'ar-EG', rate: 49, decimals: 2, step: 1 },
  MAD: { code: 'MAD', name: 'Moroccan Dirham', countryCode: 'ma', locale: 'fr-MA', rate: 10, decimals: 2, step: 1 },
  AED: { code: 'AED', name: 'UAE Dirham', countryCode: 'ae', locale: 'ar-AE', rate: 3.67, decimals: 2, step: 1 },
  SAR: { code: 'SAR', name: 'Saudi Riyal', countryCode: 'sa', locale: 'ar-SA', rate: 3.75, decimals: 2, step: 1 },
  QAR: { code: 'QAR', name: 'Qatari Riyal', countryCode: 'qa', locale: 'ar-QA', rate: 3.64, decimals: 2, step: 1 },
  TRY: { code: 'TRY', name: 'Turkish Lira', countryCode: 'tr', locale: 'tr-TR', rate: 32.5, decimals: 2, step: 1 },
  RUB: { code: 'RUB', name: 'Russian Ruble', countryCode: 'ru', locale: 'ru-RU', rate: 90, decimals: 2, step: 1 },
  KRW: { code: 'KRW', name: 'South Korean Won', countryCode: 'kr', locale: 'ko-KR', rate: 1370, decimals: 0, step: 50 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', countryCode: 'sg', locale: 'en-SG', rate: 1.35, decimals: 2, step: 1 },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', countryCode: 'hk', locale: 'zh-HK', rate: 7.8, decimals: 2, step: 1 },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', countryCode: 'my', locale: 'ms-MY', rate: 4.7, decimals: 2, step: 1 },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', countryCode: 'id', locale: 'id-ID', rate: 16200, decimals: 0, step: 500 },
  THB: { code: 'THB', name: 'Thai Baht', countryCode: 'th', locale: 'th-TH', rate: 36.6, decimals: 2, step: 1 },
  PHP: { code: 'PHP', name: 'Philippine Peso', countryCode: 'ph', locale: 'en-PH', rate: 58.5, decimals: 2, step: 1 },
  VND: { code: 'VND', name: 'Vietnamese Dong', countryCode: 'vn', locale: 'vi-VN', rate: 25400, decimals: 0, step: 1000 },
  MXN: { code: 'MXN', name: 'Mexican Peso', countryCode: 'mx', locale: 'es-MX', rate: 18.2, decimals: 2, step: 1 },
  ARS: { code: 'ARS', name: 'Argentine Peso', countryCode: 'ar', locale: 'es-AR', rate: 890, decimals: 0, step: 20 },
  CLP: { code: 'CLP', name: 'Chilean Peso', countryCode: 'cl', locale: 'es-CL', rate: 930, decimals: 0, step: 20 },
  COP: { code: 'COP', name: 'Colombian Peso', countryCode: 'co', locale: 'es-CO', rate: 4000, decimals: 0, step: 100 },
  PEN: { code: 'PEN', name: 'Peruvian Sol', countryCode: 'pe', locale: 'es-PE', rate: 3.75, decimals: 2, step: 1 },
};

// Quick-select groups shown before the full global currency list.
const CURRENCY_GROUPS = [
  { label: 'Global', codes: ['USD', 'EUR', 'GBP'] },
  { label: 'East Africa', codes: ['KES', 'UGX', 'TZS', 'RWF'] },
];

// Currencies commonly represented without decimal places.
const ZERO_DECIMAL_CURRENCIES = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);

// Representative flags for region-wide currency codes.
const CURRENCY_FLAG_HINTS = {
  EUR: 'eu',
  XAF: 'cm',
  XCD: 'ag',
  XOF: 'sn',
  XPF: 'pf',
};

// Payment options rendered in the method selector.
const PAYMENT_METHODS = [
  { id: 'mpesa', labelKey: 'mpesa' },
  { id: 'bank', labelKey: 'bank' },
  { id: 'wire', labelKey: 'wire' },
];

const PAYBILL = '247247';
const ACCOUNT = '1650280005225';
const BANK = 'Equity Bank, Lokichogio Branch';
const SWIFT = 'EQBLKENAXXX';

// Current top-priority project presented to donors on the giving page.
const MAIN_SUPPORT_PROJECT = {
  title: 'Sanctuary Reconstruction (Phase 1)',
  need: 'Steel structure, roofing sheets, safe seating base for 868 worshippers, and compound woven-wire security fencing',
  urgency: 'Critical need after storm damage to the temporary worship shelter.',
  tiers: [
    {
      name: 'Foundation Tier',
      usd: 150,
      focus: 'Supports structural steel columns and anchor points.',
    },
    {
      name: 'Roofing Tier',
      usd: 500,
      focus: 'Covers roofing sheets and weather protection sections.',
    },
    {
      name: 'Sanctuary Tier',
      usd: 1200,
      focus: 'Funds combined roofing and safe seating base completion.',
    },
  ],
};

// Multiple projects donors can support in one donation.
const PROJECT_OPTIONS = [
  { id: 'sanctuary', name: 'Sanctuary Reconstruction' },
  { id: 'seating', name: 'Sanctuary Seating Program' },
  { id: 'fencing', name: 'Compound Fencing (Woven Wire Security)' },
  { id: 'children', name: 'Children Ministry Spaces' },
  { id: 'clinic', name: 'Community Clinic Setup' },
  { id: 'water', name: 'Jordan Initiative Water Infrastructure' },
];

// UI copy fallback to avoid missing-translation rendering issues.
const DONATE_FALLBACK_TEXT = {
  mpesa: 'M-Pesa',
  bank: 'Bank',
  wire: 'SWIFT Wire',
  seat: 'Sponsor a Seat',
  row: 'Sponsor a Row',
  block: 'Sponsor a Block',
  impactNone: 'No seats covered yet',
  impactOne: 'Covers 1 seat',
  impactMany: 'Covers {count} seats',
  processing: 'Processing donation details...',
  processingSub: 'Preparing your payment instructions',
  success: 'Payment details ready',
  successSub: 'Use the account details below to complete your transfer.',
  copiedAcc: 'Copied account',
  close: 'Close',
  chooseTier: 'Choose an impact tier',
  customAmount: 'Custom amount',
  qrScan: 'Scan this QR for payment details',
  titheBoundary: 'These funds are freewill offerings above tithe and are managed through church treasury controls.',
  chooseMethod: 'Choose payment method',
  paymentDetails: 'Payment details',
  chooseCurrency: 'Choose currency',
  openMpesa: 'Open M-Pesa',
  donateNow: 'Donate Now',
  copied: 'Account copied to clipboard',
};

/* Convert from USD using static metadata rates (fallback path). */
// Convert from USD using static metadata rates (fallback path).
function convertUsd(usdAmount, currencyCode) {
  const meta = resolveCurrencyMeta(currencyCode);
  const raw = usdAmount * meta.rate;
  return meta.decimals === 0 ? Math.round(raw) : Number(raw.toFixed(meta.decimals));
}

/* Format amount according to selected currency locale and decimal precision. */
// Format amount using locale and precision for the chosen currency.
function formatMoney(amount, currencyCode) {
  const meta = resolveCurrencyMeta(currencyCode);
  return new Intl.NumberFormat(meta.locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  }).format(amount);
}

/* Build the all-currency list from browser-supported ISO codes when available. */
// Build currency codes from browser-supported values where possible.
function getSupportedCurrencyCodes() {
  if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
    return Intl.supportedValuesOf('currency').sort();
  }
  return Object.keys(CURRENCY_META).sort();
}

/* Resolve display metadata for any currency code with robust fallbacks. */
// Resolve all UI metadata for any currency with safe fallbacks.
function resolveCurrencyMeta(currencyCode, browserLocale = 'en-US') {
  const code = (currencyCode || 'USD').toUpperCase();
  const known = CURRENCY_META[code] || {};
  const fallbackName =
    typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function'
      ? new Intl.DisplayNames([browserLocale], { type: 'currency' }).of(code)
      : code;
  const decimals = known.decimals ?? (ZERO_DECIMAL_CURRENCIES.has(code) ? 0 : 2);
  return {
    code,
    name: known.name || fallbackName || code,
    countryCode: known.countryCode || CURRENCY_FLAG_HINTS[code] || null,
    locale: known.locale || browserLocale,
    rate: known.rate ?? 1,
    decimals,
    step: known.step ?? (decimals === 0 ? 1 : 0.01),
  };
}

/* Pick an initial currency based on browser locale region. */
// Infer default currency from browser locale region.
function detectLocalCurrency() {
  if (typeof navigator === 'undefined') return 'KES';
  const locale = navigator.language || 'en-KE';
  const region = locale.split('-')[1]?.toUpperCase() || 'KE';
  const regionMap = {
    KE: 'KES',
    UG: 'UGX',
    TZ: 'TZS',
    RW: 'RWF',
    US: 'USD',
    GB: 'GBP',
    IE: 'EUR',
    FR: 'EUR',
    DE: 'EUR',
    IT: 'EUR',
    ES: 'EUR',
    NL: 'EUR',
    PT: 'EUR',
  };
  return regionMap[region] || 'KES';
}

function isMobile() {
  if (typeof navigator === 'undefined') return false;
  return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent);
}

export default function DonatePage({ currentLang = 'en' }) {
  /* Merge language pack with defaults so missing keys never break UI text. */
  const t = useMemo(() => {
    const langPack = translations[currentLang] || {};
    return { ...DONATE_FALLBACK_TEXT, ...translations.en, ...langPack };
  }, [currentLang]);

  // Browser locale feeds readable currency names and formatting behavior.
  const browserLocale = typeof navigator !== 'undefined' ? navigator.language || 'en-KE' : 'en-KE';

  // Full currency catalog used by the searchable "All Currencies" list.
  const allCurrencies = useMemo(
    () => getSupportedCurrencyCodes().map((code) => resolveCurrencyMeta(code, browserLocale)),
    [browserLocale]
  );

  // Search query used to narrow the global currency list.
  const [currencyQuery, setCurrencyQuery] = useState('');
  // Active currency selected by the donor.
  const [currency, setCurrency] = useState(() => detectLocalCurrency());
  // Chosen impact tier index (seat, row, or block).
  const [tier, setTier] = useState(0);
  // Donation amount currently shown and submitted in selected currency.
  const [amount, setAmount] = useState(() => convertUsd(IMPACT_TIERS[0].usd, detectLocalCurrency()));
  // Donor can target one or multiple active support projects.
  const [selectedProjects, setSelectedProjects] = useState(['sanctuary']);
  // USD-base live rate table fetched from remote API.
  const [exchangeRates, setExchangeRates] = useState(() => ({ USD: 1 }));
  // Active payment rail and modal feedback state.
  const [method, setMethod] = useState('mpesa');
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState('processing');
  // Small status indicator for clipboard copy success.
  const [copied, setCopied] = useState(false);

  // Metadata for the currently selected currency (step, decimals, locale, etc.).
  const activeCurrency = resolveCurrencyMeta(currency, browserLocale);

  // Live-filter currency list so results change as the user types.
  const filteredCurrencies = useMemo(() => {
    const q = currencyQuery.trim().toLowerCase();
    if (!q) return allCurrencies;
    return allCurrencies.filter((meta) => (
      meta.code.toLowerCase().includes(q) || meta.name.toLowerCase().includes(q)
    ));
  }, [currencyQuery, allCurrencies]);

  /* Convert from USD with live fetched rates, falling back to static metadata. */
  const convertUsdLive = (usdAmount, currencyCode) => {
    // Prefer fetched rates, but gracefully fall back to static metadata rates.
    const meta = resolveCurrencyMeta(currencyCode, browserLocale);
    const liveRate = exchangeRates[currencyCode];
    const rate = typeof liveRate === 'number' && Number.isFinite(liveRate) ? liveRate : meta.rate;
    const raw = usdAmount * rate;
    return meta.decimals === 0 ? Math.round(raw) : Number(raw.toFixed(meta.decimals));
  };

  // Keep slider bounds proportional to the selected currency value scale.
  const minAmount = convertUsdLive(1, currency);
  const maxAmount = convertUsdLive(10000, currency);
  const coarseStep = activeCurrency.step * 10;

  const clampAmount = (value) => Math.max(minAmount, Math.min(maxAmount, value));
  const adjustAmount = (delta) => setAmount((prev) => clampAmount(prev + delta));

  const toggleProject = (projectId) => {
    setSelectedProjects((prev) => {
      if (prev.includes(projectId)) {
        // Keep at least one project selected so donation intent is always defined.
        return prev.length > 1 ? prev.filter((id) => id !== projectId) : prev;
      }
      return [...prev, projectId];
    });
  };

  /* Fetch latest USD exchange rates once; app stays functional if offline. */
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function loadExchangeRates() {
      try {
        // Fetch latest USD rates to keep conversions fresh.
        const res = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
        const data = await res.json();
        if (!ignore && data?.rates && typeof data.rates === 'object') {
          setExchangeRates({ USD: 1, ...data.rates });
        }
      } catch {
        // Keep static fallback rates from CURRENCY_META when offline.
      }
    }

    loadExchangeRates();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, []);

  /* Keep chosen amount synced when tier, currency, or rates change. */
  useEffect(() => {
    // Recompute amount whenever tier, currency, or live rates change.
    setAmount(convertUsdLive(IMPACT_TIERS[tier].usd, currency));
  }, [tier, currency, exchangeRates]);

  /* Encoded payment payload used for QR generation. */
  // Encodes payment instructions into a QR-friendly string.
  const qrData =
    method === 'mpesa'
      ? `MPESA|Paybill:${PAYBILL}|Account:${ACCOUNT}|Amount:${amount}|Projects:${selectedProjects.join(',')}`
      : method === 'bank'
      ? `BANK|${BANK}|Account:${ACCOUNT}|Amount:${amount}|Projects:${selectedProjects.join(',')}`
      : `SWIFT|${SWIFT}|Account:${ACCOUNT}|Amount:${amount}|Projects:${selectedProjects.join(',')}`;

  /* Copy critical account details, then open progress/success modal. */
  const handleDonate = async () => {
    // Copy destination account to clipboard, then show completion guidance modal.
    let toCopy = '';
    if (method === 'mpesa') toCopy = ACCOUNT;
    else if (method === 'bank' || method === 'wire') toCopy = ACCOUNT;
    try {
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setShowModal(true);
      setModalState('processing');
      setTimeout(() => setModalState('success'), 1800);
    } catch {
      setShowModal(true);
      setModalState('processing');
      setTimeout(() => setModalState('success'), 1800);
    }
  };

  // M-Pesa quick dial shown only on mobile-capable devices.
  const mpesaDeepLink = isMobile() ? `tel:*150*00#` : null;

  // Derived impact estimator: number of seats represented by selected amount.
  const seatPrice = convertUsdLive(25, currency);
  const seats = Math.floor(amount / seatPrice);
  const impactText =
    seats < 1
      ? t.impactNone
      : seats === 1
      ? t.impactOne
      : t.impactMany.replace('{count}', seats);

  // Main project tier cards are converted to whichever currency donor selects.
  const projectTierCards = MAIN_SUPPORT_PROJECT.tiers.map((tierInfo) => ({
    ...tierInfo,
    displayAmount: formatMoney(convertUsdLive(tierInfo.usd, currency), currency),
  }));

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10 bg-[#0F2942]">
      <AnimatePresence>
        {showModal && (
          // Overlay modal that transitions from processing to success confirmation.
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center min-w-[320px]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {modalState === 'processing' ? (
                <>
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center mb-4"
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                  </motion.div>
                  <div className="text-[#0F2942] font-bold text-lg mb-2">{t.processing}</div>
                  <div className="text-xs text-[#0F2942]">{t.processingSub}</div>
                </>
              ) : (
                <>
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[#0F2942] flex items-center justify-center mb-4"
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <div className="text-[#0F2942] font-bold text-lg mb-2">{t.success}</div>
                  <div className="text-xs text-[#0F2942] mb-2">{t.successSub}</div>
                  {method === 'mpesa' && (
                    <div className="text-xs text-[#0F2942] mb-2">{t.copiedAcc}: <span className="font-mono">{ACCOUNT}</span></div>
                  )}
                  <button
                    className="mt-4 px-6 py-2 rounded bg-[#0F2942] text-white font-bold hover:bg-[#D4AF37] hover:text-[#0F2942] transition"
                    onClick={() => setShowModal(false)}
                  >
                    {t.close}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left: Selection & Impact */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            {/* Project spotlight as a tiered card layout to elevate the main need visually. */}
            <div className="mb-6 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#0B1F34] via-[#0F2942] to-[#173A5D] px-5 py-5 text-white shadow-[0_22px_50px_-22px_rgba(15,41,66,0.95)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
                Main Project In Need Of Support
              </p>
              <h3 className="mt-2 text-xl font-black leading-snug">
                {MAIN_SUPPORT_PROJECT.title}
              </h3>
              <p className="mt-2 text-sm text-white/90 leading-relaxed">
                {MAIN_SUPPORT_PROJECT.need}
              </p>
              <p className="mt-2 text-xs text-[#D4AF37] font-semibold">
                {MAIN_SUPPORT_PROJECT.urgency}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {projectTierCards.map((projectTier) => (
                  <div
                    key={projectTier.name}
                    className="rounded-xl border border-[#D4AF37]/35 bg-white/10 backdrop-blur-sm px-3 py-3"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4AF37] font-bold">
                      {projectTier.name}
                    </p>
                    <p className="mt-1 text-base font-black text-white">
                      {projectTier.displayAmount}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/80">
                      {projectTier.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <div className="w-full">
                <div className="mb-4">
                  <div className="font-bold text-lg text-[#0F2942] mb-2">Select Projects To Support</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PROJECT_OPTIONS.map((project) => {
                      const active = selectedProjects.includes(project.id);
                      return (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => toggleProject(project.id)}
                          className={`px-3 py-2 rounded-lg border text-left transition ${
                            active
                              ? 'bg-[#0F2942] text-white border-[#0F2942]'
                              : 'bg-white text-[#0F2942] border-[#D4AF37]/60 hover:border-[#D4AF37]'
                          }`}
                        >
                          <span className="text-xs font-semibold leading-snug">{project.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[11px] text-[#0F2942]/65">
                    {selectedProjects.length} project{selectedProjects.length > 1 ? 's' : ''} selected
                  </p>
                </div>

                <div className="font-bold text-lg text-[#0F2942] mb-2">{t.chooseCurrency}</div>
                <div className="mb-3">
                  {/* Search input filters by currency code and currency display name. */}
                  <input
                    type="text"
                    value={currencyQuery}
                    onChange={(e) => setCurrencyQuery(e.target.value)}
                    placeholder="search your prefered currency"
                    className="w-full rounded-lg border border-[#D4AF37]/60 bg-white px-3 py-2 text-sm text-[#0F2942] placeholder:text-[#0F2942]/45 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                  />
                </div>
                {/* Quick-select groups for common donor regions. */}
                <div className="space-y-3">
                  {CURRENCY_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]/60 mb-2">
                        {group.label}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {group.codes.map((code) => {
                          // Build each quick-pick card from resolved currency metadata.
                          const meta = resolveCurrencyMeta(code, browserLocale);
                          const active = currency === code;
                          return (
                            <button
                              key={code}
                              className={`px-3 py-2 rounded-lg border text-left transition ${
                                active
                                  ? 'bg-[#0F2942] text-white border-[#0F2942]'
                                  : 'bg-white text-[#0F2942] border-[#D4AF37]/60 hover:border-[#D4AF37]'
                              }`}
                              onClick={() => setCurrency(code)}
                            >
                              <div className="text-sm font-bold leading-tight flex items-center gap-2">
                                <img
                                  src={`https://flagcdn.com/24x18/${meta.countryCode}.png`}
                                  alt={`${meta.name} flag`}
                                  className="h-[14px] w-[18px] rounded-[2px] object-cover border border-black/10"
                                  loading="lazy"
                                />
                                <span>{meta.code}</span>
                              </div>
                              <div className={`text-[10px] ${active ? 'text-white/70' : 'text-[#0F2942]/65'}`}>
                                {meta.name}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  {/* Full searchable ISO currency list. */}
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]/60 mb-2">
                    All Currencies
                  </p>
                  <div className="max-h-56 overflow-y-auto rounded-xl border border-[#D4AF37]/40 bg-white divide-y divide-slate-100">
                    {filteredCurrencies.map((meta) => {
                      // Highlight selected currency so users keep context while scrolling.
                      const active = currency === meta.code;
                      return (
                        <button
                          type="button"
                          key={meta.code}
                          onClick={() => setCurrency(meta.code)}
                          className={`w-full px-3 py-2 flex items-center gap-3 text-left transition ${
                            active ? 'bg-[#0F2942] text-white' : 'hover:bg-amber-50 text-[#0F2942]'
                          }`}
                        >
                          {meta.countryCode ? (
                            <img
                              src={`https://flagcdn.com/24x18/${meta.countryCode}.png`}
                              alt={`${meta.name} flag`}
                              className="h-[14px] w-[18px] rounded-[2px] object-cover border border-black/10 shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <span className={`inline-flex h-[14px] w-[18px] items-center justify-center rounded-[2px] text-[9px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                              {meta.code.slice(0, 1)}
                            </span>
                          )}
                          <span className="text-xs font-bold w-10 shrink-0">{meta.code}</span>
                          <span className={`text-[11px] truncate ${active ? 'text-white/75' : 'text-[#0F2942]/70'}`}>
                            {meta.name}
                          </span>
                        </button>
                      );
                    })}
                    {filteredCurrencies.length === 0 && (
                      <div className="px-3 py-4 text-xs text-[#0F2942]/60">
                        No currency matches your search.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div className="font-bold text-lg text-[#0F2942] mb-2">{t.chooseTier}</div>
              <div className="flex flex-col gap-3">
                {IMPACT_TIERS.map((tierObj, idx) => (
                  <button
                    key={tierObj.labelKey}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition font-semibold ${
                      tier === idx
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-slate-200 bg-white hover:border-[#D4AF37]'
                    }`}
                    onClick={() => {
                      // Tier click sets both active tier and converted recommended amount.
                      setTier(idx);
                      setAmount(convertUsdLive(tierObj.usd, currency));
                    }}
                  >
                    <span>{t[tierObj.labelKey]}</span>
                    <span>
                      {formatMoney(convertUsdLive(tierObj.usd, currency), currency)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <div className="font-bold text-lg text-[#0F2942] mb-2">{t.customAmount}</div>
              {/* Amount slider supports quick fine-tuning inside currency-specific bounds. */}
              <input
                type="range"
                min={minAmount}
                max={maxAmount}
                step={activeCurrency.step}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full accent-[#0F2942]"
              />
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => adjustAmount(-coarseStep)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-[#0F2942] text-xs font-bold hover:border-[#D4AF37]"
                >
                  -{formatMoney(coarseStep, currency)}
                </button>
                <button
                  type="button"
                  onClick={() => adjustAmount(-activeCurrency.step)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-[#0F2942] text-xs font-bold hover:border-[#D4AF37]"
                >
                  -{formatMoney(activeCurrency.step, currency)}
                </button>
                <button
                  type="button"
                  onClick={() => adjustAmount(activeCurrency.step)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-[#0F2942] text-xs font-bold hover:border-[#D4AF37]"
                >
                  +{formatMoney(activeCurrency.step, currency)}
                </button>
                <button
                  type="button"
                  onClick={() => adjustAmount(coarseStep)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-[#0F2942] text-xs font-bold hover:border-[#D4AF37]"
                >
                  +{formatMoney(coarseStep, currency)}
                </button>
              </div>
              <div className="flex justify-between mt-2 text-sm text-[#0F2942] font-bold">
                <span>
                  {formatMoney(amount, currency)}
                </span>
                <span>{impactText}</span>
              </div>
            </div>
            {/* QR Code */}
            <div className="flex flex-col items-center mt-6">
              <QRCode value={qrData} size={140} fgColor="#0F2942" bgColor="#F7F4EF" />
              <div className="text-xs text-[#0F2942] mt-2">{t.qrScan}</div>
            </div>
          </div>
          <div className="mt-8 text-xs text-[#0F2942] italic">
            {t.titheBoundary}
          </div>
        </div>
        {/* Right: Payment Details */}
        <div className="p-8 flex flex-col justify-between bg-[#F7F4EF] border-l border-[#D4AF37]/30">
          <div>
            <div className="font-bold text-lg text-[#0F2942] mb-4">{t.chooseMethod}</div>
            <div className="flex flex-col gap-3 mb-6">
              {PAYMENT_METHODS.map(pm => (
                <button
                  key={pm.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition font-semibold ${
                    method === pm.id
                      ? 'border-[#0F2942] bg-white'
                      : 'border-slate-200 bg-[#F7F4EF] hover:border-[#D4AF37]'
                  }`}
                  onClick={() => setMethod(pm.id)}
                >
                  <span>{t[pm.labelKey]}</span>
                </button>
              ))}
            </div>
            <div className="mb-6">
              <div className="font-bold text-[#0F2942] mb-2">{t.paymentDetails}</div>
              {/* Render only the instruction block relevant to currently selected payment method. */}
              {method === 'mpesa' && (
                <div>
                  <div className="font-bold text-[#0F2942]">Paybill: <span className="text-[#D4AF37]">{PAYBILL}</span></div>
                  <div className="font-bold text-[#0F2942]">Account: <span className="text-[#D4AF37]">{ACCOUNT}</span></div>
                  {isMobile() && (
                    <a
                      href={mpesaDeepLink}
                      className="block mt-3 px-4 py-2 bg-[#D4AF37] text-[#0F2942] rounded font-bold text-center"
                    >
                      {t.openMpesa}
                    </a>
                  )}
                </div>
              )}
              {method === 'bank' && (
                <div>
                  <div className="font-bold text-[#0F2942]">Bank: <span className="text-[#D4AF37]">{BANK}</span></div>
                  <div className="font-bold text-[#0F2942]">Account: <span className="text-[#D4AF37]">{ACCOUNT}</span></div>
                </div>
              )}
              {method === 'wire' && (
                <div>
                  <div className="font-bold text-[#0F2942]">SWIFT: <span className="text-[#D4AF37]">{SWIFT}</span></div>
                  <div className="font-bold text-[#0F2942]">Account: <span className="text-[#D4AF37]">{ACCOUNT}</span></div>
                </div>
              )}
            </div>
          </div>
          <button
            className="w-full mt-6 py-3 rounded-xl bg-[#0F2942] text-white font-bold text-lg hover:bg-[#D4AF37] hover:text-[#0F2942] transition"
            onClick={handleDonate}
          >
            {t.donateNow}
          </button>
          {copied && (
            <div className="mt-2 text-green-700 text-sm font-semibold text-center animate-pulse">
              {t.copied}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
