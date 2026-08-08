import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/clinic6-construction-logo.jpg";
import { useT } from "./i18n.jsx";

/* =================================================================
   Footer.jsx — Clinic Six (6) SDA Church
   Three-column layout: Brand · Hierarchy · Payment
   Bottom bar: Tithe disclosure
   ================================================================= */

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="bg-[#071827] text-[#F7F4EF] border-t border-[#0b3a57]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-1">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Clinic 6 SDA Church logo"
                className="h-16 w-16 object-contain rounded-lg bg-white p-1 ring-2 ring-[#D4AF37] shadow"
              />
              <div>
                <p className="font-display font-bold text-lg text-white leading-tight">
                  SDA Church Clinic 6
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37]/90 mt-1">
                  {t("brand.location")} · Kenya
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#F7F4EF]/75 leading-relaxed">
              A community-rooted church serving Kakuma — focused on worship,
              outreach, and sustainable projects. Join us in building lasting
              hope.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.2c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12H20l-.5 3h-2.3v7A10 10 0 0022 12z" fill="#F7F4EF" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" stroke="#F7F4EF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" stroke="#F7F4EF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17.5 6.5h.01" stroke="#F7F4EF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M22 8s-.2-1.4-.8-2c-.8-.9-1.7-.9-2.1-1C15.6 4 12 4 12 4h0s-3.6 0-6.9.9c-.4.1-1.3.1-2.1 1C2.2 6.6 2 8 2 8s-.2 1.7-.2 3.4v1.2C1.8 15 2 16.4 2 16.4s.2 1.4.8 2c.8.9 1.9.8 2.4.9C8.4 20 12 20 12 20s3.6 0 6.9-.9c.4-.1 1.3-.1 2.1-1 .6-.6.8-2 .8-2s.2-1.7.2-3.4v-1.2C22.2 9.7 22 8 22 8z" stroke="#F7F4EF" strokeWidth="0.3" />
                  <path d="M10 14.5l5-2.5-5-2.5v5z" fill="#F7F4EF" />
                </svg>
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-[#F7F4EF]/90">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/ourstory" className="hover:text-[#D4AF37] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#D4AF37] transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-[#D4AF37] transition-colors">
                  Give
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wide">
              Contact
            </h4>
            <div className="mt-4 text-sm text-[#F7F4EF]/90 space-y-2">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 10v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7" stroke="#F7F4EF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 10l5 3 5-3" stroke="#F7F4EF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <a href="mailto:clinic6.sda.kakuma@gmail.com" className="hover:text-[#D4AF37]">clinic6.sda.kakuma@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M22 16.92V21a1 1 0 0 1-1.11 1 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.63A1 1 0 0 1 3 2h4.09a1 1 0 0 1 1 .75c.12.55.33 1.36.6 2.27a1 1 0 0 1-.24 1l-1.2 1.2a15 15 0 0 0 6 6l1.2-1.2a1 1 0 0 1 1-.24c.9.27 1.72.49 2.27.6a1 1 0 0 1 .75 1V22z" stroke="#F7F4EF" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <a href="tel:+254700000000" className="hover:text-[#D4AF37]">+254 700 000 000</a>
              </div>
              <div className="mt-3">
                <h5 className="text-xs uppercase tracking-wider text-[#D4AF37]">Subscribe</h5>
                <form className="mt-2 flex items-center gap-2" onSubmit={(e)=>e.preventDefault()}>
                  <label htmlFor="footer-email" className="sr-only">Subscribe to newsletter</label>
                  <input id="footer-email" type="email" placeholder="Email address" required className="px-3 py-2 rounded-md bg-white/5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
                  <button type="submit" className="inline-flex items-center bg-[#D4AF37] text-[#072031] px-3 py-2 rounded-md text-sm font-semibold hover:bg-yellow-400 transition-colors">Subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#031826] border-t border-[#0b3a57]/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-[#F7F4EF]/70 text-center sm:text-left">
            <span className="uppercase tracking-widest font-bold text-[#D4AF37] mr-2">{t("footer.tithe.label")}</span>
            {t("footer.tithe.text")}
          </p>

          <div className="flex items-center gap-3">
            <Link to="/privacy" className="text-[#F7F4EF]/60 hover:text-[#D4AF37] transition-colors">Privacy</Link>
            <Link to="/terms" className="text-[#F7F4EF]/60 hover:text-[#D4AF37] transition-colors">Terms</Link>
            <span className="text-[#F7F4EF]/50">•</span>
            <p className="text-[#F7F4EF]/55 uppercase tracking-widest">{t("footer.copyright")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
