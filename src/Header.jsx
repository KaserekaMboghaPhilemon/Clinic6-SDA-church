import React, { useEffect, useState } from 'react'
import logo from './assets/clinic6-construction-logo.jpg'

/* =================================================================
   Header.jsx — Clinic Six (6) SDA Church
   Casavera-style transparent nav with sticky backdrop-blur on scroll
   ================================================================= */

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Our Story', href: '#story' },
  { label: 'Mission Impact', href: '#impact' },
  { label: 'Seating', href: '#seating' },
  { label: 'Donate', href: '#give' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={
        'sticky top-0 inset-x-0 z-50 transition-all duration-300 ' +
        (scrolled
          ? 'bg-[#0F2942]/85 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-lg'
          : 'bg-transparent backdrop-blur-0 border-b border-transparent')
      }
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between gap-6">
        {/* Logo (far left) */}
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <img
            src={logo}
            alt="Clinic 6 SDA Church logo"
            className="h-16 w-16 lg:h-20 lg:w-20 object-cover rounded-full ring-2 ring-[#D4AF37] shadow-lg"
          />
          <div className="hidden sm:block leading-tight text-white">
            <p className="font-display font-bold text-base lg:text-lg tracking-wide drop-shadow">
              SDA Church Clinic 6
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37]/90">
              Kakuma · Turkana County
            </p>
          </div>
        </a>

        {/* Desktop nav (center) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative py-2 hover:text-[#D4AF37] transition-colors after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-[#D4AF37] hover:after:w-full after:transition-all"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Give Now (far right) */}
        <div className="flex items-center gap-3">
          <a
            href="#give"
            className="hidden sm:inline-flex items-center bg-[#D4AF37] text-[#0F2942] font-bold px-5 py-2.5 rounded-sm hover:bg-yellow-400 transition-colors text-xs uppercase tracking-widest shadow-md"
          >
            Give Now →
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-sm border border-white/30 text-white"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0F2942]/95 backdrop-blur-md border-t border-[#D4AF37]/20">
          <ul className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-medium text-white/90 hover:text-[#D4AF37] border-b border-white/10"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <a
                href="#give"
                onClick={() => setOpen(false)}
                className="inline-flex items-center bg-[#D4AF37] text-[#0F2942] font-bold px-5 py-2.5 rounded-sm text-xs uppercase tracking-widest"
              >
                Give Now →
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
