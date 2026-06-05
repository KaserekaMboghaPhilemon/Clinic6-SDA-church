import React from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/image_e6151f.png'
import stormDamageImage from '../assets/2nd-storm-wornout-building.png'
import metalBuildImage from '../assets/assumed-for-work.png'

function SchoolIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z" />
      <path d="M7 11.5V16c0 .7 2.2 2 5 2s5-1.3 5-2v-4.5" />
    </svg>
  )
}

function HealthIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10.5 12 4l8 6.5V20H4v-9.5Z" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  )
}

function ToolsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14.5 6.5a4 4 0 0 0 3.8 5.2L12 18l-3-3 6.3-6.3a4 4 0 0 0-.8-2.2Z" />
      <path d="M5 19l2.5-2.5" />
      <path d="M19 5l-2 2" />
    </svg>
  )
}

function AudioIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 14h3l4 4V6L8 10H5v4Z" />
      <path d="M16 9a5 5 0 0 1 0 6" />
      <path d="M18.5 6.5a8.5 8.5 0 0 1 0 11" />
    </svg>
  )
}

function MealIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10.5h16" />
      <path d="M7 10.5V7.5a2.5 2.5 0 0 1 5 0v3" />
      <path d="M12 10.5V7" />
      <path d="M4.5 10.5l1.2 8.5h12.6l1.2-8.5" />
    </svg>
  )
}

const lineageMap = [
  { name: 'Clinic 6 Mother Church', location: 'Kakuma 3', members: 868 },
  { name: 'Kalobeyei Village 1', location: 'Kalobeyei', members: 400 },
  { name: 'Clinic 7', location: 'Kakuma', members: 250 },
  { name: 'Kalobeyei Village 3', location: 'Kalobeyei', members: 200 },
]

const pillars = [
  {
    title: 'Primary/Nursery School',
    icon: SchoolIcon,
    description:
      'Establishing an accredited learning environment that combines foundational academics, values formation, and child protection.',
  },
  {
    title: 'Health Facility',
    icon: HealthIcon,
    description:
      'Building a dependable care point for first-response treatment, preventive health services, and community wellness support.',
  },
  {
    title: 'Agape Home for Separated Children',
    icon: HomeIcon,
    description:
      'Providing structured shelter, pastoral care, and long-term belonging for children separated from their families.',
  },
  {
    title: 'Vocational Center',
    icon: ToolsIcon,
    description:
      'Delivering practical training in income-generating skills to strengthen dignity, employability, and household resilience.',
  },
  {
    title: 'Global Proclamation PA System',
    icon: AudioIcon,
    description:
      'Deploying robust audio infrastructure to extend worship, teaching, and coordinated communication across the mission field.',
  },
  {
    title: 'Good Samaritan Feeding Program',
    icon: MealIcon,
    description:
      'Ensuring that refugee members, who travel long distances from their homes, can remain nourished through our full-day Sabbath services, protecting them from returning to search for food in the harsh midday heat and wind.',
  },
]

const homeHighlights = [
  'Faith declaration: we receive, by faith, our permanent dream church building and steward its completion with prayer, excellence, and accountability.',
  'Current footprint: 868 active members at Clinic 6 and 1,718+ believers reached through our lineage.',
  'Expansion status: 3 daughter churches are active across Kalobeyei and Clinic 7.',
  'Emergency reality: recent storm damage weakened temporary structures and raised immediate safety risks.',
  'Rebuild plan: deploy heavy-duty metal poles and high-gauge iron for all-weather durability.',
  'Urgent ask: mobilize support now before the next severe rain-and-wind cycle.',
]

