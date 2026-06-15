import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { projectCatalog } from './data/projectCatalog';
import { useT } from './i18n.jsx';
import { translations } from './translations';

/*
  DonatePage — Professional Giving Experience
  =============================================
  Layout:
    HERO: church photo strip + headline + animated progress bar + donor count
    STEPS: numbered step indicator (mobile-friendly)
    FORM (2-col desktop / 1-col mobile):
      LEFT:  1. Tiers  2. Custom amount  3. Projects  4. Recurring  5. Donor details
      RIGHT: 1. Summary+Submit (sticky top)  2. Payment method  3. Currency  4. QR
    POST-SUBMIT: payment instructions / STK polling / success + Share button
    TRANSPARENCY: fund allocation animated bars
    OVERSIGHT: SDA admin hierarchy bar

  Fixes applied from analysis:
    - bg-[#D4AF37]/8 -> /10 (valid Tailwind opacity)
    - QR ref stored in state (no re-render regeneration)
    - useT() return value used; translations restored
    - Custom amount minimum guard (< 1 rejected)
    - Left column reordered: Tiers -> Custom -> Projects -> Recurring -> Details
    - Right column reordered: Summary+Submit first, then Payment, Currency, QR
    - Mobile fixed bottom bar showing live amount + Donate button
    - Hero church photo strip + social proof donor count
    - Message/dedication field added to donor form
    - Anonymous checkbox added to donor form
    - Bank/wire success screen adds "we'll email you" note
    - Share button (WhatsApp / copy link) on success state
    - Step progress indicator (3 steps)
*/

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PAYBILL      = '247247';         // Equity Bank EazzyPay paybill on Safaricom M-Pesa
const EAZZY_PAY    = 'Equity Bank EazzyPay';
const ACCOUNT      = '1650280005225';
const BANK_NAME    = 'Equity Bank, Lokichogio Branch';
const SWIFT_CODE   = 'EQBLKENAXXX';

const CAMPAIGN_RAISED  = 14200;
const CAMPAIGN_GOAL    = 50000;
const DONOR_COUNT      = 312;   // social proof — update from backend when available

const FUND_ALLOCATION = [
  { label: 'Construction & Materials', pct: 72, color: '#0F2942' },
  { label: 'Labor & Logistics',        pct: 18, color: '#D4AF37' },
  { label: 'Administration',           pct:  7, color: '#4E7C9B' },
  { label: 'Emergency Reserve',        pct:  3, color: '#8BA8C0' },
];

// Detailed budget line items for the budget sheet table.
// All percentages are of CAMPAIGN_GOAL ($50,000) and must sum to 100.
const BUDGET_GROUPS = [
  {
    group: 'Construction & Materials',
    color: '#0F2942',
    items: [
      { label: 'Foundation & Concrete Work', pct: 28 },
      { label: 'Steel Structure & Roofing',  pct: 25 },
      { label: 'Masonry & Block Work',        pct: 12 },
      { label: 'Finishes & Fixtures',         pct:  7 },
    ],
  },
  {
    group: 'Labor & Logistics',
    color: '#D4AF37',
    items: [
      { label: 'Skilled Labour',             pct: 12 },
      { label: 'Equipment Hire & Transport', pct:  6 },
    ],
  },
  {
    group: 'Administration',
    color: '#4E7C9B',
    items: [
      { label: 'Project Management',          pct: 4 },
      { label: 'Legal, Permits & Compliance', pct: 3 },
    ],
  },
  {
    group: 'Emergency Reserve',
    color: '#8BA8C0',
    items: [
      { label: 'Contingency Buffer', pct: 3 },
    ],
  },
];

// Impact tiers in USD — converted to active currency for display.
const IMPACT_TIERS = [
  { id: 't25',   usd: 25,   label: 'Foundation Stone',  icon: '🪨', description: 'Covers one bag of cement or a meter of reinforcement steel' },
  { id: 't150',  usd: 150,  label: 'Structural Beam',   icon: '🏗️', description: 'Funds a steel column section or a full roofing sheet panel'  },
  { id: 't500',  usd: 500,  label: 'Roofing Sponsor',   icon: '🏛️', description: 'Completes a roofing section and weather-sealing for 100 seats' },
  { id: 't1200', usd: 1200, label: 'Sanctuary Partner', icon: '✝️', description: 'Full combined roofing + safe seating base for a worship row'  },
];

const PROJECT_OPTIONS = projectCatalog.map((p) => ({
  id: p.slug,
  name: p.title.replace(' (Urgent Priority)', ''),
  urgency: p.urgency,
  shortSummary: p.shortSummary,
}));

const PAYMENT_METHODS = [
  { id: 'mpesa', label: 'M-Pesa (Equity EazzyPay)', icon: '📱', desc: EAZZY_PAY + ' · Paybill ' + PAYBILL },
  { id: 'bank',  label: 'Bank Transfer',             icon: '🏦', desc: BANK_NAME },
  { id: 'wire',  label: 'SWIFT Wire',                icon: '🌐', desc: 'International transfer' },
];

// Church images resolved from the projectCatalog (avoids double-importing assets).
const _churchProject    = projectCatalog.find((p) => p.slug === 'church-construction');
const CHURCH_BEFORE_IMG = _churchProject?.currentMedia?.[0]?.src || null;
const CHURCH_METAL_IMG  = _churchProject?.currentMedia?.[3]?.src || null;   // high duty metal.jpg
const CHURCH_DREAM_IMG  = _churchProject?.dreamMedia?.[0]?.src  || null;

// Sanctuary dimensions and construction specs (real build data).
const SANCTUARY_SPECS = {
  length: 30, width: 15,
  wallPlate: 5,    // metres — wall height to wall plate
  ridgeHeight: 4,  // metres — roof pitch above wall plate
  totalHeight: 9,  // metres — wall plate + ridge (5 + 4)
  area: 30 * 15,   // 450 m²
  materials: ['Heavy-duty metal poles', 'Structural steel bars', 'Corrugated iron sheets (roof + walls)'],
};

// Construction milestone tracker — reflects current on-site progress.
const CONSTRUCTION_MILESTONES = [
  { label: 'Site Preparation & Foundation Leveling', pct: 60,  status: 'In Progress',     color: '#0F2942' },
  { label: 'Metal Pole Erection (Main Uprights)',    pct: 35,  status: 'In Progress',     color: '#0F2942' },
  { label: 'Steel Bars, Purlins & Bracing',          pct: 20,  status: 'In Progress',     color: '#4E7C9B' },
  { label: 'Iron Sheet Roofing Installation',        pct:  0,  status: 'Pending Funding', color: '#D4AF37' },
  { label: 'Iron Sheet Wall Cladding (All Sides)',   pct:  0,  status: 'Pending Funding', color: '#8BA8C0' },
  { label: 'Interior Fitting, Floor & Electrical',   pct:  0,  status: 'Pending Funding', color: '#8BA8C0' },
];
const CHURCH_EMAIL      = 'clinic6sdachurch@gmail.com';

// Donation page steps for the progress indicator.
const STEPS = ['Amount', 'Your Details', 'Payment'];

// ─── CURRENCY ENGINE ──────────────────────────────────────────────────────────

