import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

/* ============================================================ */
/*  PaymentPortal.jsx                                            */
/*  Interactive fintech-style giving portal for Clinic 6 SDA     */
/*  Palette: sand #F7F4EF / navy #0F2942 / gold #D4AF37          */
/* ============================================================ */

/* ---------- Tiny inline icon set ---------- */
const CopyIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const AlertIcon = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="13" />
    <line x1="12" y1="16.5" x2="12" y2="16.5" />
  </svg>
);
const LockIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

/* ---------- Reusable: copyable number row ---------- */
function CopyChip({ label, value, size = "lg" }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked — silently ignore */
    }
  };
  const valSize =
    size === "xl"
      ? "text-4xl md:text-5xl"
      : size === "lg"
        ? "text-2xl md:text-3xl"
        : "text-xl";
  return (
    <button
      type="button"
      onClick={onCopy}
      className="group w-full text-left bg-[#F7F4EF] hover:bg-white border border-[#0F2942]/10 hover:border-[#D4AF37] rounded-2xl px-5 py-4 transition-all duration-300 flex items-center justify-between gap-4"
      aria-label={`Copy ${label}`}
    >
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#0F2942]/60 font-semibold">
          {label}
        </p>
        <p
          className={`font-display font-black text-[#0F2942] leading-none mt-2 truncate ${valSize}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="text-[#D4AF37]"
              >
                COPIED!
              </motion.span>
            ) : (
              <motion.span
                key="value"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {value}
              </motion.span>
            )}
          </AnimatePresence>
        </p>
      </div>
      <span
        className={
          "shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all " +
          (copied
            ? "bg-[#D4AF37] text-[#0F2942]"
            : "bg-[#0F2942] text-white group-hover:bg-[#D4AF37] group-hover:text-[#0F2942]")
        }
      >
        {copied ? (
          <CheckIcon className="w-3.5 h-3.5" />
        ) : (
          <CopyIcon className="w-3.5 h-3.5" />
        )}
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

/* ---------- Read-only detail row ---------- */
function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-[#0F2942]/10 last:border-b-0">
      <span className="text-[11px] uppercase tracking-[0.25em] text-[#0F2942]/55 font-semibold">
        {label}
      </span>
      <span className="font-display font-semibold text-[#0F2942] text-right">
        {value}
      </span>
    </div>
  );
}

/* ---------- Tabs config ---------- */
const TABS = [
  { id: "mpesa", label: "M-Pesa", sub: "East Africa" },
  { id: "bank", label: "Regional Bank", sub: "Equity · Lokichogio" },
  { id: "global", label: "Global Wire", sub: "SWIFT · International" },
];

/* ============================================================ */
/*  TAB PANELS                                                   */
/* ============================================================ */

function MpesaPanel() {
  const steps = [
    "Open the M-Pesa menu on your phone.",
    "Tap Lipa na M-Pesa → Pay Bill.",
    "Enter Business Number 247247.",
    "Enter Account Number 105225.",
    "Confirm the amount and authorise with your PIN.",
  ];
  return (
    <div className="space-y-6">
      {/* Brand tag */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 bg-[#00A859] text-white font-bold text-xs px-3 py-1.5 rounded-md tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          M-PESA
        </span>
        <span className="text-xs text-[#0F2942]/60">
          Safaricom · Powered by Vodafone
        </span>
      </div>

      {/* Big numbers */}
      <div className="grid sm:grid-cols-2 gap-3">
        <CopyChip label="Paybill / Business No." value="247247" size="xl" />
        <CopyChip label="Account Number" value="105225" size="lg" />
      </div>

      <DetailRow
        label="Account Name"
        value="SEVENTH DAY ADVENTIST CHURCH EAST AFRICAN UNION CLINIC SIX KAKUMA"
      />

      {/* Numbered step list */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-4">
          Step-by-step
        </p>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-[#0F2942] text-[#D4AF37] font-display font-black flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <p className="text-[#0F2942] text-sm md:text-base leading-relaxed pt-1">
                {s}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function BankPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 bg-[#8B1A1A] text-white font-bold text-xs px-3 py-1.5 rounded-md tracking-wide">
          EQUITY BANK
        </span>
        <span className="text-xs text-[#0F2942]/60">
          Member of the Kenya Bankers Association
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <CopyChip label="Account Number" value="1650280005225" size="lg" />
        <div className="bg-[#0F2942] text-white rounded-2xl px-5 py-4 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37] font-semibold">
            Currency Accepted
          </p>
          <p className="font-display font-bold text-xl mt-1">KES · USD · EUR</p>
        </div>
      </div>

      <div className="bg-[#F7F4EF] border border-[#0F2942]/10 rounded-2xl overflow-hidden">
        <DetailRow label="Bank" value="Equity Bank Kenya Limited" />
        <DetailRow label="Branch" value="Lokichogio Branch" />
        <DetailRow
          label="Account Name"
          value="SEVENTH DAY ADVENTIST CHURCH EAST AFRICAN UNION CLINIC SIX KAKUMA"
        />
        <DetailRow label="Reference" value="Use 'SEATS' as narrative" />
      </div>

      <p className="text-xs text-[#0F2942]/60 leading-relaxed">
        Walk-in, mobile-banking, and Equity Online transfers are all accepted.
        Please keep your transaction slip for stewardship records.
      </p>
    </div>
  );
}

function GlobalPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 bg-[#0F2942] text-[#D4AF37] font-bold text-xs px-3 py-1.5 rounded-md tracking-wide">
          SWIFT / BIC
        </span>
        <span className="text-xs text-[#0F2942]/60">
          International Remittance
        </span>
      </div>

      <CopyChip label="SWIFT Code" value="EQBLKENAXXX" size="xl" />

      <div className="bg-[#F7F4EF] border border-[#0F2942]/10 rounded-2xl overflow-hidden">
        <DetailRow label="Beneficiary Bank" value="Equity Bank Kenya Limited" />
        <DetailRow label="Branch" value="Lokichogio · Turkana, Kenya" />
        <DetailRow label="Beneficiary Account" value="1650280005225" />
        <DetailRow
          label="Beneficiary Name"
          value="SEVENTH DAY ADVENTIST CHURCH EAST AFRICAN UNION CLINIC SIX KAKUMA"
        />
        <DetailRow label="Intermediary" value="Equity Direct" />
      </div>

      <div className="flex items-start gap-3 bg-[#0F2942] text-white rounded-2xl px-5 py-4">
        <LockIcon className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-white/90">
          All international wires are received through Equity Bank's compliant
          SWIFT correspondent network. Your sending bank may add a small
          intermediary fee — please add it on top of your intended gift.
        </p>
      </div>
    </div>
  );
}

/* ============================================================ */
/*  MAIN                                                         */
/* ============================================================ */
export default function PaymentPortal() {
  const [active, setActive] = useState("mpesa");

  return (
    <section className="bg-[#F7F4EF] text-[#0F2942] py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto">
        {/* ===== Header ===== */}
        <div className="text-center mb-10">
          <p className="inline-flex items-center gap-2 text-[#D4AF37] uppercase tracking-[0.35em] text-[11px] font-semibold mb-4">
            <LockIcon className="w-4 h-4" />
            Secure Payment Portal
          </p>
          <h1 className="font-display font-black text-4xl md:text-6xl leading-[0.95]">
            Give to <span className="italic text-[#D4AF37]">Clinic 6</span>.
          </h1>
          <p className="mt-4 text-[#0F2942]/65 text-base md:text-lg max-w-xl mx-auto">
            Choose your preferred method — every shilling builds a seat in the
            sanctuary.
          </p>
        </div>

        {/* ===== Checkout Card ===== */}
        <div className="relative bg-white rounded-3xl shadow-2xl ring-1 ring-[#0F2942]/5 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          {/* Tabs with sliding underline */}
          <div
            role="tablist"
            aria-label="Payment method"
            className="relative grid grid-cols-3 border-b border-[#0F2942]/10"
          >
            {TABS.map((t) => {
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(t.id)}
                  className="relative px-3 py-5 md:py-6 text-center transition-colors group"
                >
                  <span
                    className={
                      "block font-display font-bold text-sm md:text-base transition-colors " +
                      (isActive
                        ? "text-[#0F2942]"
                        : "text-[#0F2942]/45 group-hover:text-[#0F2942]/75")
                    }
                  >
                    {t.label}
                  </span>
                  <span
                    className={
                      "block text-[10px] uppercase tracking-[0.22em] mt-1 transition-colors " +
                      (isActive ? "text-[#D4AF37]" : "text-[#0F2942]/35")
                    }
                  >
                    {t.sub}
                  </span>
                  {/* Sliding gold underline */}
                  {isActive && (
                    <motion.span
                      layoutId="portal-tab-underline"
                      className="absolute left-4 right-4 -bottom-px h-[3px] bg-[#D4AF37] rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel body */}
          <div className="p-6 md:p-10 min-h-[440px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {active === "mpesa" && <MpesaPanel />}
                {active === "bank" && <BankPanel />}
                {active === "global" && <GlobalPanel />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stewardship Guardrail */}
          <div className="border-t border-[#0F2942]/10 bg-[#FFFBEF] px-6 md:px-10 py-5">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-[#D4AF37] text-[#0F2942] flex items-center justify-center">
                <AlertIcon className="w-5 h-5" />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#0F2942] font-black">
                  Tithe Boundary Protection
                </p>
                <p className="text-sm text-[#0F2942]/80 leading-relaxed mt-1">
                  These are{" "}
                  <span className="font-semibold">Freewill Offerings</span>
                  &nbsp;above and beyond regular tithe. Tithe continues to be
                  returned through your local conference channels.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Footer Hierarchy ===== */}
        <div className="mt-14">
          <p className="text-center text-[10px] uppercase tracking-[0.35em] text-[#0F2942]/50 font-semibold mb-6">
            Administrative Hierarchy
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#0F2942]/10 border border-[#0F2942]/10 rounded-2xl overflow-hidden">
            {[
              { tier: "District", name: "Lokichogio", note: "Local Oversight" },
              { tier: "Station", name: "Kakuma", note: "Operational Base" },
              {
                tier: "Field",
                name: "Rift Valley Field",
                note: "Regional Authority",
              },
            ].map((h) => (
              <div key={h.tier} className="bg-white px-5 py-6 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
                  {h.tier}
                </p>
                <p className="font-display font-bold text-[#0F2942] text-lg mt-2">
                  {h.name}
                </p>
                <p className="text-[11px] text-[#0F2942]/55 mt-1">{h.note}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-[#0F2942]/45 mt-5">
            Under the East Kenya Union Conference of Seventh-day Adventists.
          </p>
        </div>
      </div>
    </section>
  );
}
