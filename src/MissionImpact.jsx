import React, { useState, useEffect, useMemo } from 'react'
import dreamChurch from './assets/Clinic6 dream church (2).png'

/* =================================================================
   MissionImpact.jsx — Clinic Six (6) SDA Church
   "Mother of Missions" lineage map + impact bento cards + future
   outreach grid + animated impact counter + sticky Paybill bar.
   ================================================================= */

/* ----- Inline SVG growth icon set ----- */
const Growth = {
  Seed: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 21c0-4 0-6 0-8" />
      <path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5Z" />
      <path d="M12 13c3 0 5-2 5-5-3 0-5 2-5 5Z" />
    </svg>
  ),
  Sapling: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 21V10" />
      <path d="M12 10c-4 0-6-2-6-6 4 0 6 2 6 6Z" />
      <path d="M12 12c3 0 5-1.5 5-4.5-3 0-5 1.5-5 4.5Z" />
    </svg>
  ),
  Tree: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22V14" />
      <path d="M7 14a5 5 0 1 1 10 0" />
      <path d="M5 11a7 7 0 0 1 14 0" />
      <path d="M9 22h6" />
    </svg>
  ),
  Forest: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 21v-4" />
      <path d="M18 21v-4" />
      <path d="M12 21v-5" />
      <path d="M3 17h6l-3-5-3 5Z" />
      <path d="M15 17h6l-3-5-3 5Z" />
      <path d="M9 16h6l-3-7-3 7Z" />
    </svg>
  ),
  Home: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </svg>
  ),
  Tools: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2.4-2.4 2.8-2.8Z" />
    </svg>
  ),
  Health: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  ),
}

/* ----- Animated count-up hook ----- */
function useCountUp(target, duration = 1600) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

