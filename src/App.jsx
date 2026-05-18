import React, { useState } from 'react'
import './App.css'

/* ==============================================================
   SDA Church Clinic Six (6) — Sanctuary Fundraising · Single Page
   Theme: Warm Minimalist · Editorial · Dribbble-inspired layout
   ============================================================== */

/* ----------------------------------------------------------------
   SECTION A — Sticky Top Verification Header
   ---------------------------------------------------------------- */
function VerificationHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-sda-navy text-sda-sand border-b-2 border-sda-gold/60 shadow-editorial">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left badge */}
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sda-gold shadow-[0_0_0_4px_rgba(212,175,55,0.18)] animate-pulse" />
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold">
            <span className="text-sda-gold">Verified Project</span>
            <span className="mx-2 text-sda-sand/40">|</span>
            <span>SDA Lokichogio District • Kakuma Station • Rift Valley Field</span>
          </p>
        </div>

        {/* Right sticky payment strip */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="inline-flex items-center gap-2 bg-sda-sand/10 border border-sda-gold/30 px-3 py-1.5 rounded-sm">
            <span className="uppercase tracking-widest text-[10px] text-sda-gold/90">PAYBILL</span>
            <span className="font-bold">247247</span>
          </span>
          <span className="inline-flex items-center gap-2 bg-sda-sand/10 border border-sda-gold/30 px-3 py-1.5 rounded-sm">
            <span className="uppercase tracking-widest text-[10px] text-sda-gold/90">ACC NO</span>
            <span className="font-bold">1650280005225</span>
          </span>
          <a
            href="#giving"
            className="hidden sm:inline-flex items-center bg-sda-gold text-sda-navy font-bold px-4 py-2 rounded-sm hover:bg-yellow-400 transition-colors text-xs uppercase tracking-wider"
          >
            Give →
          </a>
        </div>
      </div>
    </header>
  )
}

/* ----------------------------------------------------------------
   SECTION B — Hero Landing (Fintech split-screen, architecture bold typography)
   ---------------------------------------------------------------- */
function Hero() {
  return (
    <section className="relative bg-sda-sand">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[88vh]">
        {/* Left — Editorial Copy (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 py-20 lg:py-28">
          <p className="text-sda-gold uppercase tracking-[0.32em] text-xs font-bold mb-6">
            Kakuma · Turkana County · Kenya
          </p>
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-sda-navy text-balance">
            Building a Sanctuary of Hope in the Heart of{' '}
            <span className="text-sda-gold italic">Kakuma.</span>
          </h1>
          <p className="mt-8 text-lg lg:text-xl leading-relaxed text-sda-charcoal max-w-2xl">
            A Global Partnership to Construct a Permanent House of Worship for
            SDA Church Clinic Six—Rooted in Resilience, Driven by Faith.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#giving"
              className="inline-flex items-center justify-center gap-2 bg-sda-navy text-sda-sand font-semibold px-8 py-4 rounded-sm hover:bg-sda-gold hover:text-sda-navy transition-colors uppercase tracking-wider text-sm shadow-editorial"
            >
              Partner with Our Mission →
            </a>
            <a
              href="#blueprints"
              className="inline-flex items-center justify-center gap-2 border-2 border-sda-navy text-sda-navy font-semibold px-8 py-4 rounded-sm hover:bg-sda-navy hover:text-sda-sand transition-colors uppercase tracking-wider text-sm"
            >
              View Structural Plans
            </a>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-sda-charcoal/60">
            <span>Est. SDA Lokichogio District</span>
            <span className="h-1 w-1 rounded-full bg-sda-gold" />
            <span>Rift Valley Field Audited</span>
            <span className="h-1 w-1 rounded-full bg-sda-gold" />
            <span>East-Central Africa Division</span>
          </div>
        </div>

        {/* Right — Dark Visual Block (5 cols) */}
        <div className="lg:col-span-5 relative bg-sda-navy overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(212,175,55,0.5) 0 2px, transparent 2px 24px), repeating-linear-gradient(0deg, rgba(212,175,55,0.2) 0 1px, transparent 1px 44px)',
            }}
          />
          <div className="relative z-10 h-full flex flex-col justify-between p-10 lg:p-14 text-sda-sand">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-sda-gold">
                BUILD STATUS / 2026
              </span>
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-sda-gold animate-pulse" />
                Active Campaign
              </span>
            </div>

            <div className="border-l-4 border-sda-gold pl-6">
              <p className="font-display text-3xl lg:text-4xl font-bold leading-tight">
                "And let them make me a sanctuary; that I may dwell among them."
              </p>
              <p className="mt-4 text-sm uppercase tracking-widest text-sda-gold">
                — Exodus 25:8
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-sda-gold/30 pt-8">
              <div>
                <p className="font-display text-4xl font-black text-sda-gold">99.8%</p>
                <p className="text-[11px] uppercase tracking-wider mt-1 text-sda-sand/80">
                  Refugee Members
                </p>
              </div>
              <div>
                <p className="font-display text-4xl font-black text-sda-gold">100%</p>
                <p className="text-[11px] uppercase tracking-wider mt-1 text-sda-sand/80">
                  Volunteer Built
                </p>
              </div>
              <div>
                <p className="font-display text-4xl font-black text-sda-gold">1</p>
                <p className="text-[11px] uppercase tracking-wider mt-1 text-sda-sand/80">
                  Sanctuary Vision
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   SECTION C — "Why Us" Editorial Narrative
   ---------------------------------------------------------------- */