export default function Home() {
  return (
    <div className="bg-[#F3E7CF] text-[#2F3E1E]">
      <section id="home" className="relative min-h-[88vh] overflow-hidden">
        <img
          src={heroImage}
          alt="Clinic 6 Mother Church worship background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col items-center justify-center px-5 py-20 text-center lg:px-10">
          <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            From the Shade of a Tree to a Sanctuary of Hope.
          </h1>
          <p className="mt-5 max-w-3xl rounded-md border border-[#F5ECD9]/35 bg-black/25 px-4 py-3 text-sm font-semibold leading-relaxed text-[#F5ECD9]">
            By faith, we believe God has entrusted us with a permanent dream church building, and we are committed to building it
            with integrity, resilience, and service to every family we shepherd.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/give"
              className="inline-flex items-center justify-center rounded bg-[#556B2F] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#F5ECD9] transition hover:bg-[#445927]"
            >
              Partner With Our Mission
            </Link>
            <Link
              to="/our-story"
              className="text-xs font-bold uppercase tracking-[0.18em] text-white underline-offset-4 transition hover:underline"
            >
              Read Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#556B2F]/20 bg-[#F8F1E2] py-5">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-5 text-center sm:grid-cols-4 lg:px-10">
          <div>
            <p className="text-2xl font-black text-[#2F3E1E]">868</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#556B2F]">Members</p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#2F3E1E]">2013</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#556B2F]">Founded</p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#2F3E1E]">3</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#556B2F]">Daughter Churches</p>
          </div>
          <div>
            <p className="text-base font-black text-[#2F3E1E]">Approved</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#556B2F]">by Rift Valley Field</p>
          </div>
        </div>
      </section>

      <section className="bg-[#E1C699] py-10">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#556B2F]">Mission Snapshot</p>
          <h2 className="mt-3 text-3xl font-black text-[#1A2412] sm:text-4xl">Urgent Highlights</h2>
          <ul className="mt-6 grid list-disc gap-3 pl-5 text-sm leading-relaxed text-[#1A2412] sm:grid-cols-2 sm:gap-x-8">
            {homeHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="history" className="bg-[#F3E7CF] py-16">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-10">
          <h2 className="text-3xl font-black text-[#2F3E1E] sm:text-4xl">A Faith Refined by Fire and Rain.</h2>
          <p className="mt-5 max-w-4xl text-base leading-relaxed text-[#2F3E1E]/85">
            In 2013, four refugee families from Burundi and DRC began worshipping under a single tree in Kakuma 3. From mud
            seats ('udongo') and branch walls ('algoropa'), we grew. Last month, dangerous desert rains destroyed our temporary
            structure. We are now rising to build with heavy-duty metal poles and high-gauge iron—a durable sanctuary designed
            for the Turkana sun.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-[#556B2F]/20 bg-[#F8F1E2] shadow-sm">
              <img
                src={stormDamageImage}
                alt="2nd storm worn out building damage"
                className="aspect-[4/3] w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = stormDamageImage
                }}
              />
              <figcaption className="border-t border-[#556B2F]/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#2F3E1E]">
                STORM DAMAGE: 2ND-STORM-WORNOUT-BUILDING.AVIF CONTEXT
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-2xl border border-[#556B2F]/20 bg-[#F8F1E2] shadow-sm">
              <img
                src={metalBuildImage}
                alt="Welder and metal construction preparation"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="border-t border-[#556B2F]/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#2F3E1E]">
                TRANSITION TO DURABLE METAL-POLE CONSTRUCTION
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="infrastructure" className="bg-[#F8F1E2] py-16">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#556B2F]">Mission Footprint</p>
          <h3 className="mt-3 text-2xl font-black text-[#1A2412] sm:text-3xl">
            1,718+ Believers reached through the Clinic 6 lineage.
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lineageMap.map((church, index) => (
              <article
                key={church.name}
                className={
                  'rounded-2xl border p-5 shadow-sm ' +
                  (index === 0
                    ? 'border-[#556B2F]/35 bg-[#556B2F] text-[#F5ECD9] lg:col-span-2'
                    : 'border-[#556B2F]/20 bg-white text-[#1A2412]')
                }
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-75">
                  {index === 0 ? 'Mother Church' : 'Daughter Congregation'}
                </p>
                <h4 className="mt-2 text-lg font-black">{church.name}</h4>
                <p className="mt-1 text-sm opacity-85">{church.location}</p>
                <p className="mt-4 text-2xl font-black">{church.members} Members</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="bg-[#F3E7CF] py-16">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#556B2F]">Global Outreach Pillars</p>
          <h2 className="mt-3 text-3xl font-black text-[#1A2412] sm:text-4xl">Beyond the Sanctuary</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#1A2412]/85">
            Five pillars that extend the gospel into daily life.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon

              return (
                <article
                  key={pillar.title}
                  className="group flex h-full flex-col rounded-2xl border border-[#556B2F] bg-white p-6 text-[#1A2412] shadow-sm transition-all duration-300 ease-in-out will-change-transform hover:scale-[1.02] hover:shadow-xl hover:text-[#11190d] active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E1C699] text-[#556B2F] transition-colors duration-300 ease-in-out group-hover:text-[#445927]">
                    <Icon />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-[#1A2412] transition-colors duration-300 ease-in-out group-hover:text-[#11190d]">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#1A2412]/88 transition-colors duration-300 ease-in-out group-hover:text-[#11190d]">{pillar.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#556B2F]/25 bg-[#E1C699] py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#556B2F]">Administrative Hierarchy</p>
            <p className="mt-2 text-sm font-semibold text-[#1A2412]">SDA Lokichogio District · Kakuma Station · Rift Valley Field</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#556B2F]">Tangazo la Zaka</p>
            <p className="mt-1 text-sm font-medium text-[#1A2412]">
              Sadaka za hiari pekee. Zaka hurejeshwa kupitia njia rasmi za Field.
            </p>
          </div>
          <div className="rounded-lg border border-[#556B2F]/30 bg-[#F8F1E2] px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#556B2F]">Paybill Details</p>
            <p className="mt-1 text-sm font-black text-[#1A2412]">Paybill: 247247</p>
            <p className="text-sm font-black text-[#1A2412]">Acc: 1650280005225</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
