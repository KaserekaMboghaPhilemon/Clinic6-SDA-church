import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import baptismPondVideo from './assets/first-storm.mp4'
import basinImg1 from './assets/baptism at clinic6.jpg'
import basinImg2 from './assets/Camera Roll/baptism at clic6 (2).jpg'
import basinImg3 from './assets/Camera Roll/baptism at clic6 (3).jpg'
import basinImg4 from './assets/IMG_20240824_164748_249.jpg'

const MotionLink = motion(Link)

/* ------------------------------------------------------------------ */
/*  MediaCenter.jsx                                                    */
/*  Design language: Casavera (bold editorial type) + ECI (white-space */
/*  grids). Palette: sda-sand #F7F4EF / sda-navy #0F2942 / gold #D4AF37 */
/* ------------------------------------------------------------------ */

/* Reusable fade-in-up wrapper driven by viewport scroll */
const FadeInUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

/* Inline SVG play icon — keeps the file self-contained, no icon lib */
const PlayIcon = ({ className = 'w-12 h-12' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M8 5v14l11-7z" />
  </svg>
)

/* ============================================================ */
/*  1. CINEMATIC VIDEO HERO                                      */
/* ============================================================ */
function VideoHero() {
  const scrollToOutreach = () => {
    const el = document.getElementById('outreach')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="media-hero"
      className="relative w-full h-[70vh] min-h-[520px] overflow-hidden bg-[#0F2942]"
    >
      {/* Background looping worship video.
          TODO: place file at  → /src/assets/choir-worship-loop.mp4
          (or /public/media/choir-worship-loop.mp4 and update src below) */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/src/assets/choir-worship-poster.jpg"
        aria-label="Clinic 6 SDA choir leading worship in Kakuma"
      >
        <source src="/src/assets/choir-worship-loop.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#0F2942]/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <FadeInUp>
          <p className="text-[#D4AF37] uppercase tracking-[0.35em] text-xs md:text-sm font-semibold mb-6">
            Clinic 6 · Media Center
          </p>
        </FadeInUp>

        <FadeInUp delay={0.15}>
          <h1 className="font-display font-black text-white text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-5xl">
            868 Voices.
            <br />
            <span className="text-[#D4AF37]">One Mission.</span>
          </h1>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <p className="mt-8 max-w-2xl text-white/80 text-lg md:text-xl font-light">
            A worshipping community in Kakuma Refugee Camp — singing, serving,
            and building a sanctuary for generations to come.
          </p>
        </FadeInUp>

        <FadeInUp delay={0.45}>
          <button
            onClick={scrollToOutreach}
            className="mt-10 group inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-[#c39d28] text-[#0F2942] font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.6)] hover:-translate-y-0.5"
          >
            <PlayIcon className="w-5 h-5" />
            Watch Our Story
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </FadeInUp>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center text-white/60">
        <span className="text-[10px] uppercase tracking-[0.3em] mb-2">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  )
}

/* ============================================================ */
/*  2. BENTO PHOTO GRID — Children & Education                   */
/* ============================================================ */
function BentoGrid() {
  /* Five tiles — asymmetric grid laid out on a 4-col × 6-row canvas */
  const tiles = [
    {
      // TODO: /src/assets/children-church.jpg
      src: '/src/assets/children-church.jpg',
      alt: 'Clinic 6 children gathered for Sabbath worship',
      label: 'Children of the Promise',
      span: 'md:col-span-2 md:row-span-4',  // large hero tile
      aspect: '',
    },
    {
      // TODO: /src/assets/lessons.jpg
      src: '/src/assets/lessons.jpg',
      alt: 'Sabbath school lesson study at Clinic 6',
      label: 'Daily Lessons',
      span: 'md:col-span-2 md:row-span-2',  // wide top-right
      aspect: '',
    },
    {
      // TODO: /src/assets/sabbath-school.jpg
      src: '/src/assets/sabbath-school.jpg',
      alt: 'Sabbath school children singing together',
      label: 'Sabbath School',
      span: 'md:col-span-1 md:row-span-2',
      aspect: 'aspect-square',
    },
    {
      // TODO: /src/assets/children-singing.jpg
      src: '/src/assets/children-singing.jpg',
      alt: 'Children choir performing in the sanctuary',
      label: 'Voices of Tomorrow',
      span: 'md:col-span-1 md:row-span-2',
      aspect: 'aspect-square',
    },
    {
      // TODO: /src/assets/youth-bible.jpg
      src: '/src/assets/youth-bible.jpg',
      alt: 'Youth holding Bibles after a service at Clinic 6',
      label: 'Discipling the Next Generation',
      span: 'md:col-span-4 md:row-span-2',  // full-width banner row
      aspect: '',
    },
  ]

  return (
    <section className="bg-[#F7F4EF] py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeInUp className="mb-14 md:mb-20 max-w-3xl">
          <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-semibold mb-4">
            Children & Education
          </p>
          <h2 className="font-display font-black text-[#0F2942] text-4xl md:text-6xl leading-[1.05]">
            Empowering <span className="italic text-[#D4AF37]">493 Children</span>
            <br />
            Across Kakuma.
          </h2>
          <p className="mt-6 text-[#2D3142]/70 text-lg max-w-xl">
            Every Sabbath, hundreds of children gather under our roof for
            scripture, song, and shared meals.
          </p>
        </FadeInUp>

        {/* Bento canvas */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-6 gap-4 md:gap-5 md:h-[820px]">
          {tiles.map((tile, i) => (
            <FadeInUp
              key={tile.label}
              delay={i * 0.08}
              className={`group relative overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-shadow duration-500 ${tile.span} ${tile.aspect}`}
            >
              <img
                src={tile.src}
                alt={tile.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                loading="lazy"
              />

              {/* Reveal overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2942] via-[#0F2942]/40 to-transparent opacity-60 group-hover:opacity-95 transition-opacity duration-500" />

              {/* Bottom-anchored label that slides up on hover */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[#D4AF37] uppercase tracking-[0.25em] text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Clinic 6
                </p>
                <h3 className="font-display text-white text-xl md:text-2xl font-bold mt-1">
                  {tile.label}
                </h3>
                <p className="text-white/80 text-sm mt-2 max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-500">
                  Empowering 493 Children — one Sabbath at a time.
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================ */
/*  2B. SACRED BASIN GALLERY                                     */
/* ============================================================ */
function SacredBasinGallery() {
  // Ordered gallery data includes the exact requested filenames.
  const basinImages = [
    {
      id: 'basin-1',
      src: basinImg1,
      fileName: 'IMG_20240824_134817_754.jpg',
      label: 'Sacred Renewal: Full Immersion Baptism',
    },
    {
      id: 'basin-2',
      src: basinImg2,
      fileName: 'IMG_20240824_135933_897.jpg',
      label: 'Covenant Witness: Public Profession of Faith',
    },
    {
      id: 'basin-3',
      src: basinImg3,
      fileName: 'IMG20240824140118_01.jpg',
      label: 'New Life in Christ: Sacred Basin Gathering',
    },
    {
      id: 'basin-4',
      src: basinImg4,
      fileName: 'IMG_20240824_164745_756.jpg',
      label: 'Community Baptism: Joy at the Basin',
    },
    {
      id: 'basin-5',
      src: '/src/assets/IMG_20240824_154635_410 (1).jpg',
      fileName: 'IMG_20240824_154635_410 (1).jpg',
      label: 'Sacred Basin Dedication: Prayer and Commitment',
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = basinImages[activeIndex]

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % basinImages.length)
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + basinImages.length) % basinImages.length)
  }

  // Fallback keeps gallery stable if one expected file is not yet present.
  const handleImageFallback = (event) => {
    event.currentTarget.src = basinImg1
  }

  return (
    <section className="bg-[#F7F4EF] py-20 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeInUp className="mb-10">
          <p className="text-[#556B2F] uppercase tracking-[0.28em] text-xs font-semibold mb-3">
            Sacred Basin Gallery
          </p>
          <h2 className="font-display font-black text-[#0F2942] text-3xl md:text-5xl leading-tight">
            Our Sacred Basin: Dedicated Baptismal Pond
          </h2>
        </FadeInUp>

        {/* Hero slider with fade switch and edge-mounted arrows. */}
        <FadeInUp delay={0.08} className="relative overflow-hidden rounded-3xl border border-[#556B2F]/25 bg-black shadow-2xl">
          <div className="relative aspect-video">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage.id}
                src={activeImage.src}
                alt={activeImage.label}
                onError={handleImageFallback}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/25" />

            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
              <p className="text-white/85 text-xs uppercase tracking-[0.2em]">{activeImage.fileName}</p>
              <h3 className="mt-2 text-white font-display text-2xl md:text-3xl font-black">
                Our Sacred Basin: Dedicated Baptismal Pond
              </h3>
            </div>

            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous sacred basin image"
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#0F2942]/70 text-white ring-1 ring-white/30 transition hover:bg-[#0F2942]/90"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next sacred basin image"
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#0F2942]/70 text-white ring-1 ring-white/30 transition hover:bg-[#0F2942]/90"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </FadeInUp>

        {/* Mobile-safe horizontal thumbnail strip with active border state. */}
        <FadeInUp delay={0.12} className="mt-5 md:mt-6">
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {basinImages.map((item, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={
                    'min-w-[180px] sm:min-w-[210px] text-left rounded-2xl border bg-white p-2 md:p-2.5 transition ' +
                    (isActive
                      ? 'border-[#556B2F] shadow-lg'
                      : 'border-[#556B2F]/20 hover:border-[#556B2F]/45')
                  }
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    onError={handleImageFallback}
                    className="w-full aspect-video rounded-xl object-cover"
                    loading="lazy"
                  />
                  <p className="mt-2 text-[11px] md:text-xs font-semibold text-[#1A2412] leading-snug">
                    {item.label}
                  </p>
                </button>
              )
            })}
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

/* ============================================================ */
/*  3. HORIZONTAL OUTREACH REEL                                  */
/* ============================================================ */
function OutreachReel() {
  const reels = [
    {
      title: 'Community Food Outreach',
      subtitle: 'Kakuma Sector 3 · 2025',
      // TODO: /src/assets/outreach-food.mp4  (poster: outreach-food.jpg)
      src: '/src/assets/outreach-food.mp4',
      poster: '/src/assets/outreach-food.jpg',
      alt: 'Volunteers distributing food parcels at Clinic 6 outreach',
    },
    {
      title: 'Choir Proclamation',
      subtitle: '868 Voices · Live',
      // TODO: /src/assets/choir-proclamation.mp4
      src: '/src/assets/choir-proclamation.mp4',
      poster: '/src/assets/choir-proclamation.jpg',
      alt: 'Clinic 6 choir proclaiming the gospel in song',
    },
    {
      title: 'Health Clinic Service',
      subtitle: 'Free Medical Camp',
      // TODO: /src/assets/health-clinic.mp4
      src: '/src/assets/health-clinic.mp4',
      poster: '/src/assets/health-clinic.jpg',
      alt: 'Health camp serving Kakuma residents',
    },
    {
      title: 'many water',
      subtitle: 'Constructed Baptismal Pond · Clinic 6 Mission Grounds',
      // Uses a real local baptism video capture for this reel tile.
      src: baptismPondVideo,
      showVideo: true,
      poster: '/src/assets/baptism-river.jpg',
      alt: 'Baptism ceremony at the constructed baptismal pond',
    },
    {
      title: 'Sanctuary Build-Up',
      subtitle: 'Construction Progress',
      // TODO: /src/assets/construction.mp4
      src: '/src/assets/construction.mp4',
      poster: '/src/assets/construction.jpg',
      alt: 'Ongoing construction of the Clinic 6 sanctuary',
    },
  ]

  return (
    <section id="outreach" className="bg-[#0F2942] py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <FadeInUp className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-semibold mb-4">
              The Outreach Reel
            </p>
            <h2 className="font-display font-black text-white text-4xl md:text-6xl leading-[1.05]">
              Faith in <span className="italic text-[#D4AF37]">Motion.</span>
            </h2>
          </div>
          <p className="text-white/60 text-sm md:text-base max-w-sm md:text-right">
            Swipe → through stories of worship, service, and witness from the
            heart of Kakuma.
          </p>
        </FadeInUp>
      </div>

      {/* Side-scrolling rail — bleeds slightly past the viewport edges */}
      <FadeInUp delay={0.2}>
        <div
          className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 px-6 md:px-[max(1.5rem,calc((100vw-1280px)/2))]"
          style={{ scrollbarWidth: 'thin' }}
        >
          {reels.map((reel) => (
            <article
              key={reel.title}
              className="group relative flex-shrink-0 snap-start w-[80vw] sm:w-[60vw] md:w-[420px] aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 hover:ring-[#D4AF37]/60 transition-all duration-500 cursor-pointer"
            >
              {/* Baptism tile uses video playback; other tiles keep poster images for performance. */}
              {reel.showVideo ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={reel.poster}
                  aria-label={reel.alt}
                >
                  <source src={reel.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={reel.poster}
                  alt={reel.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  loading="lazy"
                />
              )}

              {/* Dark vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

              {/* Centered play icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/95 text-[#0F2942] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-[#D4AF37]">
                  <PlayIcon className="w-8 h-8 translate-x-0.5" />
                </div>
              </div>

              {/* Blurred bottom info bar */}
              <div className="absolute inset-x-0 bottom-0 backdrop-blur-md bg-black/40 border-t border-white/10 px-5 py-4">
                <p className="text-[#D4AF37] uppercase tracking-[0.2em] text-[10px] font-semibold">
                  {reel.subtitle}
                </p>
                <h3 className="font-display text-white text-lg md:text-xl font-bold mt-1">
                  {reel.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </FadeInUp>
    </section>
  )
}

/* ============================================================ */
/*  4. IMPACT STATS BANNER                                       */
/* ============================================================ */
function StatsBanner() {
  const stats = [
    { value: '1,700+', label: 'Total Footprint' },
    { value: '4',       label: 'Churches Planted' },
    { value: '850',     label: 'Seats Goal' },
  ]

  return (
    <section className="bg-white py-16 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#0F2942]/10">
          {stats.map((s, i) => (
            <FadeInUp
              key={s.label}
              delay={i * 0.1}
              className="text-center px-6 py-8 md:py-4"
            >
              <p className="font-display font-black text-[#0F2942] text-5xl md:text-7xl leading-none">
                {s.value}
              </p>
              <p className="mt-3 uppercase tracking-[0.3em] text-xs font-semibold text-[#2D3142]/60">
                {s.label}
              </p>
              <div className="mt-4 mx-auto h-px w-12 bg-[#D4AF37]" />
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================ */
/*  5. STICKY GIVE WIDGET                                        */
/* ============================================================ */
function StickyGiveWidget() {
  return (
    <MotionLink
      to="/give"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 right-6 z-40 group inline-flex items-center gap-3 bg-[#0F2942] hover:bg-[#0F2942]/95 text-white pl-5 pr-6 py-3.5 rounded-full shadow-2xl ring-1 ring-[#D4AF37]/40 hover:ring-[#D4AF37] transition-all duration-300 hover:-translate-y-0.5"
      aria-label="Sponsor a seat via M-Pesa Paybill 247247"
    >
      <span className="w-9 h-9 rounded-full bg-[#D4AF37] text-[#0F2942] flex items-center justify-center font-bold">
        ₿
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-semibold text-sm">Sponsor a Seat</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
          Paybill 247247
        </span>
      </span>
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </MotionLink>
  )
}

/* ============================================================ */
/*  EXPORT                                                       */
/* ============================================================ */
export default function MediaCenter() {
  return (
    <main className="bg-[#F7F4EF] text-[#2D3142]">
      <VideoHero />
      <BentoGrid />
      <SacredBasinGallery />
      <OutreachReel />
      <StatsBanner />
      <StickyGiveWidget />
    </main>
  )
}
