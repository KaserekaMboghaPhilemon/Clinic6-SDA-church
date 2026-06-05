import React from 'react'
import { Link } from 'react-router-dom'
import heroImage from './assets/Clinic6 dream church (2).png'
import currentStateImage from './assets/church-affected1.jpeg'
import { MissionImpactSection } from './MissionImpact.jsx'
import { useT } from './i18n.jsx'

/* =================================================================
   LandingPage.jsx — Clinic Six (6) SDA Church
   Casavera / Dribbble inspired: transparent nav, bold hero
   typography with text-shadow, floating stats bar, mission section,
   project vision icon grid, sticky action bar, footer disclaimer.
   ================================================================= */

/* ----- Inline SVG icon set (no external deps) ----- */
const Icon = {
  School: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M6 10v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
      <path d="M22 8v6" />
    </svg>
  ),
  Health: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M12 9v6M9 12h6" />
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
  Megaphone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 11v2a2 2 0 0 0 2 2h2l7 4V5L7 9H5a2 2 0 0 0-2 2Z" />
      <path d="M17 8a5 5 0 0 1 0 8" />
    </svg>
  ),
}

/* ----- Hero Section with background image ----- */
function Hero() {
  const { t } = useT()
  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden text-white -mt-[88px] pt-[88px]">
      {/* Background image */}
      <img
        src={heroImage}
        alt="Clinic6 dream church rendering"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F2942]/85 via-[#0F2942]/55 to-[#0F2942]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.18),transparent_55%)]" />

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-40 pb-44 lg:pt-48 lg:pb-56">
        <p
          className="uppercase tracking-[0.32em] text-[11px] font-semibold text-[#D4AF37] mb-6"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.45)' }}
        >
          {t('hero.eyebrow')}
        </p>
        <h1
          className="font-display font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] max-w-5xl text-white"
          style={{ textShadow: '0 6px 28px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.4)' }}
        >
          {t('hero.headline')}
        </h1>
        <p
          className="mt-8 max-w-2xl text-lg lg:text-xl leading-relaxed text-white/90"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
        >
          {t('hero.sub')}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            to="/give"
            className="inline-flex items-center justify-center bg-[#D4AF37] text-[#0F2942] font-bold px-8 py-4 rounded-sm hover:bg-yellow-400 transition-colors uppercase tracking-widest text-sm shadow-xl"
          >
            {t('hero.cta.give')} →
          </Link>
          <a
            href="#story"
            className="inline-flex items-center justify-center border-2 border-white/80 text-white font-semibold px-8 py-4 rounded-sm hover:bg-white hover:text-[#0F2942] transition-colors uppercase tracking-widest text-sm backdrop-blur-sm"
          >
            {t('hero.cta.story')}
          </a>
        </div>
      </div>

      {/* Floating stats bar */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 lg:bottom-10 z-20 w-[94%] max-w-6xl">
        <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-white/60 rounded-sm grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#0F2942]/10">
          {[
            { value: '868', label: t('stats.members') },
            { value: '2013', label: t('stats.founded') },
            { value: '3', label: t('stats.daughterChurches') },
            { value: t('stats.approved'), label: t('stats.riftValleyField') },
          ].map((s, idx) => (
            <div key={idx} className="px-6 py-6 text-center">
              <p className="font-display font-black text-3xl lg:text-4xl text-[#0F2942]">{s.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#2D3142]/70 font-semibold">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----- Mission & Urgency Section ----- */
function MissionStory() {
  const { t } = useT()
  return (
    <section id="story" className="bg-[#F7F4EF] py-24 lg:py-28 pt-32 lg:pt-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-3 bg-[#D4AF37]/40 -z-10" />
            <img
              src={currentStateImage}
              alt={t('story.imageAlt')}
              className="w-full h-[460px] lg:h-[560px] object-cover shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 bg-[#0F2942] text-white text-[11px] font-mono uppercase tracking-widest px-3 py-2">
              {t('story.currentState')}
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#D4AF37] mb-5">
              {t('story.urgentNeed')}
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl leading-tight text-[#0F2942]">
              {t('story.headline')}
            </h2>
            <p className="mt-8 text-base lg:text-lg leading-relaxed text-[#2D3142]">
              {t('story.body1')} (<em>"udongo"</em>) {t('story.body2')} (<em>"algoropa"</em>), {t('story.body3')}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <div className="border-t-2 border-[#D4AF37] pt-4">
                <p className="font-display font-black text-2xl text-[#0F2942]">2013</p>
                <p className="text-[11px] uppercase tracking-widest text-[#2D3142]/70 mt-1">{t('story.foundedUnderTree')}</p>
              </div>
              <div className="border-t-2 border-[#D4AF37] pt-4">
                <p className="font-display font-black text-2xl text-[#0F2942]">4</p>
                <p className="text-[11px] uppercase tracking-widest text-[#2D3142]/70 mt-1">{t('story.foundingFamilies')}</p>
              </div>
              <div className="border-t-2 border-[#D4AF37] pt-4">
                <p className="font-display font-black text-2xl text-[#0F2942]">2026</p>
                <p className="text-[11px] uppercase tracking-widest text-[#2D3142]/70 mt-1">{t('story.stormDestroyed')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----- Project Vision Icon Grid ----- */
function ProjectVision() {
  const { t } = useT()
  const items = [
    {
      icon: <Icon.School className="h-8 w-8" />,
      title: t('vision.school.title'),
      copy: t('vision.school.copy'),
    },
    {
      icon: <Icon.Health className="h-8 w-8" />,
      title: t('vision.health.title'),
      copy: t('vision.health.copy'),
    },
    {
      icon: <Icon.Home className="h-8 w-8" />,
      title: t('vision.home.title'),
      copy: t('vision.home.copy'),
    },
    {
      icon: <Icon.Tools className="h-8 w-8" />,
      title: t('vision.vocational.title'),
      copy: t('vision.vocational.copy'),
    },
    {
      icon: <Icon.Megaphone className="h-8 w-8" />,
      title: t('vision.pa.title'),
      copy: t('vision.pa.copy'),
    },
  ]

  return (
    <section id="vision" className="bg-white py-24 lg:py-28 border-y border-[#0F2942]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="max-w-3xl mb-14">
          <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#D4AF37] mb-5">
            {t('vision.beyondSanctuary')}
          </p>
          <h2 className="font-display font-black text-4xl sm:text-5xl leading-tight text-[#0F2942]">
            {t('vision.fivePillars')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {items.map((it, idx) => (
            <article
              key={it.title}
              className={
                'group p-8 rounded-sm border border-[#0F2942]/10 hover:border-[#D4AF37] transition-colors bg-[#F7F4EF] flex flex-col gap-5 ' +
                (idx === 0 ? 'lg:col-span-1' : '')
              }
            >
              <div className="h-14 w-14 rounded-sm bg-[#0F2942] text-[#D4AF37] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-[#0F2942] transition-colors">
                {it.icon}
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-[#0F2942]">{it.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#2D3142]/85">{it.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----- Give CTA teaser (links to /give route) ----- */
function GiveCallout() {
  const { t } = useT()
  return (
    <section className="bg-[#0F2942] text-white py-24 lg:py-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 text-center">
        <p className="uppercase tracking-[0.32em] text-xs font-bold text-[#D4AF37] mb-5">
          {t('give.partnerWith')}
        </p>
        <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tight">
          {t('give.giftTurnsPrayer')}
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-white/85 leading-relaxed">
          {t('give.everyContribution')}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/give"
            className="inline-flex items-center bg-[#D4AF37] text-[#0F2942] font-bold px-8 py-4 rounded-sm hover:bg-yellow-400 transition-colors uppercase tracking-widest text-sm shadow-xl"
          >
            {t('give.viewChannels')} →
          </Link>
          <Link
            to="/seating"
            className="inline-flex items-center border-2 border-white/80 text-white font-semibold px-8 py-4 rounded-sm hover:bg-white hover:text-[#0F2942] transition-colors uppercase tracking-widest text-sm"
          >
            {t('give.sponsorSeat')}
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ----- Page Composition ----- */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <MissionStory />
      <MissionImpactSection />
      <ProjectVision />
      <GiveCallout />
    </>
  )
}
