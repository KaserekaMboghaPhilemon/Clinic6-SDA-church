import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import dreamChurch from "./assets/Clinic6 dream church (2).png";

/* ============================================================ */
/*  GivingGateway.jsx                                            */
/*  Design language: ECI structure + Casavera typography         */
/*  Palette: sand #F7F4EF / navy #0F2942 / gold #D4AF37          */
/* ============================================================ */

/* ---------- Inline icons (no icon-lib dependency) ---------- */
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
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const CheckIcon = ({ className = "w-4 h-4" }) => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ShieldIcon = ({ className = "w-5 h-5" }) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const VerifiedIcon = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 1l2.4 2.4 3.4-.4.6 3.4 3.2 1.4-1.4 3.2L22 13l-1.8 2.6 1.4 3.2-3.2 1.4-.6 3.4-3.4-.4L12 23l-2.4-2.4-3.4.4-.6-3.4-3.2-1.4 1.4-3.2L2 11l1.8-2.6L2.4 5.2l3.2-1.4.6-3.4 3.4.4L12 1zm-1.2 13.6l5.6-5.6-1.4-1.4-4.2 4.2-1.8-1.8-1.4 1.4 3.2 3.2z" />
  </svg>
);

/* ---------- CopyField: number row with one-shot copy state ---------- */
function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no-op (clipboard may be blocked) */
    }
  };
  return (
    <div className="flex items-center justify-between gap-4 bg-[#F7F4EF] border border-[#0F2942]/10 rounded-2xl px-5 py-4 hover:border-[#D4AF37]/60 transition-colors">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#0F2942]/60 font-semibold">
          {label}
        </p>
        <p className="font-display text-2xl md:text-3xl font-bold text-[#0F2942] mt-1 truncate">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className={
          "shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 " +
          (copied
            ? "bg-[#0F2942] text-[#D4AF37]"
            : "bg-[#0F2942] text-white hover:bg-[#D4AF37] hover:text-[#0F2942]")
        }
      >
        {copied ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <CopyIcon className="w-4 h-4" />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/* ---------- Static read-only row (no copy button) ---------- */
function StaticField({ label, value }) {
  return (
    <div className="bg-[#F7F4EF] border border-[#0F2942]/10 rounded-2xl px-5 py-4">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#0F2942]/60 font-semibold">
        {label}
      </p>
      <p className="font-display text-lg md:text-xl font-semibold text-[#0F2942] mt-1">
        {value}
      </p>
    </div>
  );
}

/* ---------- Tabs config ---------- */
const TABS = [
  { id: "mpesa", label: "M-Pesa", region: "Kenya · East Africa" },
  { id: "bank", label: "Regional Bank", region: "Equity Bank · Lokichogio" },
  { id: "wire", label: "Global Wire", region: "International SWIFT" },
];

/* ---------- Per-tab content ---------- */
function MpesaPanel() {
  return (
    <div className="space-y-3">
      <CopyField label="Business / Paybill No." value="247247" />
      <CopyField label="Account No." value="105225" />
      <StaticField
        label="Account Name"
        value="SEVENTH DAY ADVENTIST CHURCH EAST AFRICAN UNION CLINIC SIX KAKUMA"
      />
      <div className="bg-[#0F2942] text-white rounded-2xl px-5 py-4 mt-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
          How to give
        </p>
        <ol className="mt-2 text-sm leading-relaxed text-white/90 list-decimal list-inside space-y-1">
          <li>Open M-Pesa → Lipa na M-Pesa → Pay Bill</li>
          <li>
            Enter Business No.{" "}
            <span className="font-bold text-[#D4AF37]">247247</span>
          </li>
          <li>
            Account No. <span className="font-bold text-[#D4AF37]">105225</span>
          </li>
          <li>Enter amount → Confirm with PIN.</li>
        </ol>
      </div>
    </div>
  );
}

function BankPanel() {
  return (
    <div className="space-y-3">
      <StaticField label="Bank" value="Equity Bank Kenya Limited" />
      <StaticField label="Branch" value="Lokichogio Branch" />
      <CopyField label="Account No." value="1650280005225" />
      <StaticField
        label="Account Name"
        value="SEVENTH DAY ADVENTIST CHURCH EAST AFRICAN UNION CLINIC SIX KAKUMA"
      />
      <p className="text-xs text-[#0F2942]/60 leading-relaxed pt-2 px-1">
        Please reference{" "}
        <span className="font-semibold text-[#0F2942]">"SEATS"</span> or
        <span className="font-semibold text-[#0F2942]"> "SANCTUARY"</span> in
        the transaction narrative so we can attribute your gift correctly.
      </p>
    </div>
  );
}

function WirePanel() {
  return (
    <div className="space-y-3">
      <CopyField label="SWIFT / BIC" value="EQBLKENAXXX" />
      <StaticField label="Bank" value="Equity Bank Kenya Limited" />
      <StaticField label="Branch" value="Lokichogio, Turkana County, Kenya" />
      <CopyField label="Beneficiary Acc." value="1650280005225" />
      <StaticField
        label="Beneficiary Name"
        value="SEVENTH DAY ADVENTIST CHURCH EAST AFRICAN UNION CLINIC SIX KAKUMA"
      />
      <p className="text-xs text-[#0F2942]/60 leading-relaxed pt-2 px-1">
        For international remittances. Your sending bank may require an
        intermediary correspondent — please request this from Equity Bank if
        asked.
      </p>
    </div>
  );
}

/* ============================================================ */
/*  Main component                                               */
/* ============================================================ */
export default function GivingGateway() {
  const [active, setActive] = useState("mpesa");

  /* Tracker math — 868 voices, 850-seat goal */
  const seatsGoal = 850;
  const seatsSecured = 312; // adjust as project progresses
  const seatsPercent = Math.min(
    100,
    Math.round((seatsSecured / seatsGoal) * 100),
  );
  const seatsRemaining = seatsGoal - seatsSecured;

  return (
    <section className="relative overflow-hidden bg-[#F7F4EF] text-[#0F2942] py-24 md:py-32 px-6">
      {/* Watermark — Clinic6 dream church */}
      <img
        src={dreamChurch}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-32 -bottom-24 w-[720px] max-w-none opacity-[0.05] hidden md:block"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#0F2942 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* ===== Header ===== */}
        <div className="text-center mb-12 md:mb-16">
          <p className="inline-flex items-center gap-2 text-[#D4AF37] uppercase tracking-[0.35em] text-[11px] font-semibold mb-5">
            <span className="h-px w-8 bg-[#D4AF37]" />
            Secure Giving Gateway
            <span className="h-px w-8 bg-[#D4AF37]" />
          </p>
          <h1 className="font-display font-black text-[#0F2942] text-5xl md:text-7xl leading-[0.95]">
            Partner with <span className="italic text-[#D4AF37]">Clinic 6</span>
          </h1>
          <p className="mt-6 text-[#0F2942]/70 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Your freewill offering builds more than walls;
            <br className="hidden md:block" />
            it builds a sanctuary for 868 souls.
          </p>
        </div>

        {/* ===== Payment Card ===== */}
        <div className="relative bg-white rounded-3xl shadow-[0_30px_80px_-30px_rgba(15,41,66,0.35)] ring-1 ring-[#0F2942]/5 overflow-hidden">
          {/* Gold accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/60 to-[#D4AF37]" />

          <div className="p-6 md:p-10">
            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Payment method"
              className="relative grid grid-cols-3 bg-[#F7F4EF] rounded-2xl p-1.5 mb-8"
            >
              {TABS.map((t) => {
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(t.id)}
                    className="relative z-10 px-3 py-3 md:py-4 rounded-xl text-center transition-colors duration-300"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-tab-pill"
                        className="absolute inset-0 bg-[#0F2942] rounded-xl shadow-lg"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative">
                      <span
                        className={
                          "block font-display font-bold text-sm md:text-base " +
                          (isActive ? "text-[#D4AF37]" : "text-[#0F2942]")
                        }
                      >
                        {t.label}
                      </span>
                      <span
                        className={
                          "block text-[10px] uppercase tracking-[0.2em] mt-0.5 " +
                          (isActive ? "text-white/70" : "text-[#0F2942]/50")
                        }
                      >
                        {t.region}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Panel content with framer-motion transition */}
            <div className="min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {active === "mpesa" && <MpesaPanel />}
                  {active === "bank" && <BankPanel />}
                  {active === "wire" && <WirePanel />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ===== Tithe Protection ===== */}
            <div className="mt-8 flex items-start gap-4 border-l-4 border-[#D4AF37] bg-[#D4AF37]/[0.07] rounded-r-2xl px-5 py-4">
              <ShieldIcon className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
                  Tithe Protection Notice
                </p>
                <p className="text-sm text-[#0F2942] leading-relaxed mt-1">
                  In accordance with SDA policy, these are
                  <span className="font-semibold">
                    {" "}
                    Freewill Offerings
                  </span>{" "}
                  above and beyond Tithe. Tithe is returned through your local
                  conference channels.
                </p>
              </div>
            </div>

            {/* ===== Seat Target Tracker ===== */}
            <div className="mt-8">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#0F2942]/60 font-semibold">
                    Sanctuary Seating Goal
                  </p>
                  <p className="font-display font-bold text-[#0F2942] text-xl mt-1">
                    {seatsRemaining} of {seatsGoal} Seats Still Needed
                  </p>
                </div>
                <p className="font-display font-black text-3xl md:text-4xl text-[#D4AF37] leading-none">
                  {seatsPercent}
                  <span className="text-lg">%</span>
                </p>
              </div>
              <div className="h-2.5 w-full bg-[#0F2942]/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#c39d28] rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${seatsPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-[0.25em] text-[#0F2942]/50 mt-2">
                <span>{seatsSecured} secured</span>
                <span>Goal: {seatsGoal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Trust Footer ===== */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 bg-white border border-[#0F2942]/10 text-[#0F2942] rounded-full px-5 py-2.5 shadow-sm">
            <VerifiedIcon className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-semibold tracking-wide uppercase">
              Official Project · SDA Lokichogio District &amp; Rift Valley Field
            </span>
          </span>
          <span className="text-xs text-[#0F2942]/50">
            Every contribution is received through verified Clinic6 SDA Church
            accounts and audited by the general treasury.
          </span>
        </div>
      </div>
    </section>
  );
}