const CURRENCY_META = {
  USD: { code:'USD', name:'US Dollar',           countryCode:'us', locale:'en-US', rate:1,      decimals:2, step:1     },
  EUR: { code:'EUR', name:'Euro',                countryCode:'eu', locale:'de-DE', rate:0.92,   decimals:2, step:1     },
  GBP: { code:'GBP', name:'British Pound',       countryCode:'gb', locale:'en-GB', rate:0.79,   decimals:2, step:1     },
  KES: { code:'KES', name:'Kenyan Shilling',     countryCode:'ke', locale:'en-KE', rate:130,    decimals:0, step:50    },
  UGX: { code:'UGX', name:'Ugandan Shilling',    countryCode:'ug', locale:'en-UG', rate:3700,   decimals:0, step:1000  },
  TZS: { code:'TZS', name:'Tanzanian Shilling',  countryCode:'tz', locale:'sw-TZ', rate:2600,   decimals:0, step:1000  },
  RWF: { code:'RWF', name:'Rwandan Franc',       countryCode:'rw', locale:'rw-RW', rate:1320,   decimals:0, step:500   },
  CAD: { code:'CAD', name:'Canadian Dollar',     countryCode:'ca', locale:'en-CA', rate:1.37,   decimals:2, step:1     },
  AUD: { code:'AUD', name:'Australian Dollar',   countryCode:'au', locale:'en-AU', rate:1.51,   decimals:2, step:1     },
  CHF: { code:'CHF', name:'Swiss Franc',         countryCode:'ch', locale:'de-CH', rate:0.9,    decimals:2, step:1     },
  JPY: { code:'JPY', name:'Japanese Yen',        countryCode:'jp', locale:'ja-JP', rate:157,    decimals:0, step:10    },
  CNY: { code:'CNY', name:'Chinese Yuan',        countryCode:'cn', locale:'zh-CN', rate:7.25,   decimals:2, step:1     },
  INR: { code:'INR', name:'Indian Rupee',        countryCode:'in', locale:'en-IN', rate:83.4,   decimals:0, step:10    },
  BRL: { code:'BRL', name:'Brazilian Real',      countryCode:'br', locale:'pt-BR', rate:5.4,    decimals:2, step:1     },
  ZAR: { code:'ZAR', name:'South African Rand',  countryCode:'za', locale:'en-ZA', rate:18.2,   decimals:2, step:1     },
  NGN: { code:'NGN', name:'Nigerian Naira',      countryCode:'ng', locale:'en-NG', rate:1510,   decimals:0, step:50    },
  GHS: { code:'GHS', name:'Ghanaian Cedi',       countryCode:'gh', locale:'en-GH', rate:15.2,   decimals:2, step:1     },
  AED: { code:'AED', name:'UAE Dirham',          countryCode:'ae', locale:'ar-AE', rate:3.67,   decimals:2, step:1     },
  SAR: { code:'SAR', name:'Saudi Riyal',         countryCode:'sa', locale:'ar-SA', rate:3.75,   decimals:2, step:1     },
  TRY: { code:'TRY', name:'Turkish Lira',        countryCode:'tr', locale:'tr-TR', rate:32.5,   decimals:2, step:1     },
  KRW: { code:'KRW', name:'South Korean Won',    countryCode:'kr', locale:'ko-KR', rate:1370,   decimals:0, step:50    },
  SGD: { code:'SGD', name:'Singapore Dollar',    countryCode:'sg', locale:'en-SG', rate:1.35,   decimals:2, step:1     },
  SEK: { code:'SEK', name:'Swedish Krona',       countryCode:'se', locale:'sv-SE', rate:10.5,   decimals:2, step:1     },
  NOK: { code:'NOK', name:'Norwegian Krone',     countryCode:'no', locale:'nb-NO', rate:10.7,   decimals:2, step:1     },
  DKK: { code:'DKK', name:'Danish Krone',        countryCode:'dk', locale:'da-DK', rate:6.9,    decimals:2, step:1     },
  MXN: { code:'MXN', name:'Mexican Peso',        countryCode:'mx', locale:'es-MX', rate:18.2,   decimals:2, step:1     },
  NZD: { code:'NZD', name:'New Zealand Dollar',  countryCode:'nz', locale:'en-NZ', rate:1.64,   decimals:2, step:1     },
  HKD: { code:'HKD', name:'Hong Kong Dollar',    countryCode:'hk', locale:'zh-HK', rate:7.8,    decimals:2, step:1     },
  MYR: { code:'MYR', name:'Malaysian Ringgit',   countryCode:'my', locale:'ms-MY', rate:4.7,    decimals:2, step:1     },
  PHP: { code:'PHP', name:'Philippine Peso',     countryCode:'ph', locale:'en-PH', rate:58.5,   decimals:2, step:1     },
  IDR: { code:'IDR', name:'Indonesian Rupiah',   countryCode:'id', locale:'id-ID', rate:16200,  decimals:0, step:500   },
  THB: { code:'THB', name:'Thai Baht',           countryCode:'th', locale:'th-TH', rate:36.6,   decimals:2, step:1     },
  VND: { code:'VND', name:'Vietnamese Dong',     countryCode:'vn', locale:'vi-VN', rate:25400,  decimals:0, step:1000  },
};

const CURRENCY_GROUPS = [
  { label: 'Global',      codes: ['USD', 'EUR', 'GBP'] },
  { label: 'East Africa', codes: ['KES', 'UGX', 'TZS', 'RWF'] },
  { label: 'Middle East', codes: ['AED', 'SAR'] },
];

const ZERO_DECIMAL_CURRENCIES = new Set([
  'BIF','CLP','DJF','GNF','ISK','JPY','KMF','KRW','PYG','RWF','UGX','VND','VUV','XAF','XOF','XPF',
]);

const CURRENCY_FLAG_HINTS = { EUR:'eu', XAF:'cm', XCD:'ag', XOF:'sn', XPF:'pf' };

function resolveCurrencyMeta(code, locale) {
  const safeLocale = locale || 'en-US';
  const c = (code || 'USD').toUpperCase();
  const known = CURRENCY_META[c] || {};
  const decimals = known.decimals !== undefined ? known.decimals : (ZERO_DECIMAL_CURRENCIES.has(c) ? 0 : 2);
  const fallbackName = (() => {
    try {
      return typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function'
        ? new Intl.DisplayNames([safeLocale], { type: 'currency' }).of(c)
        : c;
    } catch { return c; }
  })();
  return {
    code: c,
    name: known.name || fallbackName || c,
    countryCode: known.countryCode || CURRENCY_FLAG_HINTS[c] || null,
    locale: known.locale || safeLocale,
    rate: known.rate !== undefined ? known.rate : 1,
    decimals,
    step: known.step !== undefined ? known.step : (decimals === 0 ? 1 : 0.01),
  };
}

function getSupportedCurrencyCodes() {
  if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
    try { return Intl.supportedValuesOf('currency').sort(); } catch {}
  }
  return Object.keys(CURRENCY_META).sort();
}

function detectLocalCurrency() {
  if (typeof navigator === 'undefined') return 'KES';
  const region = (navigator.language || 'en-KE').split('-')[1]?.toUpperCase() || 'KE';
  const map = {
    KE:'KES', UG:'UGX', TZ:'TZS', RW:'RWF', US:'USD', GB:'GBP',
    IE:'EUR', FR:'EUR', DE:'EUR', IT:'EUR', ES:'EUR', CA:'CAD', AU:'AUD', NZ:'NZD',
  };
  return map[region] || 'KES';
}

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent);
}

// Generate a stable donation reference ID.
function genRef() {
  return 'CLINIC6-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
}

// ─── SMALL REUSABLE COMPONENTS ────────────────────────────────────────────────

function FormCard({ title, children, className, step, accent }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className || ''}`}>
      <div className={`flex items-center gap-3 px-6 pt-5 pb-3 border-b border-slate-100 ${accent ? '' : ''}`}>
        {step != null && (
          <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white text-[10px] font-black flex items-center justify-center shrink-0">{step}</span>
        )}
        <h3 className="text-xs font-black text-[#0F2942] uppercase tracking-widest">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#0F2942]/60 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function PaymentRow({ label, value, onCopy, copied }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[#0F2942]/55 shrink-0">{label}:</span>
      <span className="font-mono font-bold text-[#0F2942] text-sm truncate">{value}</span>
      <button
        type="button"
        onClick={onCopy}
        className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded transition ${
          copied ? 'text-green-600' : 'text-[#D4AF37] hover:text-[#0F2942]'
        }`}
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  );
}

function inputCls(hasError) {
  return `w-full px-4 py-3 rounded-xl border ${
    hasError
      ? 'border-red-400 focus:ring-red-300'
      : 'border-slate-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/30'
  } focus:ring-2 outline-none text-[#0F2942] text-sm transition`;
}

