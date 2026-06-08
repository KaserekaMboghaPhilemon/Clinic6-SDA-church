import React from 'react'

/* =================================================================
   SeatingPage.jsx — Clinic Six (6) SDA Church
   Seat sponsorship tiers · embeddable section + standalone page
   ================================================================= */

const tiers = [
  {
    title: 'Individual Seat',
    price: '$25 / KES 3,250',
    desc: 'Provides one durable, metal-framed seat for a member of the congregation.',
    icon: '🪑',
  },
  {
    title: 'Family Row',
    price: '$150 / KES 19,500',
    desc: 'Sponsors a full row, ensuring a refugee family can worship together in comfort.',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    title: 'Sanctuary Block',
    price: '$500 / KES 65,000',
    desc: 'Provides an entire section of seating for 20+ worshippers.',
    icon: '🏛️',
  },
]

/* Section-only export (for embedding inside LandingPage) */
export function SeatingSection() {
  return (
    <section id="seating" className="bg-[#F7F4EF] py-20 lg:py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#D4AF37] mb-4">
          Sponsor a Seat
        </p>
        <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#0F2942] mb-4">
          A Seat at the Table of Grace
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-16">
          For years, our elders and children sat on mud-molded pews
          (<em>'udongo'</em>). As we build our new sanctuary of steel, help us
          provide dignity for 868 worshippers.
        </p>

        {/* Sponsorship grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-left"
            >
              <div className="text-4xl mb-4">{tier.icon}</div>
              <h3 className="text-xl font-bold text-[#0F2942] mb-2">{tier.title}</h3>
              <p className="text-[#D4AF37] font-bold text-lg mb-4">{tier.price}</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">{tier.desc}</p>
              <a
                href="#give"
                className="cta-donate-pop block text-center w-full bg-[#0F2942] text-white font-bold py-3 rounded-lg hover:bg-[#D4AF37] hover:text-[#0F2942] transition-colors"
              >
                Sponsor Now
              </a>
            </div>
          ))}
        </div>

        {/* Payment sticker */}
        <div className="mt-20 bg-white p-6 rounded-xl border-2 border-dashed border-[#D4AF37] inline-block">
          <p className="text-[#0F2942] font-bold">
            How to Give: Paybill <span className="text-[#D4AF37]">247247</span>{' '}
            | Acc <span className="text-[#D4AF37]">1650280005225</span>
          </p>
          <p className="text-xs text-slate-400 mt-2 italic">
            Please use "SEATS" as your transaction reference.
          </p>
        </div>
      </div>
    </section>
  )
}

/* Standalone page (default export) */
export default function SeatingPage() {
  return (
    <div className="min-h-screen">
      <SeatingSection />
    </div>
  )
}