/* ----- Section Header ----- */
function Header() {
  return (
    <header className="max-w-5xl mx-auto px-6 sm:px-10 text-center pt-24 lg:pt-28 pb-14">
      <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#D4AF37] mb-5">
        Living Legacy · Est. 2013
      </p>
      <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-[#0F2942] text-balance">
        The Mother of Missions: Our Living Legacy
      </h1>
      <p className="mt-6 text-base lg:text-lg leading-relaxed text-[#2D3142]/85 max-w-3xl mx-auto">
        In 13 years, God has transformed a shade-tree gathering into a movement
        that spans the entire Kakuma Refugee Camp.
      </p>
    </header>
  )
}

/* ----- Impact Counter ----- */
function ImpactCounter() {
  const congregations = useMemo(
    () => [
      { id: 'mother', label: 'Clinic 6 · The Mother', value: 868, stage: 'tree', icon: <Growth.Tree className="h-7 w-7" /> },
      { id: 'd1', label: 'Kalobeyei Village 1', value: 300, stage: 'sapling', icon: <Growth.Sapling className="h-7 w-7" /> },
      { id: 'd2', label: 'Clinic 7', value: 300, stage: 'sapling', icon: <Growth.Sapling className="h-7 w-7" /> },
      { id: 'gd', label: 'Kalobeyei Village 3', value: 250, stage: 'seed', icon: <Growth.Seed className="h-7 w-7" /> },
    ],
    []
  )

  const total = congregations.reduce((sum, c) => sum + c.value, 0) // 1718
  const animated = useCountUp(total, 1800)

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-10 -mt-2 mb-20">
      <div className="bg-[#0F2942] text-[#F7F4EF] rounded-sm shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Counter */}
          <div className="lg:col-span-5 p-10 lg:p-12 bg-gradient-to-br from-[#0F2942] to-[#1c3d5e]">
            <p className="uppercase tracking-[0.3em] text-[11px] font-bold text-[#D4AF37]">
              Mission Footprint Counter
            </p>
            <p className="mt-4 font-display font-black text-6xl lg:text-7xl text-[#D4AF37] leading-none">
              {animated.toLocaleString()}<span className="text-white">+</span>
            </p>
            <p className="mt-3 text-sm uppercase tracking-widest text-white/80">
              Believers reached through the Clinic 6 lineage
            </p>
            <div className="mt-8 inline-flex items-center gap-3 border border-[#D4AF37]/40 px-4 py-2 rounded-sm">
              <Growth.Forest className="h-5 w-5 text-[#D4AF37]" />
              <span className="text-[11px] uppercase tracking-widest">A growing forest of faith</span>
            </div>
          </div>

          {/* Lineage breakdown */}
          <div className="lg:col-span-7 p-6 lg:p-8 grid grid-cols-2 gap-3">
            {congregations.map((c) => (
              <div
                key={c.id}
                className="bg-white/5 border border-[#D4AF37]/20 p-5 rounded-sm hover:border-[#D4AF37]/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#D4AF37]">{c.icon}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">{c.stage}</span>
                </div>
                <p className="mt-3 font-display font-black text-2xl text-white">{c.value}+</p>
                <p className="text-[11px] uppercase tracking-widest text-white/70 mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----- Lineage Map / Impact Bento Cards ----- */
function LineageMap() {
  const cards = [
    {
      icon: <Growth.Tree className="h-9 w-9" />,
      tag: 'Mother',
      title: 'Clinic 6 · The Mother',
      stat: '868',
      statLabel: 'Members (493 Children)',
      copy: 'The engine of our district.',
      tone: 'navy',
      span: 'md:col-span-3',
    },
    {
      icon: <Growth.Sapling className="h-8 w-8" />,
      tag: 'Daughter',
      title: 'Kalobeyei Village 1',
      stat: '300+',
      statLabel: 'Members',
      copy: 'Established from our first Sabbath School.',
      tone: 'sand',
      span: 'md:col-span-3',
    },
    {
      icon: <Growth.Sapling className="h-8 w-8" />,
      tag: 'Daughter',
      title: 'Clinic 7',
      stat: '300+',
      statLabel: 'Members',
      copy: 'A thriving sanctuary born from our mission.',
      tone: 'sand',
      span: 'md:col-span-3',
    },
    {
      icon: <Growth.Seed className="h-8 w-8" />,
      tag: 'Grand-Daughter (from Village 1)',
      title: 'Kalobeyei Village 3',
      stat: '250+',
      statLabel: 'Members',
      copy: 'Proof that our mission multiplies itself.',
      tone: 'gold',
      span: 'md:col-span-3',
    },
  ]

  const toneClasses = {
    navy: 'bg-[#0F2942] text-[#F7F4EF] border-[#D4AF37]/40',
    sand: 'bg-white text-[#0F2942] border-[#0F2942]/15',
    gold: 'bg-[#D4AF37] text-[#0F2942] border-[#0F2942]/30',
  }

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-10 mb-24">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
        <div>
          <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#D4AF37] mb-3">
            Lineage Map
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#0F2942] leading-tight">
            Four congregations. One mother. One mission.
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#2D3142]/70 border border-[#0F2942]/15 px-3 py-2 rounded-sm self-start">
          <span className="h-2 w-2 bg-[#D4AF37]" />
          Bento · Growth Matrix
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5">
        {cards.map((c) => (
          <article
            key={c.title}
            className={
              'rounded-sm border p-7 lg:p-8 flex flex-col gap-5 shadow-editorial min-h-[230px] ' +
              c.span + ' ' + toneClasses[c.tone]
            }
          >
            <div className="flex items-center justify-between">
              <span className={c.tone === 'sand' ? 'text-[#D4AF37]' : 'text-current'}>{c.icon}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                {c.tag}
              </span>
            </div>
            <div>
              <p className="font-display font-black text-4xl lg:text-5xl leading-none">{c.stat}</p>
              <p className="text-[11px] uppercase tracking-widest mt-2 opacity-80">{c.statLabel}</p>
            </div>
            <div className="mt-auto">
              <h3 className="font-display font-bold text-lg leading-tight">{c.title}</h3>
              <p className="mt-1 text-sm opacity-85">{c.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ----- The Urgent Vision (Seats & Structure) ----- */
function UrgentVision() {
  return (
    <section className="bg-white border-y border-[#0F2942]/10 py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image */}
        <div className="relative order-2 lg:order-1">
          <div className="absolute -inset-3 bg-[#D4AF37]/40 -z-10" />
          <img
            src={dreamChurch}
            alt="Mother Church Headquarters — Clinic6 dream sanctuary"
            className="w-full h-[420px] lg:h-[520px] object-cover shadow-2xl"
          />
          <div className="absolute bottom-4 left-4 bg-[#0F2942] text-white text-[11px] font-mono uppercase tracking-widest px-3 py-2">
            Vision · Mother Church HQ
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#D4AF37] mb-4">
            The Urgent Vision
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#0F2942]">
            Seats and a structure worthy of a Mother Church.
          </h2>
          <p className="mt-8 text-base lg:text-lg leading-relaxed text-[#2D3142]">
            As the "Mother Church," our current lack of a roof and permanent
            seating limits our ability to train leaders and host camp-wide
            fellowships. Rebuilding Clinic 6 with metal poles, iron sheets, and
            850+ pews isn't just about us—it's about providing a headquarters
            for the entire mission network.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="border-t-2 border-[#D4AF37] pt-4">
              <p className="font-display font-black text-2xl text-[#0F2942]">850+</p>
              <p className="text-[11px] uppercase tracking-widest text-[#2D3142]/70 mt-1">Pews Needed</p>
            </div>
            <div className="border-t-2 border-[#D4AF37] pt-4">
              <p className="font-display font-black text-2xl text-[#0F2942]">Metal</p>
              <p className="text-[11px] uppercase tracking-widest text-[#2D3142]/70 mt-1">Pole Framing</p>
            </div>
            <div className="border-t-2 border-[#D4AF37] pt-4">
              <p className="font-display font-black text-2xl text-[#0F2942]">Iron</p>
              <p className="text-[11px] uppercase tracking-widest text-[#2D3142]/70 mt-1">Sheet Envelope</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----- Future Outreach Goals ----- */
function FutureGoals() {
  const goals = [
    {
      icon: <Growth.Home className="h-8 w-8" />,
      title: 'Agape Home',
      sub: 'Orphans of War',
      copy: 'A safe, Christ-centred refuge for children separated from their parents by conflict and displacement.',
    },
    {
      icon: <Growth.Tools className="h-8 w-8" />,
      title: 'Vocational Training',
      sub: 'Empowering 1,000+ Youth',
      copy: 'Hands-on trades, life skills and entrepreneurship programs to break cycles of dependency.',
    },
    {
      icon: <Growth.Health className="h-8 w-8" />,
      title: 'Health Facility & Schools',
      sub: 'Whole-person ministry',
      copy: 'On-site clinic, primary and nursery schooling — meeting bodies, minds and souls inside the camp.',
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24 lg:py-28">
      <div className="max-w-3xl mb-12">
        <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#D4AF37] mb-4">
          Future Outreach Goals
        </p>
        <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F2942] leading-tight">
          The next decade of multiplication.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {goals.map((g) => (
          <article
            key={g.title}
            className="group p-8 rounded-sm border border-[#0F2942]/10 hover:border-[#D4AF37] transition-colors bg-white flex flex-col gap-5"
          >
            <div className="h-14 w-14 rounded-sm bg-[#0F2942] text-[#D4AF37] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#0F2942] transition-colors">
              {g.icon}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold">{g.sub}</p>
              <h3 className="mt-1 font-display font-bold text-xl text-[#0F2942]">{g.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#2D3142]/85">{g.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ----- Sticky Action Bar ----- */
function StickyActionBar() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0F2942] text-white border-t-2 border-[#D4AF37] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-center sm:text-left">
          <span className="text-[#D4AF37] uppercase tracking-widest mr-2">Partner with Clinic6:</span>
          Paybill <span className="font-mono font-bold">247247</span>
          <span className="mx-2 text-white/40">|</span>
          Acc <span className="font-mono font-bold">1650280005225</span>
        </p>
        <a
          href="#give"
          className="inline-flex items-center bg-[#D4AF37] text-[#0F2942] font-bold px-5 py-2 rounded-sm hover:bg-yellow-400 transition-colors text-xs uppercase tracking-widest"
        >
          Give Now →
        </a>
      </div>
    </div>
  )
}

/* ----- Section-only export (for embedding inside LandingPage) ----- */
export function MissionImpactSection() {
  return (
    <section id="impact" className="bg-[#F7F4EF] text-[#2D3142]">
      <Header />
      <ImpactCounter />
      <LineageMap />
      <UrgentVision />
      <FutureGoals />
    </section>
  )
}

/* ----- Page Composition (standalone) ----- */
export default function MissionImpact() {
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2D3142] font-sans pb-24">
      <Header />
      <ImpactCounter />
      <LineageMap />
      <UrgentVision />
      <FutureGoals />
      <StickyActionBar />
    </div>
  )
}
