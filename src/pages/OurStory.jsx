import React from 'react'
import { Link } from 'react-router-dom'
import genesisImage from '../assets/dream-church1.png'
import stormDamageImage from '../assets/2nd-storm-wornout-building.png'
import lineageVisual from '../assets/image_e6151f.png'

const lineageMap = [
  { name: 'Clinic 6 Mother Church', location: 'Kakuma 3', members: 868, type: 'Mother Church' },
  { name: 'Kalobeyei Village 1', location: 'Kalobeyei', members: 400, type: 'Daughter Church' },
  { name: 'Clinic 7', location: 'Kakuma', members: 250, type: 'Daughter Church' },
  { name: 'Kalobeyei Village 3', location: 'Kalobeyei', members: 200, type: 'Daughter Church' },
]

export default function OurStory() {
  return (
    <main className="bg-[#E1C699] text-[#1D2713]">
      <section className="relative overflow-hidden border-b border-[#556B2F]/20">
        <img
          src={genesisImage}
          alt="Original worship site under the tree in Kakuma 3"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1D2713]/55" />

        <div className="relative mx-auto w-full max-w-5xl px-5 py-20 lg:px-10 lg:py-24">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E1C699]">Hadithi Yetu</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Hadithi Yetu: A Legacy of Resilience
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
            From a lone acacia tree in Kakuma 3 to a growing network of hope, this is the story of how faith became a home,
            a mission, and a future worth building.
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-16">
        <div className="mx-auto w-full max-w-4xl px-5 lg:px-10">
          <div className="space-y-12 text-base leading-8 text-[#1D2713]/92 sm:text-lg">
            <section id="genesis" className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#556B2F]">1. The Genesis</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-[#1D2713] sm:text-4xl">
                  From the Shade of a Tree (2013)
                </h2>
              </div>
              <p>
                In 2013, amidst the vast, challenging terrain of Kakuma 3, a small group of four refugee families, each
                seeking a refuge of their own from the conflicts in Burundi and the DRC, found a singular point of unity under
                a lone acacia tree. This was our first sanctuary.
              </p>
              <p>
                We lacked walls and ceilings, but we held a shared, unbreakable hope. We replaced the open sky with udongo
                (mud) and algoropa (branch) walls, building our first place of fellowship with the limited materials our hands
                could gather. This humble beginning defined us: we are a people who do not wait for comfort to begin our work;
                we plant our roots where we are and build in faith.
              </p>
            </section>

            <section id="mother-church" className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#556B2F]">2. The Philosophy</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-[#1D2713] sm:text-4xl">
                  The Mother Church
                </h2>
              </div>
              <p>
                We believe that faith is not meant to be contained; it is meant to ripple outward. As we grew, Clinic 6 became
                more than a building. It became an engine for mission.
              </p>
              <p>
                We adopted a Mother Church philosophy, recognizing that our role is to nurture and plant daughter
                congregations. By supporting our work, you are not just sustaining one location; you are providing the
                spiritual and administrative resources that allow Clinic 7, Kalobeyei Village 1, and Kalobeyei Village 3 to
                thrive. We empower local leaders, share resources, and provide the infrastructure for these daughter churches
                to serve their own communities, creating a resilient, interconnected network of hope across the region.
              </p>
            </section>

            <figure className="overflow-hidden rounded-2xl border border-[#556B2F]/20 bg-[#F8F1E2] shadow-sm">
              <img src={lineageVisual} alt="Lineage map showing the reach of the Clinic 6 mission" className="h-64 w-full object-cover sm:h-72" loading="lazy" decoding="async" />
              <figcaption className="border-t border-[#556B2F]/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#32461B]">
                Lineage Map: A Growing Network Of Hope
              </figcaption>
            </figure>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {lineageMap.map((item) => (
                <article key={item.name} className="rounded-xl border border-[#556B2F]/20 bg-[#F8F1E2] p-4 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#556B2F]">{item.type}</p>
                  <h3 className="mt-1 text-lg font-black text-[#1D2713]">{item.name}</h3>
                  <p className="text-sm text-[#1D2713]/80">{item.location}</p>
                  <p className="mt-3 text-base font-black text-[#1D2713]">{item.members} Members</p>
                </article>
              ))}
            </div>

            <section id="storm" className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#556B2F]">3. Faith Through The Storm</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-[#1D2713] sm:text-4xl">
                  When Resilience Becomes A Decision
                </h2>
              </div>
              <p>
                The resilience of our people has been tested time and again. Last month, as violent desert rains tore through
                our temporary structures, the wind and water threatened to erase years of our labor. But for us, this was not
                a defeat; it was a call to elevate our standards.
              </p>
              <p>
                We are currently transitioning to a permanent sanctuary built with heavy-duty metal poles and high-gauge iron.
                This is our declaration: the Turkana sun and the unpredictable storms will no longer dictate our ability to
                worship. We are building a permanent home, designed to stand firm for decades, ensuring that our children and
                our community always have a safe, dignified place to gather.
              </p>
              <figure className="overflow-hidden rounded-2xl border border-[#556B2F]/20 bg-[#F8F1E2] shadow-sm">
                <img src={stormDamageImage} alt="Storm damage to temporary church structure" className="h-64 w-full object-cover sm:h-72" loading="lazy" decoding="async" />
              </figure>
            </section>

            <section id="vision" className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#556B2F]">4. Vision</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-[#1D2713] sm:text-4xl">
                  The Future We Are Building
                </h2>
              </div>
              <p>
                Our story is currently at a turning point. Within the next five years, we envision Clinic 6 not just as a
                place of worship, but as a holistic hub of transformation. We are building toward a future where our nursery
                school is fully accredited, our health facility provides daily preventive care, and our Agape Home stands as a
                fortress for the vulnerable children in our care.
              </p>
              <p>
                We are planting the seeds of income-generating skills through our Vocational Center and extending our reach
                through modern audio infrastructure. We are not just building a church; we are building a foundation for a
                resilient community.
              </p>
            </section>

            <div className="rounded-2xl border border-[#556B2F]/20 bg-[#F8F1E2] px-6 py-8 text-center shadow-sm">
              <p className="text-sm font-medium leading-7 text-[#1D2713]/90">
                The next chapter of this story depends on partners who believe that dignity, worship, and community resilience
                belong together.
              </p>
              <Link
                to="/give"
                className="cta-donate-pop mt-6 inline-flex items-center justify-center rounded bg-[#556B2F] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#F5ECD9] transition hover:bg-[#445927]"
              >
                Partner With Our Mission
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
