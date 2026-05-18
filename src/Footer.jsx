import React from 'react'
import logo from './assets/clinic6-construction-logo.jpg'

/* =================================================================
   Footer.jsx — Clinic Six (6) SDA Church
   Three-column layout: Brand · Hierarchy · Payment
   Bottom bar: Tithe disclosure
   ================================================================= */

export default function Footer() {
  return (
    <footer className="bg-[#0F2942] text-[#F7F4EF] border-t-2 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {/* Left — Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Clinic 6 SDA Church logo"
                className="h-20 w-20 object-cover rounded-full ring-2 ring-[#D4AF37] shadow-lg"
              />
              <div>
                <p className="font-display font-bold text-xl text-white leading-tight">
                  SDA Church Clinic 6
                </p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]/90 mt-1">
                  Kakuma · Turkana County · Kenya
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm text-[#F7F4EF]/75 leading-relaxed max-w-sm">
              A Seventh-day Adventist congregation born under a shade tree in
              2013, now a mother church to a growing mission family across the
              Kakuma Refugee Camp.
            </p>
          </div>

          {/* Center — Administrative Hierarchy */}
          <div>
            <p className="uppercase tracking-[0.25em] text-[11px] font-bold text-[#D4AF37]">
              Administrative Hierarchy
            </p>
            <ol className="mt-5 space-y-3 text-sm text-[#F7F4EF]/85">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                <div>
                  <p className="text-white font-semibold">SDA Lokichogio District</p>
                  <p className="text-[11px] uppercase tracking-widest text-[#F7F4EF]/55">Local Oversight</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                <div>
                  <p className="text-white font-semibold">Kakuma Station</p>
                  <p className="text-[11px] uppercase tracking-widest text-[#F7F4EF]/55">Field Station</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                <div>
                  <p className="text-white font-semibold">Rift Valley Field</p>
                  <p className="text-[11px] uppercase tracking-widest text-[#F7F4EF]/55">Conference / Audit</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Right — Payment Quick-Links */}
          <div>
            <p className="uppercase tracking-[0.25em] text-[11px] font-bold text-[#D4AF37]">
              Payment Quick-Links
            </p>
            <div className="mt-5 space-y-4">
              <div className="bg-white/5 border border-[#D4AF37]/30 rounded-sm p-4">
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]">M-Pesa Paybill</p>
                <p className="font-mono font-bold text-2xl text-white mt-1">247247</p>
              </div>
              <div className="bg-white/5 border border-[#D4AF37]/30 rounded-sm p-4">
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Account Number</p>
                <p className="font-mono font-bold text-2xl text-white mt-1">1650280005225</p>
              </div>
              <a
                href="#give"
                className="inline-flex items-center bg-[#D4AF37] text-[#0F2942] font-bold px-5 py-2.5 rounded-sm hover:bg-yellow-400 transition-colors text-xs uppercase tracking-widest"
              >
                Give Now →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — Tithe disclosure */}
      <div className="bg-[#0a1d31] border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-[#F7F4EF]/70 text-center sm:text-left">
            <span className="uppercase tracking-widest font-bold text-[#D4AF37] mr-2">
              Tithe Disclosure:
            </span>
            Freewill offerings only. Tithes are returned through official Field
            channels.
          </p>
          <p className="text-[#F7F4EF]/55 uppercase tracking-widest">
            © 2026 SDA Church Clinic 6 — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