function WhyUs() {
  return (
    <section className="bg-sda-sand py-24 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="text-sda-gold uppercase tracking-[0.3em] text-xs font-bold mb-6">
              The Congregation
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl leading-tight text-sda-navy text-balance">
              99.8% Refined by Faith: A Living Mosaic of the Global Church
            </h2>
            <div className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-widest text-sda-charcoal/70 border border-sda-navy/15 bg-white px-4 py-2 rounded-sm">
              <span className="h-2 w-2 rounded-full bg-sda-gold" />
              Documentary · Editorial Storytelling
            </div>
          </div>

          <div className="lg:col-span-7 space-y-7 text-sda-charcoal text-base lg:text-lg leading-relaxed">
            <p>
              Within the borders of Turkana County, Kenya, a vibrant community
              of faith lives and works. Composed of 99.8% displaced persons from
              multiple African nations alongside our local Turkana hosts (0.2%),
              SDA Church Clinic Six stands as a monument to enduring faith. For
              years, we have gathered under temporary shelters, braving intense
              desert heat and seasonal dust storms to praise God.
            </p>
            <p>
              Today, we are rising to build a permanent, dignified sanctuary.
              Guided by pragmatic stewardship, our architectural design utilizes
              heavy-duty metal pole framing wrapped with high-gauge iron sheets
              for both walls and roofing. This intentional material choice
              provides immediate structural integrity, optimal ventilation for
              the hot desert climate, and maximum financial efficiency.
            </p>
            <p>
              We do not view ourselves as recipients of charity, but as active,
              faithful partners in the gospel commission. Out of our limited
              earthly resources, we have dedicated our hands, our prayers, and
              our means to prepare the ground. By partnering with us, you are
              investing in a mature, deeply dedicated missionary outpost that
              serves as a beacon of hope and spiritual restoration inside one of
              the world's largest refugee complexes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   SECTION D — Materials Blueprint Matrix (Bento Grid)
   ---------------------------------------------------------------- */
function BlueprintMatrix() {
  return (
    <section id="blueprints" className="bg-white py-24 lg:py-28 border-y border-sda-navy/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-sda-gold uppercase tracking-[0.3em] text-xs font-bold mb-4">
              Technical Specifications
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl leading-tight text-sda-navy text-balance">
              Engineered for Resilience: Materials Blueprint Matrix
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-sda-charcoal/70 border border-sda-navy/15 px-3 py-2 rounded-sm self-start">
            <span className="h-2 w-2 bg-sda-gold" />
            Construction Bento · v1.0
          </span>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-5">
          {/* Item 1 — Structural Frame (large) */}
          <article className="md:col-span-3 bg-sda-navy text-sda-sand p-8 lg:p-10 rounded-sm shadow-editorial flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-widest text-sda-gold">01 / FRAME</span>
              <span className="h-px w-12 bg-sda-gold/50" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-sda-sand/60">Structural Frame ➔</p>
              <h3 className="mt-2 font-display font-bold text-2xl lg:text-3xl">
                Heavy-Duty Galvanized Metal Poles
              </h3>
            </div>
          </article>

          {/* Item 2 — Wall Enclosure */}
          <article className="md:col-span-3 bg-sda-sand text-sda-navy border border-sda-navy/10 p-8 lg:p-10 rounded-sm shadow-editorial flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-widest text-sda-gold">02 / WALLS</span>
              <span className="h-px w-12 bg-sda-navy/30" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-sda-charcoal/60">Wall Enclosure ➔</p>
              <h3 className="mt-2 font-display font-bold text-2xl lg:text-3xl">
                High-Gauge Weather-Sealed Iron Sheets
              </h3>
            </div>
          </article>

          {/* Item 3 — Roofing */}
          <article className="md:col-span-2 bg-sda-gold text-sda-navy p-8 rounded-sm shadow-editorial flex flex-col justify-between min-h-[200px]">
            <span className="font-mono text-[11px] tracking-widest text-sda-navy/70">03 / ROOF</span>
            <div>
              <p className="text-xs uppercase tracking-widest text-sda-navy/70">Roofing Matrix ➔</p>
              <h3 className="mt-2 font-display font-bold text-xl lg:text-2xl">
                Reinforced Iron Corrugation (Heat Reflector)
              </h3>
            </div>
          </article>

          {/* Item 4 — Governance */}
          <article className="md:col-span-2 bg-white text-sda-navy border border-sda-navy/15 p-8 rounded-sm shadow-editorial flex flex-col justify-between min-h-[200px]">
            <span className="font-mono text-[11px] tracking-widest text-sda-gold">04 / AUDIT</span>
            <div>
              <p className="text-xs uppercase tracking-widest text-sda-charcoal/60">Project Governance ➔</p>
              <h3 className="mt-2 font-display font-bold text-xl lg:text-2xl">
                Rift Valley Field Audited & Approved
              </h3>
            </div>
          </article>

          {/* Item 5 — Narrative (wide bottom) */}
          <article className="md:col-span-2 bg-sda-charcoal text-sda-sand p-8 rounded-sm shadow-editorial flex flex-col justify-between min-h-[200px]">
            <span className="font-mono text-[11px] tracking-widest text-sda-gold">05 / CLIMATE</span>
            <div>
              <p className="text-xs uppercase tracking-widest text-sda-sand/60">Environmental Tuning ➔</p>
              <h3 className="mt-2 font-display font-bold text-xl lg:text-2xl">
                Engineered for the Turkana Wind & Sun
              </h3>
            </div>
          </article>
        </div>

        {/* Pragmatic architecture paragraph */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <p className="lg:col-start-2 lg:col-span-10 text-base lg:text-lg leading-relaxed text-sda-charcoal border-l-4 border-sda-gold pl-6">
            Building a permanent house of worship in Kakuma requires engineering
            that balances environmental realities with strict financial
            transparency. By utilizing a structural matrix of industrial metal
            poles, the building achieves superior wind-resistance. The
            high-gauge iron sheet wrapping for both walls and the roof is
            engineered with elevated clearance zones to facilitate continuous
            airflow, repelling intense solar radiation while providing a
            reliable shield against severe seasonal weather.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   SECTION E — Dynamic Global Giving Gateway (Tabbed)
   SECTION F — Tithe Boundary Protection (rendered inside)
   ---------------------------------------------------------------- */
function GivingGateway() {
  const [tab, setTab] = useState('mpesa')

  const tabs = [
    { id: 'mpesa', label: 'M-PESA (East Africa)' },
    { id: 'bank', label: 'Regional Bank Transfer' },
    { id: 'wire', label: 'Global Wire / Remittance' },
  ]

  return (
    <section id="giving" className="bg-sda-navy py-24 lg:py-28 text-sda-sand">
      <div className="max-w-5xl mx-auto px-6 sm:px-12">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="text-sda-gold uppercase tracking-[0.3em] text-xs font-bold mb-4">
            Partner With Us
          </p>
          <h2 className="font-display font-black text-4xl sm:text-5xl leading-tight text-balance">
            Flexible International Contribution Channels
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-sda-sand/80 leading-relaxed">
            Select your preferred payment method below to view direct transfer
            coordinates.
          </p>
        </div>

        {/* Persistent sticky info banner */}
        <div className="sticky top-[68px] z-30 mb-6 bg-sda-charcoal border border-sda-gold/30 rounded-sm px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono shadow-editorial">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sda-gold animate-pulse" />
            <span className="uppercase tracking-widest text-sda-gold">Verified Recipient</span>
            <span className="text-sda-sand/80">Clinic6 SDA church</span>
          </span>
          <span className="text-sda-sand/80">
            PAYBILL <strong className="text-sda-gold">247247</strong>
            <span className="mx-2 text-sda-sand/40">·</span>
            ACC NO <strong className="text-sda-gold">1650280005225</strong>
          </span>
        </div>

        {/* Tab strip */}
        <div role="tablist" className="flex flex-col sm:flex-row gap-1 sm:gap-0 border-b border-sda-gold/30">
          {tabs.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={
                  'flex-1 px-6 py-4 text-sm font-semibold uppercase tracking-widest transition-all ' +
                  (active
                    ? 'bg-sda-gold text-sda-navy'
                    : 'bg-sda-navy text-sda-sand/70 hover:text-sda-gold border border-sda-gold/20')
                }
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Tab panels */}
        <div className="bg-sda-sand text-sda-navy p-8 sm:p-12 shadow-editorial">
          {tab === 'mpesa' && (
            <div role="tabpanel">
              <p className="font-mono text-xs text-sda-gold tracking-widest mb-2">
                CHANNEL · M-PESA (EAST AFRICA)
              </p>
              <h3 className="font-display font-bold text-3xl mb-3">Mobile Money Paybill</h3>
              <p className="text-sm text-sda-charcoal mb-8 max-w-xl leading-relaxed">
                Optimized for mobile network operators across Kenya and East
                Africa.
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm">
                <div>
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">
                    Business Number (Paybill)
                  </dt>
                  <dd className="font-mono font-bold text-2xl mt-1">247247</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">
                    Account Number
                  </dt>
                  <dd className="font-mono font-bold text-2xl mt-1">1650280005225</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">
                    Account Name
                  </dt>
                  <dd className="font-semibold text-lg mt-1">Clinic6 SDA church</dd>
                </div>
              </dl>
            </div>
          )}

          {tab === 'bank' && (
            <div role="tabpanel">
              <p className="font-mono text-xs text-sda-gold tracking-widest mb-2">
                CHANNEL · REGIONAL BANK TRANSFER
              </p>
              <h3 className="font-display font-bold text-3xl mb-3">Direct Bank Transfer</h3>
              <p className="text-sm text-sda-charcoal mb-8 max-w-xl leading-relaxed">
                Direct transfers via commercial banks within the East African
                Community (EAC).
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm">
                <div>
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">Bank Name</dt>
                  <dd className="font-semibold text-lg mt-1">Equity Bank Kenya</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">
                    Branch Network
                  </dt>
                  <dd className="font-semibold text-lg mt-1">Lokichogio Branch</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">
                    Account Number
                  </dt>
                  <dd className="font-mono font-bold text-2xl mt-1">1650280005225</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">
                    Account Name
                  </dt>
                  <dd className="font-semibold text-lg mt-1">Clinic6 SDA church</dd>
                </div>
              </dl>
            </div>
          )}

          {tab === 'wire' && (
            <div role="tabpanel">
              <p className="font-mono text-xs text-sda-gold tracking-widest mb-2">
                CHANNEL · GLOBAL WIRE / REMITTANCE
              </p>
              <h3 className="font-display font-bold text-3xl mb-3">International SWIFT</h3>
              <p className="text-sm text-sda-charcoal mb-8 max-w-xl leading-relaxed">
                For global donors utilizing remittance agencies or international
                wire platforms.
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10 text-sm">
                <div>
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">
                    Intermediary System
                  </dt>
                  <dd className="font-semibold text-lg mt-1">Equity Direct / Swift Remit</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">Swift Code</dt>
                  <dd className="font-mono font-bold text-2xl mt-1">EQBLKENAXXX</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">
                    Account Number
                  </dt>
                  <dd className="font-mono font-bold text-2xl mt-1">1650280005225</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest text-xs text-sda-charcoal/60">
                    Recipient Entity
                  </dt>
                  <dd className="font-semibold text-lg mt-1">Clinic6 SDA church</dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        {/* SECTION F — Tithe Boundary Protection Card */}
        <div
          role="alert"
          className="mt-10 border-2 border-sda-gold bg-sda-charcoal text-sda-sand p-6 sm:p-8 rounded-sm shadow-editorial"
        >
          <div className="flex items-start gap-4">
            <div className="shrink-0 h-10 w-10 rounded-full bg-sda-gold text-sda-navy flex items-center justify-center font-black text-lg">
              !
            </div>
            <div>
              <p className="font-display font-bold text-lg uppercase tracking-wider text-sda-gold">
                ⚠️ Tithe Boundary Protection Policy
              </p>
              <p className="mt-3 text-sm leading-relaxed text-sda-sand/90">
                In strict adherence to Seventh-day Adventist global financial
                policies, these construction funds represent voluntary freewill
                offerings that are <strong>"Above and Beyond"</strong> your
                systematic benevolence. Regular Tithes belong exclusively to the
                <strong> Field/Conference treasury storehouse</strong> and must
                not be redirected to local structural funds. This platform
                rejects all coercive tactics, transactional theology, or
                emotional manipulation. We present our structural needs clearly
                and invite freewill gifts as an act of personal worship.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   SECTION G — Footer Audit Log
   ---------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="bg-sda-sand border-t-2 border-sda-navy/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-sda-navy flex items-center justify-center text-sda-gold font-display font-black text-lg">
                6
              </div>
              <p className="font-display font-bold text-lg text-sda-navy">
                Clinic Six (6) SDA Church
              </p>
            </div>
            <p className="mt-4 text-sm text-sda-charcoal/80 leading-relaxed">
              A Seventh-day Adventist congregation serving the Kakuma refugee
              community in Turkana County, Kenya.
            </p>
          </div>

          <div>
            <p className="uppercase tracking-widest text-xs font-bold text-sda-gold">
              Administrative Hierarchy
            </p>
            <ul className="mt-4 space-y-2 text-sm text-sda-charcoal/85">
              <li>Local Church · Clinic 6 SDA</li>
              <li>District · Lokichogio</li>
              <li>Station · Kakuma</li>
              <li>Field · Rift Valley Field</li>
              <li>Union · East Kenya Union Conference</li>
            </ul>
          </div>

          <div>
            <p className="uppercase tracking-widest text-xs font-bold text-sda-gold">
              Audit & Stewardship
            </p>
            <ul className="mt-4 space-y-2 text-sm text-sda-charcoal/85">
              <li>Account: <span className="font-semibold">Clinic6 SDA church</span></li>
              <li>A/C No: <span className="font-mono">1650280005225</span></li>
              <li>Paybill: <span className="font-mono">247247</span></li>
              <li>SWIFT: <span className="font-mono">EQBLKENAXXX</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-sda-navy/10 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs text-sda-charcoal/70">
          <p>
            © 2026 SDA Church Clinic Six (6) — Kakuma Refugee Camp Campaign. All
            Rights Reserved.
          </p>
          <p className="lg:text-right">
            Supervised by the SDA Lokichogio District Leadership, Kakuma
            Station, under the ecclesiastical administrative management of the
            Rift Valley Field of the East Kenya Union Conference.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------------------------------------------
   Root Application
   ---------------------------------------------------------------- */
export default function App() {
  return (
    <div className="min-h-screen bg-sda-sand text-sda-charcoal font-sans">
      <VerificationHeader />
      <main>
        <Hero />
        <WhyUs />
        <BlueprintMatrix />
        <GivingGateway />
      </main>
      <Footer />
    </div>
  )
}
