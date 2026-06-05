import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Our Mission', href: '#mission' },
  { label: 'Sanctuary & Infrastructure', href: '#infrastructure' },
  { label: 'Media', href: '#media' },
  { label: 'Donate', href: '#donate' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#EDE3CF] text-[#2B3A2F]">
      <header className="sticky top-0 z-50 border-b border-[#556B2F]/20 bg-[#EDE3CF]/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <a href="#home" className="text-sm font-black uppercase tracking-[0.2em] text-[#3F5B2A]">
            Mother Church
          </a>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-bold uppercase tracking-[0.16em] text-[#2B3A2F]/80 transition hover:text-[#3F5B2A]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-[#556B2F]/30 text-[#2B3A2F] md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="text-lg">{open ? 'x' : '='}</span>
          </button>
        </div>

        {open && (
          <div className="border-t border-[#556B2F]/20 bg-[#EDE3CF] px-5 py-3 md:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-xs font-bold uppercase tracking-[0.16em] text-[#2B3A2F]/90"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
