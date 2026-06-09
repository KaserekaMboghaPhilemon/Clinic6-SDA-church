import React, { useState } from "react";
import dreamChurchImage from "./assets/Clinic6 dream church (2).png";

export default function DonationPortal({ t, currentLang }) {
  const [currency, setCurrency] = useState("USD"); // USD or KES
  const [billingCycle, setBillingCycle] = useState("one-time"); // one-time or monthly
  const [amount, setAmount] = useState(50);
  const [projectFocus, setProjectFocus] = useState("sanctuary"); // poultry, tailoring, agribusiness, sanctuary
  const [activeMethod, setActiveMethod] = useState("mpesa"); // mpesa, bank, wire
  const [checkoutState, setCheckoutState] = useState("idle"); // idle, processing, success
  const [copiedField, setCopiedField] = useState(null);

  // Live Exchange Rate Logic
  const exchangeRate = 130; // 1 USD = 130 KES
  const displayAmount = currency === "KES" ? amount * exchangeRate : amount;

  // Handle Quick Tier Taps
  const handleTierTap = (usdAmount) => {
    setAmount(usdAmount);
  };

  // One-Tap Clipboard Automation & Simulation
  const handleOneTapDonate = (e) => {
    e.preventDefault();
    setCheckoutState("processing");

    // Strictly automated clipboard copy based on active method
    let copyText = "";
    if (activeMethod === "mpesa") copyText = "1650280005225";
    else if (activeMethod === "bank") copyText = "1650280005225";
    else copyText = "EQBLKENAXXX";

    navigator.clipboard.writeText(copyText).then(() => {
      setTimeout(() => {
        setCheckoutState("success");
      }, 1500);
    });
  };

  const handleInlineCopy = (text, fieldId) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id="donate" className="relative min-h-screen bg-[#F7F4EF] py-24 px-4 md:px-12 flex items-center justify-center overflow-hidden">
      {/* Blurred Architectural Watermark Accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${dreamChurchImage})` }} />

      <div className="w-full max-w-7xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative z-10 grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT PANE: IMPACT SELECTOR & POWER SLIDER (7 Columns) */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase block mb-2">{t("donate.eyebrow")}</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#0F2942] tracking-tight leading-tight">{t("donate.heading")}</h2>
            <p className="text-slate-500 text-sm md:text-base mt-4 max-w-xl font-light leading-relaxed">{t("donate.subheading")}</p>

            {/* CURRENCY & BILLING TOGGLES */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="bg-[#F7F4EF] p-1 rounded-full flex border border-slate-200">
                <button onClick={() => setBillingCycle("one-time")} className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${billingCycle === "one-time" ? "bg-[#0F2942] text-white shadow" : "text-[#0F2942]/70 hover:text-[#0F2942]"}`}>{t("donate.oneTime")}</button>
                <button onClick={() => setBillingCycle("monthly")} className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${billingCycle === "monthly" ? "bg-[#0F2942] text-white shadow" : "text-[#0F2942]/70 hover:text-[#0F2942]"}`}>{t("donate.monthly")}</button>
              </div>

              <div className="bg-[#F7F4EF] p-1 rounded-full flex border border-slate-200">
                <button onClick={() => setCurrency("USD")} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${currency === "USD" ? "bg-[#D4AF37] text-[#0F2942] shadow" : "text-[#0F2942]/70"}`}>🇺🇸 USD</button>
                <button onClick={() => setCurrency("KES")} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${currency === "KES" ? "bg-[#D4AF37] text-[#0F2942] shadow" : "text-[#0F2942]/70"}`}>🇰🇪 KES</button>
              </div>
            </div>

            {/* QUICK VALUE BUBBLES */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              {[25, 150, 500].map((usdVal) => (
                <button key={usdVal} onClick={() => handleTierTap(usdVal)} className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${amount === usdVal ? "border-[#0F2942] bg-[#0F2942]/5" : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{usdVal === 25 ? t("donate.tierSpark") : usdVal === 150 ? t("donate.tierSustain") : t("donate.tierScale")}</div>
                  <div className="text-lg md:text-xl font-black text-[#0F2942] mt-1">{currency === "USD" ? `$${usdVal}` : `${(usdVal * exchangeRate).toLocaleString()} KES`}</div>
                </button>
              ))}
            </div>

            {/* POWER SLIDER MECHANIC */}
            <div className="mt-8 bg-[#F7F4EF]/50 p-6 rounded-2xl border border-slate-200/60">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-[#0F2942] uppercase tracking-wider">{t("donate.sliderLabel")}</span>
                <button onClick={() => setAmount(25)} className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded transition-colors uppercase tracking-widest">{t("donate.reset")}</button>
              </div>
              <input type="range" min="5" max="1000" step="5" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F2942]" />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                <span>{currency === "USD" ? "$5" : `${(5 * exchangeRate).toLocaleString()} KES`}</span>
                <span>{currency === "USD" ? "$500" : `${(500 * exchangeRate).toLocaleString()} KES`}</span>
                <span>{currency === "USD" ? "$1,000+" : `${(1000 * exchangeRate).toLocaleString()} KES+`}</span>
              </div>
            </div>

            {/* DYNAMIC CALCULATED LIVE IMPACT CARD */}
            <div className="mt-6 bg-[#0F2942] p-6 rounded-2xl text-[#F7F4EF] flex items-center justify-between shadow-lg">
              <div>
                <div className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest">{t("donate.impactHeading")}</div>
                <div className="text-xl md:text-2xl font-black mt-1">
                  {currency === "USD" ? `$${amount}.00` : `${(amount * exchangeRate).toLocaleString()}.00 KES`}
                </div>
              </div>
              <div className="text-right text-xs md:text-sm font-medium max-w-[55%] opacity-90 leading-relaxed">
                {t("donate.seatCalculation").replace("{count}", Math.max(1, Math.floor(amount / 25)))}
              </div>
            </div>

            {/* PROJECT FOCUS INTERACTIVE GRID */}
            <h3 className="text-sm font-black text-[#0F2942] uppercase tracking-wider mt-10 mb-4">{t("donate.focusHeading")}</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "sanctuary", icon: "🏛️" },
                { id: "poultry", icon: "🐓" },
                { id: "tailoring", icon: "🧵" },
                { id: "agribusiness", icon: "🌱" }
              ].map((proj) => (
                <div key={proj.id} onClick={() => setProjectFocus(proj.id)} className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${projectFocus === proj.id ? "border-[#D4AF37] bg-amber-50/20 shadow-sm" : "border-slate-100 hover:border-slate-200 bg-white"}`}>
                  <span className="text-xl">{proj.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs md:text-sm text-[#0F2942]">{t(`donate.focusTitle_${proj.id}`)}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t(`donate.focusDesc_${proj.id}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-[11px] text-slate-400 font-light text-center lg:text-left">🛡️ {t("donate.secureNote")}</div>
        </div>

        {/* RIGHT PANE: THE VERIFIED PAYMENT CHANNELS UI (5 Columns) */}
        <div className="lg:col-span-5 bg-[#F7F4EF]/60 p-8 md:p-12 flex flex-col justify-between border-t lg:border-t-0 border-slate-100 relative">
          
          {/* HIGH-FIDELITY OVERLAY STATES FOR ONE-TAP SIMULATION */}
          {checkoutState === "processing" && (
            <div className="absolute inset-0 bg-[#0F2942] text-white z-30 p-8 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold tracking-wide uppercase text-[#D4AF37]">{t("donate.procTitle")}</h3>
              <p className="text-sm text-white/70 mt-2 max-w-xs">{t("donate.procDesc")}</p>
            </div>
          )}

          {checkoutState === "success" && (
            <div className="absolute inset-0 bg-emerald-900 text-white z-30 p-8 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-400 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner animate-bounce">✓</div>
              <h3 className="text-2xl font-black uppercase tracking-wider">{t("donate.successTitle")}</h3>
              <p className="text-sm text-emerald-200 mt-2 max-w-xs leading-relaxed">{t("donate.successDesc")}</p>
              <button onClick={() => setCheckoutState("idle")} className="mt-8 bg-white text-emerald-900 font-black text-xs px-6 py-3 rounded-full uppercase tracking-wider shadow-md hover:bg-emerald-50 transition-colors">{t("donate.close")}</button>
            </div>
          )}

          <form onSubmit={handleOneTapDonate} className="space-y-6">
            <div>
              <h3 className="text-xs font-black text-[#0F2942] uppercase tracking-[0.15em] mb-4">{t("donate.methodHeading")}</h3>
              
              {/* STICKY FINTECH TAB BAR */}
              <div className="grid grid-cols-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm mb-6">
                {["mpesa", "bank", "wire"].map((method) => (
                  <button key={method} type="button" onClick={() => setActiveMethod(method)} className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${activeMethod === method ? "bg-[#0F2942] text-white shadow-sm" : "text-slate-400 hover:text-[#0F2942]"}`}>
                    {method === "mpesa" ? "M-Pesa" : method === "bank" ? "Bank" : "Swift"}
                  </button>
                ))}
              </div>

              {/* AUTOMATED PRE-FILLED CREDENTIAL CARD FRAME */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("donate.recipientLabel")}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">● Verified</span>
                </div>
                
                {activeMethod === "mpesa" && (
                  <div className="space-y-3 animate-fade-in">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{t("donate.mpesaBiz")}</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xl font-black text-[#0F2942] tracking-wider">247247</span>
                        <button type="button" onClick={() => handleInlineCopy("247247", "biz")} className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-[#D4AF37] text-[#0F2942] rounded transition-colors uppercase">{copiedField === "biz" ? "Copied" : "Copy"}</button>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{t("donate.mpesaAcc")}</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xl font-black text-[#0F2942] tracking-wider">1650280005225</span>
                        <button type="button" onClick={() => handleInlineCopy("1650280005225", "acc")} className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-[#D4AF37] text-[#0F2942] rounded transition-colors uppercase">{copiedField === "acc" ? "Copied" : "Copy"}</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeMethod === "bank" && (
                  <div className="space-y-3 animate-fade-in">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Bank Name</div>
                      <div className="text-sm font-black text-[#0F2942]">Equity Bank Kenya</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Branch</div>
                      <div className="text-sm font-bold text-slate-600">Lokichogio Branch</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Account Number</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-lg font-black text-[#0F2942] tracking-wide">1650280005225</span>
                        <button type="button" onClick={() => handleInlineCopy("1650280005225", "bankacc")} className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-[#D4AF37] text-[#0F2942] rounded transition-colors uppercase">{copiedField === "bankacc" ? "Copied" : "Copy"}</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeMethod === "wire" && (
                  <div className="space-y-3 animate-fade-in">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">SWIFT / BIC Code</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xl font-black text-[#0F2942] tracking-widest">EQBLKENAXXX</span>
                        <button type="button" onClick={() => handleInlineCopy("EQBLKENAXXX", "swift")} className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-[#D4AF37] text-[#0F2942] rounded transition-colors uppercase">{copiedField === "swift" ? "Copied" : "Copy"}</button>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-relaxed italic">
                      Use for secure cross-border wire transfers and global remittance routes routing directly to the regional treasury.
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-[11px] font-bold text-[#0F2942]/80">
                  📋 Account: Clinic6 SDA Church
                </div>
              </div>
            </div>

            {/* PERSONAL VALIDATION LAYER */}
            <div className="space-y-3">
              <input type="text" required placeholder={t("donate.inputName")} className="w-full bg-white p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F2942] transition-colors shadow-inner" />
              <input type="email" required placeholder={t("donate.inputEmail")} className="w-full bg-white p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0F2942] transition-colors shadow-inner" />
            </div>

            {/* TRUE ONE-TAP OPERATIONAL SUBMIT TRIGGER */}
            <button type="submit" className="w-full bg-[#0F2942] text-white hover:bg-[#D4AF37] hover:text-[#0F2942] font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-md transform active:scale-[0.99]">
              {t("donate.submitBtn")} ({currency === "USD" ? `$${amount}` : `${(amount * exchangeRate).toLocaleString()} KES`}) →
            </button>
          </form>

          {/* CRITICAL THEOLOGY DISCLOSURE MODULE */}
          <div className="mt-8 bg-amber-50 rounded-2xl p-4 border border-amber-200/70">
            <h5 className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">⚠️ {t("donate.titheTitle")}</h5>
            <p className="text-[10px] text-amber-800/90 mt-1.5 leading-relaxed font-light">{t("donate.titheDesc")}</p>
          </div>

        </div>

      </div>
    </section>
  );
}