// Step progress indicator — shows which of the 3 sections is "active" based on form fill.
function StepBar({ step }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((label, i) => {
        const done    = i < step;
        const current = i === step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${
                done    ? 'bg-[#D4AF37] text-[#0F2942]' :
                current ? 'bg-[#0F2942] text-white ring-2 ring-[#0F2942]/30' :
                          'bg-slate-200 text-[#0F2942]/40'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`mt-1 text-[10px] font-bold uppercase tracking-wide ${
                current ? 'text-[#0F2942]' : done ? 'text-[#D4AF37]' : 'text-[#0F2942]/35'
              }`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 rounded transition ${done ? 'bg-[#D4AF37]' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────

export default function DonatePage() {
  const location = useLocation();
  const { lang: currentLang } = useT();

  // Merge translations with fallback so missing keys never break rendering.
  const t = useMemo(() => {
    const langPack = translations[currentLang] || {};
    return { ...translations.en, ...langPack };
  }, [currentLang]);

  const browserLocale =
    typeof navigator !== 'undefined' ? navigator.language || 'en-KE' : 'en-KE';

  // ── Currency ─────────────────────────────────────────────────────────────
  const [currency,            setCurrency]           = useState(() => detectLocalCurrency());
  const [currencyQuery,       setCurrencyQuery]      = useState('');
  const [exchangeRates,       setExchangeRates]      = useState({ USD: 1 });
  const [ratesAge,            setRatesAge]           = useState(null);
  const [showCurrency,        setShowCurrency]       = useState(false);
  const [showBudgetCurrency,  setShowBudgetCurrency] = useState(false);
  const [budgetCurrencyQuery, setBudgetCurrencyQuery] = useState('');

  // ── Amount ───────────────────────────────────────────────────────────────
  const [activeTier,  setActiveTier]  = useState('t150');
  const [customInput, setCustomInput] = useState('');
  const [recurring,   setRecurring]   = useState(false);

  // ── Projects ─────────────────────────────────────────────────────────────
  const [selectedProjects, setSelectedProjects] = useState(['church-construction']);

  // ── Payment & donor form ─────────────────────────────────────────────────
  const [method,     setMethod]     = useState('mpesa');
  const [form,       setForm]       = useState({ name: '', email: '', phone: '', message: '', anonymous: false });
  const [formErrors, setFormErrors] = useState({});

  // ── Submission ───────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [submitError,  setSubmitError]  = useState('');
  // FIXED: stable ref stored in state — not regenerated on each render.
  const [paymentRef,   setPaymentRef]   = useState(() => genRef());
  const [paymentMode,  setPaymentMode]  = useState('');
  const [pollStatus,   setPollStatus]   = useState('');
  const [mpesaReceipt, setMpesaReceipt] = useState('');

  // ── UI ───────────────────────────────────────────────────────────────────
  const [copied,       setCopied]       = useState('');
  const [linkCopied,   setLinkCopied]   = useState(false);
  const pollIntervalRef  = useRef(null);
  const ratesIntervalRef = useRef(null);
  const ratesAbortRef    = useRef(null);

  // Derive current step for progress bar:
  // 0 = Amount not yet chosen, 1 = Amount chosen, 2 = Details filled, 3 = done.
  const amountChosen  = activeTier !== '' || (customInput !== '' && Number(customInput) >= 1);
  const detailsFilled = form.name.trim() !== '' && form.email.trim() !== '';
  const currentStep   = !amountChosen ? 0 : !detailsFilled ? 1 : 2;

  // All ISO currency codes for the searchable list.
  const allCurrencies = useMemo(
    () => getSupportedCurrencyCodes().map((c) => resolveCurrencyMeta(c, browserLocale)),
    [browserLocale]
  );

  const filteredCurrencies = useMemo(() => {
    const q = currencyQuery.trim().toLowerCase();
    if (!q) return allCurrencies;
    return allCurrencies.filter(
      (m) => m.code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
    );
  }, [allCurrencies, currencyQuery]);

  const filteredBudgetCurrencies = useMemo(() => {
    const q = budgetCurrencyQuery.trim().toLowerCase();
    if (!q) return allCurrencies;
    return allCurrencies.filter(
      (m) => m.code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
    );
  }, [allCurrencies, budgetCurrencyQuery]);

  const activeCurrencyMeta = resolveCurrencyMeta(currency, browserLocale);

  // Convert USD -> active currency using live rates, static fallback.
  const convertUsd = useCallback(
    (usd, code) => {
      const meta     = resolveCurrencyMeta(code, browserLocale);
      const liveRate = exchangeRates[code];
      const rate     = typeof liveRate === 'number' && Number.isFinite(liveRate) ? liveRate : meta.rate;
      const raw      = usd * rate;
      return meta.decimals === 0 ? Math.round(raw) : Number(raw.toFixed(meta.decimals));
    },
    [exchangeRates, browserLocale]
  );

  const formatMoney = useCallback(
    (amount, code) => {
      const meta = resolveCurrencyMeta(code, browserLocale);
      try {
        return new Intl.NumberFormat(meta.locale, {
          style: 'currency',
          currency: code,
          minimumFractionDigits: meta.decimals,
          maximumFractionDigits: meta.decimals,
        }).format(amount);
      } catch {
        return `${code} ${amount}`;
      }
    },
    [browserLocale]
  );

  // Resolved amount in selected currency.
  const amountInCurrency = useMemo(() => {
    // FIXED: custom input clamped to minimum 1 unit.
    if (customInput !== '' && Number(customInput) >= 1) return Number(customInput);
    const tier = IMPACT_TIERS.find((ti) => ti.id === activeTier);
    return tier ? convertUsd(tier.usd, currency) : 0;
  }, [activeTier, customInput, currency, convertUsd]);

  // Reverse-convert to USD for the API payload.
  const amountUSD = useMemo(() => {
    if (amountInCurrency <= 0) return 0;
    const meta     = resolveCurrencyMeta(currency, browserLocale);
    const liveRate = exchangeRates[currency];
    const rate     = typeof liveRate === 'number' && Number.isFinite(liveRate) ? liveRate : meta.rate;
    return Number((amountInCurrency / rate).toFixed(2));
  }, [amountInCurrency, currency, exchangeRates, browserLocale]);

  // Impact text: seats covered at $25/seat.
  const seatsNum   = Math.floor(amountUSD / 25);
  const impactText =
    seatsNum < 1   ? '' :
    seatsNum === 1 ? 'Covers 1 seat' :
                     `Covers ${seatsNum} seats`;

  // QR payload — stable reference ID is already in state.
  const qrData = useMemo(() => {
    const base = `Ref:${paymentRef}|Amount:${amountInCurrency}|Currency:${currency}|Projects:${selectedProjects.join(',')}`;
    if (method === 'mpesa') return `MPESA|Paybill:${PAYBILL}|Account:${ACCOUNT}|${base}`;
    if (method === 'bank')  return `BANK|${BANK_NAME}|Account:${ACCOUNT}|${base}`;
    return `SWIFT|${SWIFT_CODE}|Account:${ACCOUNT}|${base}`;
  }, [method, amountInCurrency, currency, selectedProjects, paymentRef]);

  // URL query prefill (arriving from a project detail page).
  const searchPrefill = useMemo(() => {
    const params    = new URLSearchParams(location.search);
    const project   = params.get('project');
    const budgetRaw = params.get('budget');
    const amount    = budgetRaw
      ? Number((budgetRaw.match(/[\d.,]+/) || ['0'])[0].replace(/,/g, ''))
      : null;
    return { project, amount: Number.isFinite(amount) && amount > 0 ? amount : null };
  }, [location.search]);

  const progressPct = Math.min(100, Math.round((CAMPAIGN_RAISED / CAMPAIGN_GOAL) * 100));

  // Campaign raised/goal expressed in the donor's active currency.
  const campaignRaisedDisplay = useMemo(
    () => formatMoney(convertUsd(CAMPAIGN_RAISED, currency), currency),
    [currency, convertUsd, formatMoney]
  );
  const campaignGoalDisplay = useMemo(
    () => formatMoney(convertUsd(CAMPAIGN_GOAL, currency), currency),
    [currency, convertUsd, formatMoney]
  );

  // Detailed budget groups with currency-converted amounts for the budget sheet table.
  const budgetGroupsDisplay = useMemo(
    () => BUDGET_GROUPS.map((grp) => {
      const items = grp.items.map((item) => ({
        ...item,
        amount: formatMoney(convertUsd((CAMPAIGN_GOAL * item.pct) / 100, currency), currency),
      }));
      const groupPct = grp.items.reduce((s, item) => s + item.pct, 0);
      const subtotalUsd = grp.items.reduce((s, item) => s + (CAMPAIGN_GOAL * item.pct) / 100, 0);
      return { ...grp, items, groupPct, subtotal: formatMoney(convertUsd(subtotalUsd, currency), currency) };
    }),
    [currency, convertUsd, formatMoney]
  );

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const isKnown = searchPrefill.project && PROJECT_OPTIONS.some((p) => p.id === searchPrefill.project);
    if (isKnown) setSelectedProjects([searchPrefill.project]);
    if (searchPrefill.amount) {
      setCustomInput(String(searchPrefill.amount));
      setActiveTier('');
    }
  }, []); // intentionally run once on mount

  // Fetch live exchange rates on mount, then refresh every 10 minutes.
  useEffect(() => {
    const fetchRates = async () => {
      const ctrl = new AbortController();
      ratesAbortRef.current = ctrl;
      try {
        const res  = await fetch('https://open.er-api.com/v6/latest/USD', { signal: ctrl.signal });
        const data = await res.json();
        if (data?.rates && typeof data.rates === 'object') {
          setExchangeRates({ USD: 1, ...data.rates });
          setRatesAge(new Date());
        }
      } catch { /* keep static fallback rates on network failure */ }
    };

    fetchRates(); // immediate on mount
    ratesIntervalRef.current = setInterval(fetchRates, 10 * 60 * 1000); // refresh every 10 min

    return () => {
      clearInterval(ratesIntervalRef.current);
      ratesAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => () => clearInterval(pollIntervalRef.current), []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const toggleProject = (id) =>
    setSelectedProjects((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((x) => x !== id) : prev
        : [...prev, id]
    );

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 2500);
    } catch {}
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShareWhatsApp = () => {
    const msg = `I just donated to the Clinic 6 SDA Church sanctuary project in Kakuma! Join me: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {}
  };

  // FIXED: custom amount validation includes minimum guard.
  const validateForm = () => {
    const errs = {};
    if (amountUSD < 1) errs.amount = `Minimum donation is ${formatMoney(convertUsd(1, currency), currency)} (${formatMoney(1, 'USD')})`;
    if (!form.name.trim())  errs.name  = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (method === 'mpesa' && !form.phone.trim()) errs.phone = 'Phone number required for M-Pesa';
    return errs;
  };

  const startPolling = (ref) => {
    let count = 0;
    setPollStatus('pending');
    pollIntervalRef.current = setInterval(async () => {
      count++;
      try {
        const res  = await fetch(`/api/payments/status/${ref}`);
        const data = await res.json();
        if (data.status === 'success') {
          clearInterval(pollIntervalRef.current);
          setPollStatus('success');
          setMpesaReceipt(data.receipt || '');
        } else if (data.status === 'failed') {
          clearInterval(pollIntervalRef.current);
          setPollStatus('failed');
          setSubmitError('Payment cancelled or failed. Use manual details below.');
        }
      } catch {}
      if (count >= 20) {
        clearInterval(pollIntervalRef.current);
        setPollStatus((s) => {
          if (s !== 'success') { setSubmitError('Payment timed out. Use manual details below.'); return 'failed'; }
          return s;
        });
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    setIsSubmitting(true);
    setSubmitError('');

    if (method !== 'mpesa') {
      setIsSubmitting(false);
      setPaymentMode('manual');
      setSubmitted(true);
      return;
    }

    // M-Pesa STK push — switch to the "waiting for PIN" screen immediately.
    // The backend call happens in the background; the donor never waits on a spinner.
    setIsSubmitting(false);
    setPollStatus('pending');
    setSubmitted(true);

    try {
      const res = await fetch('/api/payments/mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref: paymentRef,
          amount: amountUSD,
          currency,
          phone:     form.phone,
          name:      form.anonymous ? 'Anonymous' : form.name,
          email:     form.email,
          message:   form.message,
          projects:  selectedProjects,
          recurring,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment initiation failed');
      startPolling(data.ref || paymentRef);
    } catch (err) {
      setPollStatus('failed');
      setSubmitError(err instanceof Error ? err.message : 'Could not reach payment service. Please try again.');
    }
  };

  // Resend M-Pesa STK push (used on the pending and failed screens).
  const resendStkPush = async () => {
    setPollStatus('pending');
    setSubmitError('');
    try {
      const res = await fetch('/api/payments/mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref: paymentRef,
          amount: amountUSD,
          currency,
          phone:     form.phone,
          name:      form.anonymous ? 'Anonymous' : form.name,
          email:     form.email,
          message:   form.message,
          projects:  selectedProjects,
          recurring,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Resend failed');
      startPolling(data.ref || paymentRef);
    } catch (err) {
      setPollStatus('failed');
      setSubmitError(err instanceof Error ? err.message : 'Could not reach payment service. Please try again.');
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ name: '', email: '', phone: '', message: '', anonymous: false });
    setPollStatus('');
    setMpesaReceipt('');
    setSubmitError('');
    setPaymentRef(genRef()); // fresh ref for the next donation
  };

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F7F4EF] font-sans">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0F2942] text-white">
        {/* Animated background blobs — FIXED: /10 instead of invalid /8 */}
        <motion.div
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Church photo strip — before/after using real catalog images */}
        {CHURCH_BEFORE_IMG && CHURCH_DREAM_IMG ? (
          <div className="relative overflow-hidden h-44 sm:h-56">
            <div className="flex h-full">
              {/* Left: storm-damaged current state */}
              <div
                className="flex-1 bg-center bg-cover relative"
                style={{ backgroundImage: `url(${CHURCH_BEFORE_IMG})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#0F2942]/30 to-[#0F2942]/85 flex flex-col justify-end p-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mb-0.5">Today</span>
                  <span className="text-xs font-bold text-white leading-snug">Storm-damaged shelter</span>
                </div>
              </div>
              {/* Divider */}
              <div className="w-0.5 bg-[#D4AF37]/60 shrink-0 relative z-10">
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-lg">
                  <svg className="w-3 h-3 text-[#0F2942]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
              {/* Right: dream church vision */}
              <div
                className="flex-1 bg-center bg-cover relative"
                style={{ backgroundImage: `url(${CHURCH_DREAM_IMG})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#0F2942]/10 to-[#0F2942]/75 flex flex-col justify-end p-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/80 mb-0.5">Our Vision</span>
                  <span className="text-xs font-bold text-[#D4AF37] leading-snug">30m × 15m × 5m — iron sheet &amp; metal frame</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Fallback gradient strip if images haven't loaded yet
          <div className="h-2 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/60 to-[#D4AF37]/20" />
        )}

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-10">
          <motion.p
            className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-3"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            Clinic 6 SDA Church · Kakuma, Kenya
          </motion.p>
          <motion.h1
            className="text-3xl sm:text-5xl font-black leading-tight mb-4"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            Built to Endure: Our Permanent Sanctuary
          </motion.h1>
          <motion.p
            className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            A <strong className="text-[#D4AF37]">30 m × 15 m</strong> metal-frame sanctuary — <strong className="text-[#D4AF37]">5 m</strong> walls to wall plate, <strong className="text-[#D4AF37]">4 m</strong> roof pitch — heavy-duty poles, structural bars,
            and iron sheets allover — rising for 868 members in Kakuma, Kenya.
          </motion.p>

          {/* Social proof */}
          <motion.p
            className="text-sm text-[#D4AF37] font-semibold mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join {DONOR_COUNT.toLocaleString()} supporters already giving
          </motion.p>

          {/* Campaign progress bar */}
          <motion.div
            className="max-w-xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
          >
            <div className="flex justify-between text-sm font-semibold text-white/70 mb-2">
              <span>Raised: <span className="text-[#D4AF37]">{campaignRaisedDisplay}</span></span>
              <span>Goal: <span className="text-white">{campaignGoalDisplay}</span></span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#f5cf6e] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-2 text-xs text-white/55 text-center">{progressPct}% of Phase 1 goal reached</p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. FAITH MISSION SPOTLIGHT ──────────────────────────────────── */}
      <section className="bg-[#F7F4EF] py-12 px-4 border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-2">Faith Mission Spotlight</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F2942]">Built to Endure: Our Permanent Sanctuary</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* Left — metal image + dimension badge */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}
            >
              {CHURCH_METAL_IMG ? (
                <img src={CHURCH_METAL_IMG} alt="High-duty metal poles and bars prepared for sanctuary construction" className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-64 bg-[#0F2942]/10 flex items-center justify-center text-[#0F2942]/30 text-sm">Construction photo</div>
              )}
              {/* Dimension overlay badge */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F2942]/90 to-transparent px-5 py-4">
                <div className="flex items-end gap-4 flex-wrap">
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#D4AF37]">{SANCTUARY_SPECS.length}m</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-widest">Length</div>
                  </div>
                  <div className="text-white/30 text-xl font-thin mb-1">×</div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#D4AF37]">{SANCTUARY_SPECS.width}m</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-widest">Width</div>
                  </div>
                  <div className="text-white/30 text-xl font-thin mb-1">×</div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#D4AF37]">{SANCTUARY_SPECS.wallPlate}m</div>
                    <div className="text-[10px] text-white/60 uppercase tracking-widest">Wall Plate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-black text-[#D4AF37]/70">+{SANCTUARY_SPECS.ridgeHeight}m</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-widest">Roof Ridge</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-lg font-black text-white">{SANCTUARY_SPECS.area} m²</div>
                    <div className="text-[10px] text-white/55 uppercase tracking-widest">Floor Area</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right — specs + materials */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-[#0F2942]/40 mb-3">Construction Method</p>
                <ul className="space-y-2.5">
                  {SANCTUARY_SPECS.materials.map((m) => (
                    <li key={m} className="flex items-start gap-2.5">
                      <span className="mt-0.5 h-4 w-4 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-[#0F2942]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-sm font-semibold text-[#0F2942]">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Seating Capacity', value: '≈ 600 seats' },
                  { label: 'Structure Type',   value: 'All-Metal Frame' },
                  { label: 'Roof & Walls',     value: 'Iron Sheet Allover' },
                  { label: 'Location',         value: 'Kakuma, Kenya' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
                    <p className="text-[10px] uppercase tracking-widest text-[#0F2942]/40 mb-0.5">{s.label}</p>
                    <p className="text-sm font-black text-[#0F2942]">{s.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. PROJECT MILESTONE ────────────────────────────────────────── */}
      <section className="bg-white py-12 px-4 border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-2">On-Site Progress</p>
            <h2 className="text-2xl font-black text-[#0F2942]">Project Milestone</h2>
            <p className="text-[#0F2942]/50 text-sm mt-2 max-w-lg mx-auto">
              Live construction stages for the 30 m × 15 m sanctuary (5 m wall plate + 4 m roof ridge) in Kakuma.
            </p>
          </motion.div>

          <div className="space-y-4">
            {CONSTRUCTION_MILESTONES.map((m, i) => (
              <motion.div
                key={m.label}
                className="rounded-xl border border-slate-200 bg-[#F7F4EF]/60 px-5 py-4"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <div className="flex items-center justify-between mb-2 gap-3">
                  <span className="text-sm font-bold text-[#0F2942] leading-snug">{m.label}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        m.pct === 0
                          ? 'bg-slate-100 text-slate-400'
                          : m.pct === 100
                          ? 'bg-green-100 text-green-700'
                          : 'bg-[#D4AF37]/15 text-[#8B6914]'
                      }`}
                    >
                      {m.status}
                    </span>
                    <span className="text-sm font-black" style={{ color: m.pct > 0 ? m.color : '#CBD5E1' }}>{m.pct}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: m.pct > 0 ? m.color : '#CBD5E1' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="mt-6 text-xs text-center text-[#0F2942]/35 max-w-lg mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
          >
            Wall cladding and interior fitting are pending funding. Your donation directly unlocks the next phase.
          </motion.p>
        </div>
      </section>

      {/* ── 4. MAIN GIVING AREA ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-10 pb-28 lg:pb-10">
        <AnimatePresence mode="wait">
          {submitted ? (

            /* ── POST-SUBMIT: PAYMENT INSTRUCTIONS ─────────────────────── */
            <motion.div
              key="success"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#D4AF37]/30">

                {/* M-Pesa STK success */}
                {pollStatus === 'success' ? (
                  <div className="text-center">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-[#0F2942] flex items-center justify-center mx-auto mb-4"
                      initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260 }}
                    >
                      <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h2 className="text-2xl font-black text-[#0F2942] mb-2">Payment Confirmed!</h2>
                    <p className="text-[#0F2942]/70 text-sm mb-4">
                      Thank you{form.anonymous ? '' : `, ${form.name}`}. Your M-Pesa payment was received.
                    </p>
                    {mpesaReceipt && (
                      <div className="bg-[#F7F4EF] rounded-lg px-4 py-3 text-sm font-mono text-[#0F2942] mb-4">
                        Receipt: <span className="font-bold text-[#D4AF37]">{mpesaReceipt}</span>
                      </div>
                    )}
                    {/* ADDED: email confirmation note */}
                    <p className="text-xs text-[#0F2942]/55 italic">
                      A receipt will be sent to {form.email}.
                    </p>
                  </div>

                /* M-Pesa STK polling */
                ) : pollStatus === 'pending' ? (
                  /* M-Pesa STK push sent — waiting for the donor to enter their PIN */
                  <div className="text-center py-2">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4"
                      animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    >
                      <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                        <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                      </svg>
                    </motion.div>
                    <h2 className="text-xl font-black text-[#0F2942] mb-2">Payment Prompt Sent!</h2>
                    <p className="text-[#0F2942]/70 text-sm mb-4">
                      An <strong>Equity Bank EazzyPay</strong> payment prompt has been sent to{' '}
                      <span className="font-black text-[#0F2942]">{form.phone}</span> via M-Pesa.<br />
                      Open your M-Pesa menu and <strong>enter your PIN</strong> to authorise the payment.
                    </p>
                    <div className="inline-block bg-[#F7F4EF] rounded-xl px-6 py-3 mb-3 text-left">
                      <div className="text-[10px] uppercase tracking-widest text-[#0F2942]/40 mb-1">Charging to {EAZZY_PAY}</div>
                      <div className="text-2xl font-black text-[#0F2942]">{formatMoney(amountInCurrency, currency)}</div>
                      {currency !== 'USD' && amountUSD > 0 && (
                        <div className="text-xs text-[#0F2942]/40">≈ {formatMoney(amountUSD, 'USD')}</div>
                      )}
                      <div className="mt-2 text-[10px] font-mono text-[#0F2942]/40">Paybill {PAYBILL} · Acct {ACCOUNT}</div>
                    </div>
                    <p className="text-xs text-[#0F2942]/35 mb-5">Waiting for your confirmation…</p>
                    <button
                      type="button"
                      onClick={resendStkPush}
                      className="text-sm font-bold text-[#D4AF37] hover:text-[#8B6914] transition underline underline-offset-2"
                    >
                      Didn’t receive a prompt? Resend
                    </button>
                  </div>

                ) : pollStatus === 'failed' ? (
                  /* M-Pesa STK push failed or timed out — show BOTH retry and manual fallback */
                  <div className="py-2">
                    {/* Status header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-base font-black text-[#0F2942]">Automatic Payment Not Confirmed</h2>
                        <p className="text-xs text-[#0F2942]/55">
                          {submitError || 'The M-Pesa prompt timed out or was cancelled.'}
                        </p>
                      </div>
                    </div>

                    {/* Option A — retry STK push */}
                    <div className="rounded-xl border-2 border-[#D4AF37]/60 bg-[#D4AF37]/5 p-4 mb-3">
                      <p className="text-xs font-black uppercase tracking-widest text-[#0F2942]/50 mb-2">Option A — Try Again Automatically</p>
                      <p className="text-sm text-[#0F2942]/70 mb-3">
                        We'll resend a prompt to <span className="font-bold text-[#0F2942]">{form.phone}</span>. Just enter your PIN when it arrives.
                      </p>
                      <button
                        type="button"
                        onClick={resendStkPush}
                        className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#0F2942] font-black text-sm hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-2"
                      >
                        <span>📱</span> Resend M-Pesa Prompt
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-xs font-bold text-[#0F2942]/35 uppercase tracking-widest">or</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Option B — manual M-Pesa */}
                    <div className="rounded-xl border border-slate-200 bg-[#F7F4EF] p-4">
                      <p className="text-xs font-black uppercase tracking-widest text-[#0F2942]/50 mb-3">Option B — Pay Manually via M-Pesa</p>
                      <div className="space-y-2.5 mb-3">
                        <PaymentRow label="Paybill" value={PAYBILL}  onCopy={() => copyToClipboard(PAYBILL,  'Paybill')} copied={copied === 'Paybill'} />
                        <PaymentRow label="Account" value={ACCOUNT}  onCopy={() => copyToClipboard(ACCOUNT,  'Account')} copied={copied === 'Account'} />
                        <div className="flex justify-between items-center pt-2 border-t border-[#D4AF37]/20 text-sm">
                          <span className="text-[#0F2942]/55">Amount</span>
                          <span className="font-bold text-[#0F2942]">{formatMoney(amountInCurrency, currency)}</span>
                        </div>
                        {recurring && <p className="text-xs text-[#D4AF37] font-semibold">Monthly recurring gift</p>}
                        <div className="text-xs font-mono text-[#0F2942]/40">Ref: {paymentRef}</div>
                      </div>
                      <p className="text-[11px] text-[#0F2942]/50 leading-relaxed">
                        Go to <strong>M-Pesa → Lipa na M-Pesa → Pay Bill</strong>, enter the numbers above, then use <span className="font-mono">{paymentRef}</span> as your account reference.
                      </p>
                      {isMobileDevice() && (
                        <a
                          href="tel:*150*00#"
                          className="mt-3 block w-full text-center py-2.5 rounded-xl bg-[#0F2942] text-white text-sm font-bold hover:brightness-110 transition"
                        >
                          Dial *150*00# — Open M-Pesa
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="mt-3 w-full py-2 text-xs font-semibold text-[#0F2942]/45 hover:text-[#0F2942] transition underline underline-offset-2"
                    >
                      Start over / change payment method
                    </button>
                  </div>

                ) : (
                  /* Bank / wire manual payment instructions (M-Pesa uses STK push above) */
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-full bg-[#0F2942] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-[#0F2942]">
                          Thank you{form.name && !form.anonymous ? `, ${form.name}` : ''}!
                        </h2>
                        <p className="text-sm text-[#0F2942]/55">Complete your gift using the details below.</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#F7F4EF] border border-[#D4AF37]/40 p-5 space-y-3 mb-5">
                      <div className="text-xs font-bold uppercase tracking-widest text-[#0F2942]/45 mb-1">
                        {method === 'bank' ? 'Bank Transfer' : 'SWIFT Wire Transfer'}
                      </div>
                      {method === 'bank' && <>
                        <PaymentRow label="Bank"    value={BANK_NAME}  onCopy={() => copyToClipboard(BANK_NAME,  'Bank')}    copied={copied === 'Bank'} />
                        <PaymentRow label="Account" value={ACCOUNT}    onCopy={() => copyToClipboard(ACCOUNT,    'Account')} copied={copied === 'Account'} />
                      </>}
                      {method === 'wire' && <>
                        <PaymentRow label="SWIFT"   value={SWIFT_CODE} onCopy={() => copyToClipboard(SWIFT_CODE, 'SWIFT')}   copied={copied === 'SWIFT'} />
                        <PaymentRow label="Account" value={ACCOUNT}    onCopy={() => copyToClipboard(ACCOUNT,    'Account')} copied={copied === 'Account'} />
                      </>}
                      <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between text-sm">
                        <span className="text-[#0F2942]/55">Amount</span>
                        <span className="font-bold text-[#0F2942]">{formatMoney(amountInCurrency, currency)}</span>
                      </div>
                      {recurring && <p className="text-xs text-[#D4AF37] font-semibold">Monthly recurring gift</p>}
                      <div className="pt-1 text-xs font-mono text-[#0F2942]/40">Ref: {paymentRef}</div>
                    </div>

                    <p className="text-xs text-[#0F2942]/55 italic leading-relaxed mb-3">
                      Once your transfer is received, a confirmation receipt will be sent to <strong>{form.email}</strong>.
                      You may also email us at{' '}
                      <a href={`mailto:${CHURCH_EMAIL}`} className="text-[#D4AF37] font-semibold not-italic hover:underline">{CHURCH_EMAIL}</a>{' '}
                      with your transfer reference and we will acknowledge your gift within 24 hours.
                      These funds are freewill offerings above tithe, managed through church treasury controls.
                    </p>

                    {submitError && (
                      <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                        {submitError}
                      </div>
                    )}
                  </div>
                )}

                {/* ADDED: Share button */}
                {(pollStatus === 'success' || pollStatus === '' ) && (
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#0F2942]/40 mb-3">Share this cause</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleShareWhatsApp}
                        className="flex-1 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:brightness-110 transition flex items-center justify-center gap-1.5"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition ${linkCopied ? 'bg-green-50 border-green-300 text-green-700' : 'border-[#0F2942]/20 text-[#0F2942] hover:border-[#D4AF37]'}`}
                      >
                        {linkCopied ? '✓ Link copied' : '🔗 Copy link'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Hide Give Again / Back to Home when M-Pesa is in a pending or failed state (those states have their own CTAs) */}
                {(pollStatus === 'success' || pollStatus === '') && (
                <div className="mt-5 flex gap-3">
                  <button className="flex-1 py-2.5 rounded-xl border border-[#0F2942]/20 text-sm text-[#0F2942] font-semibold hover:border-[#D4AF37] transition" onClick={resetForm}>
                    Give Again
                  </button>
                  <Link to="/" className="flex-1 py-2.5 rounded-xl bg-[#0F2942] text-white text-sm font-semibold text-center hover:bg-[#0F2942]/90 transition">
                    Back to Home
                  </Link>
                </div>
                )}
              </div>

              {/* QR code — ref is stable from state */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#D4AF37]/30 flex flex-col items-center justify-center gap-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#0F2942]/40">Scan to Pay</p>
                <div className="p-4 bg-[#F7F4EF] rounded-2xl border border-[#D4AF37]/30">
                  <QRCode value={qrData} size={180} fgColor="#0F2942" bgColor="#F7F4EF" />
                </div>
                <p className="text-xs text-center text-[#0F2942]/45 max-w-[200px]">
                  Scan to load payment details in any QR reader
                </p>
                <p className="text-[10px] font-mono text-[#0F2942]/30">{paymentRef}</p>
              </div>
            </motion.div>

          ) : (

            /* ── DONATION FORM ──────────────────────────────────────────── */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              noValidate
            >
              {/* ── LEFT COLUMN ────────────────────────────────────────── */}
              <div className="space-y-6">

                {/* ── CURRENCY BAR — first thing donor sees; sets display currency before any price renders ── */}
                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => { setShowCurrency((s) => !s); setCurrencyQuery(''); }}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition text-left"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0F2942]/40 shrink-0">Display in</span>
                    <div className="flex items-center gap-2 ml-auto min-w-0">
                      {activeCurrencyMeta.countryCode && (
                        <img
                          src={`https://flagcdn.com/24x18/${activeCurrencyMeta.countryCode}.png`}
                          alt=""
                          className="h-[13px] w-[18px] rounded-[2px] object-cover border border-black/10 shrink-0"
                          loading="lazy"
                        />
                      )}
                      <span className="font-black text-[#0F2942] text-sm shrink-0">{activeCurrencyMeta.code}</span>
                      <span className="text-xs text-[#0F2942]/45 truncate hidden sm:block">{activeCurrencyMeta.name}</span>
                      {currency !== 'USD' && (
                        <span className="text-[10px] font-mono text-[#0F2942]/30 hidden md:block shrink-0">
                          1 USD ≈ {Number((exchangeRates[currency] ?? CURRENCY_META[currency]?.rate ?? 1).toFixed(2)).toLocaleString('en')} {currency}
                        </span>
                      )}
                      <span className="flex items-center gap-1 shrink-0 ml-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${ratesAge ? 'bg-green-500' : 'bg-yellow-400'}`} />
                        <span className="text-[10px] text-[#0F2942]/35">{ratesAge ? 'live' : 'est.'}</span>
                      </span>
                      <span className="text-xs text-[#D4AF37] font-bold ml-2 shrink-0">{showCurrency ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {showCurrency && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden border-t border-slate-100"
                      >
                        <div className="px-5 pb-4 pt-3">
                          <input
                            type="text"
                            placeholder="Search currency…"
                            value={currencyQuery}
                            onChange={(e) => setCurrencyQuery(e.target.value)}
                            className="w-full rounded-lg border border-[#D4AF37]/50 px-3 py-2 text-sm text-[#0F2942] placeholder:text-[#0F2942]/35 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 mb-3"
                            autoFocus
                          />
                          {/* Quick-pick groups — only shown when search is empty */}
                          {!currencyQuery && CURRENCY_GROUPS.map((grp) => (
                            <div key={grp.label} className="mb-3">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0F2942]/35 mb-1.5">{grp.label}</p>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                {grp.codes.map((code) => {
                                  const meta   = resolveCurrencyMeta(code, browserLocale);
                                  const active = currency === code;
                                  return (
                                    <button
                                      key={code}
                                      type="button"
                                      onClick={() => { setCurrency(code); setShowCurrency(false); setCurrencyQuery(''); }}
                                      className={`rounded-lg border text-left px-2 py-1.5 transition ${
                                        active ? 'bg-[#0F2942] text-white border-[#0F2942]' : 'bg-white text-[#0F2942] border-[#D4AF37]/35 hover:border-[#D4AF37]'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1 text-xs font-bold">
                                        {meta.countryCode && (
                                          <img src={`https://flagcdn.com/24x18/${meta.countryCode}.png`} alt="" className="h-[10px] w-[14px] rounded-[2px] object-cover" loading="lazy" />
                                        )}
                                        {meta.code}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          {/* Full searchable list */}
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#0F2942]/35 mb-1.5">
                            {currencyQuery ? 'Results' : 'All Currencies'}
                          </p>
                          <div className="max-h-52 overflow-y-auto rounded-xl border border-[#D4AF37]/25 divide-y divide-slate-100 bg-white">
                            {filteredCurrencies.map((meta) => {
                              const active = currency === meta.code;
                              return (
                                <button
                                  key={meta.code}
                                  type="button"
                                  onClick={() => { setCurrency(meta.code); setShowCurrency(false); setCurrencyQuery(''); }}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-left transition ${active ? 'bg-[#0F2942] text-white' : 'hover:bg-amber-50 text-[#0F2942]'}`}
                                >
                                  {meta.countryCode ? (
                                    <img src={`https://flagcdn.com/24x18/${meta.countryCode}.png`} alt="" className="h-[11px] w-[15px] rounded-[2px] object-cover border border-black/10 shrink-0" loading="lazy" />
                                  ) : (
                                    <span className="inline-flex h-[11px] w-[15px] items-center justify-center text-[8px] font-bold bg-slate-200 rounded-[2px] shrink-0">{meta.code.slice(0, 1)}</span>
                                  )}
                                  <span className="text-xs font-bold w-8 shrink-0">{meta.code}</span>
                                  <span className={`text-[10px] truncate ${active ? 'text-white/65' : 'text-[#0F2942]/55'}`}>{meta.name}</span>
                                </button>
                              );
                            })}
                            {filteredCurrencies.length === 0 && (
                              <div className="px-3 py-4 text-xs text-[#0F2942]/45 text-center">No results for "{currencyQuery}"</div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Step indicator */}
                <StepBar step={currentStep} />

                {/* STEP 1 — Impact tiers (lead with the emotional hook) */}
                <FormCard title="Select an Impact Tier" step={1}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {IMPACT_TIERS.map((tier) => {
                      const active = activeTier === tier.id && customInput === '';
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => { setActiveTier(tier.id); setCustomInput(''); }}
                          className={`relative text-left rounded-xl border-2 px-4 py-4 transition ${
                            active ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-md' : 'border-slate-200 bg-white hover:border-[#D4AF37]/60 hover:shadow-sm'
                          }`}
                        >
                          {active && (
                            <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center">
                              <svg className="w-3 h-3 text-[#0F2942]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </span>
                          )}
                          <div className="text-2xl mb-2 leading-none">{tier.icon}</div>
                          <div className="font-black text-[#0F2942] text-sm">{tier.label}</div>
                          <div className={`font-black text-base mt-0.5 ${active ? 'text-[#8B6914]' : 'text-[#D4AF37]'}`}>
                            {formatMoney(convertUsd(tier.usd, currency), currency)}
                          </div>
                          <p className="mt-1.5 text-[11px] text-[#0F2942]/50 leading-relaxed">{tier.description}</p>
                        </button>
                      );
                    })}
                  </div>
                  {formErrors.amount && (
                    <p className="mt-2 text-xs text-red-600">{formErrors.amount}</p>
                  )}
                </FormCard>

                {/* Custom amount — FIXED: minimum guard + clear label */}
                <FormCard title="Or Enter a Custom Amount" step={2}>
                  {/* Quick-bump row */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {[10, 25, 50, 100, 250].map((usdVal) => {
                      const locAmt = convertUsd(usdVal, currency);
                      return (
                        <button
                          key={usdVal}
                          type="button"
                          onClick={() => { setCustomInput(String(locAmt)); setActiveTier(''); }}
                          className="px-3 py-1.5 rounded-full border border-[#D4AF37]/50 text-xs font-bold text-[#0F2942] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition"
                        >
                          +{formatMoney(locAmt, currency)}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0F2942]/40 pointer-events-none">
                        {currency}
                      </span>
                      <input
                        type="number"
                        min={activeCurrencyMeta.step}
                        step={activeCurrencyMeta.step}
                        placeholder={`Min. ${formatMoney(convertUsd(1, currency), currency)}`}
                        value={customInput}
                        onChange={(e) => {
                          setCustomInput(e.target.value);
                          setActiveTier('');
                        }}
                        className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 outline-none text-[#0F2942] font-bold text-base transition"
                      />
                    </div>
                    {customInput && (
                      <button
                        type="button"
                        onClick={() => { setCustomInput(''); setActiveTier('t150'); }}
                        className="text-xs text-[#0F2942]/40 hover:text-[#0F2942] transition"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {/* FIXED: show minimum error inline, not just on submit */}
                  {customInput !== '' && Number(customInput) < 1 && (
                    <p className="mt-1.5 text-xs text-red-600">Amount must be at least {formatMoney(convertUsd(1, currency), currency)}</p>
                  )}
                  {amountInCurrency > 0 && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0F2942]">
                        {formatMoney(amountInCurrency, currency)}
                        {currency !== 'USD' && amountUSD > 0 && (
                          <span className="ml-2 text-xs font-normal text-[#0F2942]/40">≈ {formatMoney(amountUSD, 'USD')}</span>
                        )}
                      </span>
                      {impactText && <span className="text-xs text-[#D4AF37] font-semibold">{impactText}</span>}
                    </div>
                  )}
                </FormCard>

                {/* REORDERED: Project selector is now 3rd — after the donor picks an amount */}
                <FormCard title="Choose Your Project Focus" step={3}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PROJECT_OPTIONS.map((p) => {
                      const active = selectedProjects.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleProject(p.id)}
                          className={`text-left rounded-xl border-2 px-4 py-3 transition ${
                            active ? 'border-[#0F2942] bg-[#0F2942] text-white' : 'border-slate-200 bg-white text-[#0F2942] hover:border-[#D4AF37]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-bold leading-snug">{p.name}</span>
                            {p.urgency && (
                              <span className={`shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                                p.urgency === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {p.urgency}
                              </span>
                            )}
                          </div>
                          {p.shortSummary && (
                            <p className={`mt-1 text-[11px] leading-relaxed line-clamp-2 ${active ? 'text-white/70' : 'text-[#0F2942]/50'}`}>
                              {p.shortSummary}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[11px] text-[#0F2942]/40">
                    {selectedProjects.length} project{selectedProjects.length !== 1 ? 's' : ''} selected
                  </p>
                </FormCard>

                {/* Recurring toggle */}
                <FormCard title="Giving Frequency" step={4}>
                  <div className="inline-flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    {[{ val: false, label: 'One-time' }, { val: true, label: 'Monthly' }].map((opt) => (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => setRecurring(opt.val)}
                        className={`px-6 py-2.5 text-sm font-bold transition ${
                          recurring === opt.val ? 'bg-[#0F2942] text-white' : 'text-[#0F2942] hover:bg-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {recurring && (
                    <p className="mt-2 text-xs text-[#D4AF37] font-semibold">
                      Your gift will repeat monthly — cancel anytime by contacting us.
                    </p>
                  )}
                </FormCard>

                {/* STEP 2 — Donor details (now includes message + anonymous) */}
                <FormCard title="Your Details">
                  <div className="space-y-4">
                    <FormField label="Full Name *" error={formErrors.name}>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className={inputCls(formErrors.name)}
                        disabled={form.anonymous}
                      />
                    </FormField>
                    <FormField label="Email Address *" error={formErrors.email}>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className={inputCls(formErrors.email)}
                      />
                    </FormField>
                    <FormField
                      label={`Phone Number${method === 'mpesa' ? ' *' : ' (optional)'}`}
                      error={formErrors.phone}
                    >
                      <input
                        type="tel"
                        placeholder="+254 7XX XXX XXX"
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        className={inputCls(formErrors.phone)}
                      />
                      {method === 'mpesa' && (
                        <p className="mt-1.5 text-xs text-[#0F2942]/50 flex items-start gap-1.5">
                          <span className="shrink-0">📱</span>
                          <span>An <strong>Equity Bank EazzyPay</strong> payment prompt will be pushed to this number via M-Pesa. You only enter your PIN to authorise — no account numbers to copy.</span>
                        </p>
                      )}
                    </FormField>

                    {/* ADDED: Message / dedication field */}
                    <FormField label="Message or Prayer (optional)">
                      <textarea
                        rows={3}
                        placeholder="Share a prayer, dedication, or message for the congregation…"
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 outline-none text-[#0F2942] text-sm transition resize-none"
                      />
                    </FormField>

                    {/* ADDED: Anonymous checkbox */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div
                        onClick={() => setForm((p) => ({ ...p, anonymous: !p.anonymous, name: p.anonymous ? '' : p.name }))}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition shrink-0 ${
                          form.anonymous ? 'bg-[#0F2942] border-[#0F2942]' : 'border-slate-300'
                        }`}
                      >
                        {form.anonymous && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-[#0F2942]/70">
                        Give anonymously <span className="text-[#0F2942]/40 text-xs">(your name won't be displayed)</span>
                      </span>
                    </label>
                  </div>
                </FormCard>
              </div>

              {/* ── RIGHT COLUMN (sticky) ────────────────────────────────── */}
              {/* REORDERED: Summary+Submit is now first for instant visibility */}
              <div className="space-y-6 lg:sticky lg:top-6 self-start">

                {/* Summary + submit — FIRST in the right column */}
                <div className="bg-gradient-to-br from-[#0B1F34] to-[#0F2942] rounded-2xl p-6 text-white shadow-xl border border-[#D4AF37]/20">
                  <div className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-3">Your Gift Summary</div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/55">Amount</span>
                      <span className="font-black text-lg text-[#D4AF37]">{amountInCurrency > 0 ? formatMoney(amountInCurrency, currency) : '—'}</span>
                    </div>
                    {currency !== 'USD' && amountUSD > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-white/35">≈ USD</span>
                        <span className="text-white/55">{formatMoney(amountUSD, 'USD')}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-2 mt-1 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-white/55">Frequency</span>
                        <span className="font-semibold">{recurring ? '🔁 Monthly' : 'One-time'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/55">Method</span>
                        <span className="font-semibold">{PAYMENT_METHODS.find((pm) => pm.id === method)?.icon} {PAYMENT_METHODS.find((pm) => pm.id === method)?.label}</span>
                      </div>
                      {method === 'mpesa' && (
                        <div className="mt-2 rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-xs space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]/60 mb-1">{EAZZY_PAY}</div>
                          <div className="flex justify-between font-mono"><span className="text-white/40">Paybill</span><span className="text-[#D4AF37] font-bold">{PAYBILL}</span></div>
                          <div className="flex justify-between font-mono"><span className="text-white/40">Account</span><span className="text-[#D4AF37] font-bold">{ACCOUNT}</span></div>
                          <p className="text-[10px] text-white/35 mt-1">Funds deposited directly into Equity Bank</p>
                        </div>
                      )}
                    </div>
                    {impactText && (
                      <p className="text-[11px] text-[#D4AF37]/80 font-semibold mt-1">{impactText}</p>
                    )}
                  </div>

                  {submitError && (
                    <div className="mb-3 rounded-lg bg-red-500/20 border border-red-400/30 px-3 py-2 text-xs text-red-200">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || amountInCurrency <= 0}
                    className={`w-full py-3.5 rounded-xl font-black text-base transition ${
                      isSubmitting || amountInCurrency <= 0
                        ? 'bg-white/15 text-white/35 cursor-not-allowed'
                        : 'bg-[#D4AF37] text-[#0F2942] hover:brightness-110 active:scale-[0.98]'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                          <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                        </svg>
                        Processing…
                      </span>
                    ) : amountInCurrency > 0 ? (
                      `Donate ${formatMoney(amountInCurrency, currency)}`
                    ) : (
                      'Select an Amount'
                    )}
                  </button>
                  <p className="mt-3 text-[10px] text-white/30 text-center leading-relaxed">
                    🔒 Secure · Freewill offering above tithe · 100% reaches ministry
                  </p>
                </div>

                {/* STEP 3 — Payment method (now second in right column) */}
                <FormCard title="Payment Method">
                  <div className="space-y-2">
                    {PAYMENT_METHODS.map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setMethod(pm.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition ${
                          method === pm.id ? 'border-[#0F2942] bg-[#0F2942]/5' : 'border-slate-200 bg-white hover:border-[#D4AF37]'
                        }`}
                      >
                        <span className="text-xl leading-none">{pm.icon}</span>
                        <div className="text-left">
                          <div className="text-sm font-bold text-[#0F2942]">{pm.label}</div>
                          <div className="text-xs text-[#0F2942]/45">{pm.desc}</div>
                        </div>
                        <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          method === pm.id ? 'border-[#0F2942] bg-[#0F2942]' : 'border-slate-300'
                        }`}>
                          {method === pm.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* M-Pesa recipient info — visible when M-Pesa is selected so donor knows who they’re paying */}
                  {method === 'mpesa' && (
                    <div className="mt-3 rounded-xl bg-[#EFF6FF] border border-[#0F2942]/12 px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">🏦</span>
                        <p className="text-xs font-black text-[#0F2942]/70">{EAZZY_PAY}</p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#0F2942]/55">M-Pesa Paybill</span>
                          <span className="font-mono font-black text-[#0F2942] text-sm">{PAYBILL}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#0F2942]/55">Account No.</span>
                          <span className="font-mono font-bold text-[#0F2942] text-xs">{ACCOUNT}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-[10px] text-[#0F2942]/50 leading-relaxed">
                        📱 We send a payment prompt to your phone — you just enter your M-Pesa PIN to authorise. No manual entry needed. Your donation lands directly in <strong>Equity Bank</strong>.
                      </p>
                    </div>
                  )}
                </FormCard>

                {/* QR code preview */}
                {amountInCurrency > 0 && (
                  <div className="bg-white rounded-2xl border border-[#D4AF37]/30 p-5 flex flex-col items-center shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#0F2942]/35 mb-3">Scan to Pay</p>
                    <div className="p-3 bg-[#F7F4EF] rounded-xl">
                      <QRCode value={qrData} size={110} fgColor="#0F2942" bgColor="#F7F4EF" />
                    </div>
                    <p className="mt-2 text-[10px] text-[#0F2942]/35 text-center">
                      QR encodes {method === 'mpesa' ? 'Paybill' : method === 'bank' ? 'bank' : 'SWIFT'} + amount
                    </p>
                  </div>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </section>

      {/* ── MOBILE FIXED BOTTOM BAR ─────────────────────────────────────── */}
      {/* Shows live amount and donate button — always visible on mobile while form is open */}
      {!submitted && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#0F2942]/50 font-medium">Your gift</div>
            <div className="font-black text-[#0F2942] text-base leading-tight truncate">
              {amountInCurrency > 0 ? formatMoney(amountInCurrency, currency) : 'No amount selected'}
            </div>
            {impactText && <div className="text-[10px] text-[#D4AF37] font-semibold">{impactText}</div>}
          </div>
          <button
            form="donate-form"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || amountInCurrency <= 0}
            className={`shrink-0 px-5 py-3 rounded-xl font-black text-sm transition ${
              isSubmitting || amountInCurrency <= 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#D4AF37] text-[#0F2942] hover:brightness-110 active:scale-95'
            }`}
          >
            {isSubmitting ? '…' : amountInCurrency > 0 ? `Donate ${formatMoney(amountInCurrency, currency)}` : 'Select Amount'}
          </button>
        </div>
      )}

      {/* ── 5. TRANSPARENCY SECTION ─────────────────────────────────────── */}
      <section className="bg-[#0F2942] text-white py-16 px-4 mt-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-3">Full Transparency</p>
            <h2 className="text-3xl font-black mb-3">Detailed Budget Sheet</h2>
            <p className="text-white/60 text-sm max-w-xl mx-auto">
              Annual construction fund allocation — every line item tracked and audited.
            </p>
          </motion.div>

          {/* Currency selector row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 px-1">
            <div>
              <p className="text-xs text-white/50">View budget in preferred currency</p>
              {ratesAge && (
                <p className="text-[10px] text-white/30 mt-0.5">
                  🔄 Live rates · updated {Math.round((Date.now() - ratesAge.getTime()) / 60000) < 1
                    ? 'just now'
                    : `${Math.round((Date.now() - ratesAge.getTime()) / 60000)} min ago`
                  } · refreshes every 10 min
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Exchange rate chip — shows live converted rate */}
              <span className="text-xs text-white/50 bg-white/[0.06] rounded-full px-3 py-1.5 font-mono flex items-center gap-1.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${ratesAge ? 'bg-green-400' : 'bg-yellow-400'}`} />
                1 USD ≈ {currency === 'USD'
                  ? '1'
                  : Number((exchangeRates[currency] ?? CURRENCY_META[currency]?.rate ?? 1).toFixed(4)).toLocaleString('en')
                } {currency}
                {!ratesAge && <span className="text-yellow-400/70 ml-1">(est.)</span>}
              </span>
              {/* Currency picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowBudgetCurrency((s) => !s); setBudgetCurrencyQuery(''); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition text-sm font-bold text-white"
                >
                  {activeCurrencyMeta.countryCode && (
                    <img src={`https://flagcdn.com/24x18/${activeCurrencyMeta.countryCode}.png`} alt="" className="h-[12px] w-[17px] rounded-[2px] object-cover" loading="lazy" />
                  )}
                  <span>{currency}</span>
                  <span className="text-white/50 font-normal text-xs">— {activeCurrencyMeta.name}</span>
                  <span className="text-[#D4AF37] text-xs ml-1">{showBudgetCurrency ? '▲' : '▼'}</span>
                </button>
                <AnimatePresence>
                  {showBudgetCurrency && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 top-full mt-2 right-0 w-72 bg-[#0A1F35] border border-white/15 rounded-2xl shadow-2xl p-3"
                    >
                      <input
                        type="text"
                        placeholder="Search currency…"
                        value={budgetCurrencyQuery}
                        onChange={(e) => setBudgetCurrencyQuery(e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 mb-2"
                        autoFocus
                      />
                      <div className="max-h-56 overflow-y-auto rounded-xl divide-y divide-white/[0.08]">
                        {filteredBudgetCurrencies.map((meta) => {
                          const active = currency === meta.code;
                          return (
                            <button
                              key={meta.code}
                              type="button"
                              onClick={() => { setCurrency(meta.code); setShowBudgetCurrency(false); setBudgetCurrencyQuery(''); }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-left transition ${
                                active ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'hover:bg-white/10 text-white'
                              }`}
                            >
                              {meta.countryCode ? (
                                <img src={`https://flagcdn.com/24x18/${meta.countryCode}.png`} alt="" className="h-[11px] w-[15px] rounded-[2px] object-cover border border-white/15 shrink-0" loading="lazy" />
                              ) : (
                                <span className="inline-flex h-[11px] w-[15px] items-center justify-center text-[8px] font-bold bg-white/20 rounded-[2px] shrink-0">{meta.code.slice(0, 1)}</span>
                              )}
                              <span className="text-xs font-bold w-8 shrink-0">{meta.code}</span>
                              <span className={`text-[10px] truncate ${active ? 'text-[#D4AF37]/75' : 'text-white/50'}`}>{meta.name}</span>
                            </button>
                          );
                        })}
                        {filteredBudgetCurrencies.length === 0 && (
                          <div className="px-3 py-4 text-xs text-white/40 text-center">No results</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Budget table */}
          <motion.div
            className="rounded-2xl overflow-hidden border border-white/10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto] bg-white/[0.08] px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-white/40 border-b border-white/10">
              <span>Budget Line Item</span>
              <span className="text-center w-20">Allocation</span>
              <span className="text-right w-36">Amount ({currency})</span>
            </div>

            {budgetGroupsDisplay.map((grp, gi) => (
              <div key={grp.group}>
                {/* Group header row */}
                <div
                  className="px-5 py-2.5 text-xs font-black uppercase tracking-widest border-l-4"
                  style={{ backgroundColor: grp.color + '22', borderLeftColor: grp.color }}
                >
                  <span className="text-[#D4AF37]">{grp.group}</span>
                </div>

                {/* Line items */}
                {grp.items.map((item, ii) => (
                  <motion.div
                    key={item.label}
                    className="grid grid-cols-[1fr_auto_auto] px-5 py-3 border-b border-white/[0.05] hover:bg-white/[0.03] transition"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: gi * 0.04 + ii * 0.03 }}
                  >
                    <span className="text-sm text-white/75 pl-3">{item.label}</span>
                    <span className="text-sm text-center w-20 text-[#D4AF37] font-bold">{item.pct}%</span>
                    <span className="text-sm text-right w-36 font-mono text-white/65">{item.amount}</span>
                  </motion.div>
                ))}

                {/* Subtotal row */}
                <div className="grid grid-cols-[1fr_auto_auto] px-5 py-2.5 bg-white/[0.04] border-b border-white/10">
                  <span className="text-xs font-black text-white/45 pl-3 uppercase tracking-wider">Subtotal</span>
                  <span className="text-xs font-black text-center w-20 text-white/55">{grp.groupPct}%</span>
                  <span className="text-xs font-black text-right w-36 font-mono text-white/55">{grp.subtotal}</span>
                </div>
              </div>
            ))}

            {/* Total row */}
            <div className="grid grid-cols-[1fr_auto_auto] px-5 py-4 bg-[#D4AF37]/10 border-t-2 border-[#D4AF37]/30">
              <span className="font-black text-white">Total Construction Budget</span>
              <span className="font-black text-center w-20 text-[#D4AF37]">100%</span>
              <span className="font-black text-right w-36 font-mono text-[#D4AF37]">
                {formatMoney(convertUsd(CAMPAIGN_GOAL, currency), currency)}
              </span>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 text-xs text-white/40 leading-relaxed text-center"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          >
            Clinic 6 SDA Church publishes annual construction audits via the Turkana County Field treasury.
            Currency conversions use indicative exchange rates and are shown for reference only.{' '}
            <strong className="text-[#D4AF37]">All donations are received and processed in USD.</strong>{' '}
            <strong className="text-[#D4AF37]">Tithe Boundary:</strong> These are freewill offerings above the systematic tithe — tithes must be returned through your home congregation's official Field/Conference treasury channel.
          </motion.div>
        </div>
      </section>

      {/* ── 6. OVERSIGHT BAR ────────────────────────────────────────────── */}
      <section className="bg-[#F7F4EF] py-12 px-4 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#0F2942]/35 font-bold mb-6">Under the Oversight of</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['East Africa Division · SDA', 'Turkana County Field', 'Kakuma District', 'SDA Clinic 6 Treasury'].map((p) => (
              <span key={p} className="px-4 py-2 rounded-full border border-[#0F2942]/12 bg-white text-sm font-semibold text-[#0F2942]/45">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
