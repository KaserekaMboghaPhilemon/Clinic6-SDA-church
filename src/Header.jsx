import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import logo from './assets/clinic6-construction-logo.jpg'
import { useT, LANGS } from './i18n.jsx'
import { smoothScrollToId } from './utils/smoothScroll.js'

/* =================================================================
   Header.jsx — Hybrid Navigation
   Props (all optional — falls back to LanguageContext when omitted):
     t            (key: string) => string
     currentLang  string  e.g. "en" | "fr" | "sw"
     setCurrentLang (code: string) => void
   - HOME / OUR STORY / MISSION → anchor links on the landing page
   - SEATING → /seating route
   - MEDIA   → /media route
   - DONATE / GIVE NOW → /give route
   ================================================================= */

const anchorKeys = [
  { key: 'nav.home',    id: 'home' },
  { key: 'nav.story',   id: 'story' },
  { key: 'nav.mission', id: 'impact' },
]

const routeKeys = [
  { key: 'nav.seating', to: '/seating' },
  { key: 'nav.media',   to: '/media' },
  { key: 'nav.contact', to: '/contact' },
  { key: 'nav.donate',  to: '/give' },
]

/* Language dropdown — shows active code as trigger, drops a menu of all options */
function LangDropdown({ currentLang, setCurrentLang }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const active = LANGS.find((l) => l.code === currentLang) ?? LANGS[0]

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[11px] font-bold tracking-widest uppercase text-white hover:bg-white/20 transition-colors"
      >
        {active.label}
        <svg
          className={'h-3 w-3 transition-transform duration-200 ' + (isOpen ? 'rotate-180' : '')}
          viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            aria-label="Select language"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-36 rounded-lg border border-white/15 bg-[#0F2942]/95 backdrop-blur-md shadow-xl overflow-hidden z-50"
          >
            {LANGS.map((l) => {
              const isActive = currentLang === l.code
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => { setCurrentLang(l.code); setIsOpen(false) }}
                    className={
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ' +
                      (isActive
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                        : 'text-white/80 hover:bg-white/10 hover:text-white')
                    }
                  >
                    <span className={'text-[11px] font-bold tracking-widest uppercase w-6 ' + (isActive ? 'text-[#D4AF37]' : 'text-white/50')}>
                      {l.label}
                    </span>
                    <span>{l.name}</span>
                    {isActive && (
                      <svg className="ml-auto h-3.5 w-3.5 text-[#D4AF37]" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Header({ t: tProp, currentLang: langProp, setCurrentLang: setLangProp }) {
  const ctx = useT()

  /* Resolve t / lang / setLang — props take priority over context */
  const t           = tProp      ?? ctx.t
  const currentLang = langProp   ?? ctx.lang
  const setCurrentLang = setLangProp ?? ctx.setLang

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Renders an anchor link that scrolls in-page when on "/",
     otherwise navigates back to "/" with the hash. */
  const AnchorLink = ({ id, label, className = '', onClick }) => {
    const handleClick = (e) => {
      if (onHome) {
        e.preventDefault()
        // Shared scroll utility keeps motion curve identical across devices.
        smoothScrollToId(id)
        if (onClick) onClick()
      } else if (onClick) {
        onClick()
      }
    }
    return onHome ? (
      <a href={`#${id}`} onClick={handleClick} className={className}>
        {label}
      </a>
    ) : (
      <Link to={`/#${id}`} onClick={onClick} className={className}>
        {label}
      </Link>
    )
  }

  /* Shared link class — whitespace-nowrap prevents "Our Story" wrapping */
  const linkCls =
    'relative py-2 whitespace-nowrap hover:text-[#D4AF37] transition-colors ' +
    'after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 ' +
    'after:bg-[#D4AF37] hover:after:w-full after:transition-all cursor-pointer'

  return (
    <header
      className={
        'sticky top-0 inset-x-0 z-50 transition-all duration-300 ' +
        (scrolled || !onHome
          ? 'bg-[#0F2942]/95 backdrop-blur-md border-b border-[#D4AF37]/40 shadow-2xl'
          : 'bg-[#0F2942]/20 backdrop-blur-sm border-b border-[#D4AF37]/20')
      }
    >
      {/* Header row uses wrapping so CTA stays visible on tight widths. */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-3 md:gap-4">

        {/* ── Branding (left) ── */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          {/* Render logo with contain + white base to keep marks and text crisp. */}
          <img
            src={logo}
            alt="Clinic 6 SDA Church logo"
            className="h-16 w-16 lg:h-20 lg:w-20 object-contain rounded-full bg-white p-1 ring-2 ring-[#D4AF37] shadow-lg"
          />
          <div className="hidden sm:flex flex-col justify-center leading-tight text-white">
            <p className="font-display font-bold text-base lg:text-lg tracking-wide drop-shadow whitespace-nowrap">
              SDA Church Clinic 6
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37]/90 whitespace-nowrap">
              {t('brand.location')}
            </p>
          </div>
        </Link>

        {/* ── Desktop nav (centre) ── */}
        {/* Desktop links use horizontal gap utility for adaptive spacing control. */}
        <nav className="hidden md:flex flex-row items-center justify-center gap-x-4 lg:gap-x-6 text-sm font-medium text-white/90">
          {anchorKeys.map((a) => (
            <AnchorLink
              key={a.id}
              id={a.id}
              label={t(a.key)}
              className={linkCls}
            />
          ))}
          {routeKeys.map((r) => (
            <NavLink
              key={r.to}
              to={r.to}
              className={({ isActive }) =>
                'relative py-2 whitespace-nowrap transition-colors ' +
                'after:absolute after:left-0 after:bottom-0 after:h-px after:bg-[#D4AF37] after:transition-all ' +
                (isActive
                  ? 'text-[#D4AF37] after:w-full'
                  : 'hover:text-[#D4AF37] after:w-0 hover:after:w-full')
              }
            >
              {t(r.key)}
            </NavLink>
          ))}
        </nav>

        {/* ── Give Now CTA + Language Switcher (right) ── */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:inline-flex">
            <LangDropdown currentLang={currentLang} setCurrentLang={setCurrentLang} />
          </div>
          {/* Keep primary CTA visible by preventing shrink under layout pressure. */}
          <Link
            to="/give"
            className="cta-give-pop ml-auto inline-flex items-center justify-center whitespace-nowrap bg-[#D4AF37] text-[#0F2942] font-bold px-3 sm:px-5 lg:px-6 py-2 sm:py-3 lg:py-3 rounded-sm hover:bg-yellow-400 active:bg-yellow-500 transition-colors text-[10px] sm:text-[11px] lg:text-xs uppercase tracking-widest shadow-md font-bold flex-shrink-0"
          >
            {t('nav.giveNow')} →
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-sm border border-white/30 text-white"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open
                ? <path d="M6 6l12 12M18 6L6 18" />
                : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="md:hidden bg-[#0F2942]/95 backdrop-blur-md border-t border-[#D4AF37]/20">
          <ul className="max-w-7xl mx-auto px-6 py-4 flex flex-col">
            {anchorKeys.map((a) => (
              <li key={a.id}>
                <AnchorLink
                  id={a.id}
                  label={t(a.key)}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-medium text-white/90 hover:text-[#D4AF37] border-b border-white/10 whitespace-nowrap"
                />
              </li>
            ))}
            {routeKeys.map((r) => (
              <li key={r.to}>
                <Link
                  to={r.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-medium text-white/90 hover:text-[#D4AF37] border-b border-white/10 whitespace-nowrap"
                >
                  {t(r.key)}
                </Link>
              </li>
            ))}
            <li className="pt-4 flex items-center justify-between gap-3">
              <Link
                to="/give"
                onClick={() => setOpen(false)}
                className="cta-give-pop inline-flex items-center whitespace-nowrap bg-[#D4AF37] text-[#0F2942] font-bold px-5 py-2.5 rounded-sm text-xs uppercase tracking-widest"
              >
                {t('nav.giveNow')} →
              </Link>
              <LangDropdown currentLang={currentLang} setCurrentLang={setCurrentLang} />
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
