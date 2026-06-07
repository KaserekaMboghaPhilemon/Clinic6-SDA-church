import React from 'react'
import { Link } from 'react-router-dom'

/* StickyActionBar — fixed bottom Paybill strip, present on every route */
export default function StickyActionBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0F2942] text-white border-t-2 border-[#D4AF37] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-center sm:text-left">
          <span className="text-[#D4AF37] uppercase tracking-widest mr-2">Partner with Clinic6:</span>
          Paybill <span className="font-mono font-bold">247247</span>
          <span className="mx-2 text-white/40">|</span>
          Acc <span className="font-mono font-bold">1650280005225</span>
        </p>
        <Link
          to="/give"
          className="cta-give-pop inline-flex items-center bg-[#D4AF37] text-[#0F2942] font-bold px-5 py-2 rounded-sm hover:bg-yellow-400 transition-colors text-xs uppercase tracking-widest"
        >
          Give Now →
        </Link>
      </div>
    </div>
  )
}
