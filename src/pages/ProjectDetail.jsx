import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjectBySlug, projectCatalog } from '../data/projectCatalog.js'

const rollInViewport = {
  initial: { opacity: 0, x: -26, rotate: -4, scale: 0.97 },
  whileInView: { opacity: 1, x: 0, rotate: 0, scale: 1 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: 'easeOut' },
}

/* ProjectDetail renders a dedicated fundraising brief for each project card. */
export default function ProjectDetail() {
  const { projectSlug } = useParams()
  const project = getProjectBySlug(projectSlug)
  const [visibleCurrentMediaCount, setVisibleCurrentMediaCount] = useState(3)
  const [visibleDreamMediaCount, setVisibleDreamMediaCount] = useState(3)

  const budgetItems = project?.budgetItems || []
  const [selectedBudgetIds, setSelectedBudgetIds] = useState(() => budgetItems.map((item) => item.id))

  const selectedBudgetRows = useMemo(() => {
    return budgetItems.filter((item) => selectedBudgetIds.includes(item.id))
  }, [budgetItems, selectedBudgetIds])

  const selectedBudgetTotal = useMemo(() => {
    return selectedBudgetRows.reduce((sum, item) => sum + item.cost, 0)
  }, [selectedBudgetRows])

  const budgetCurrency = project?.budgetCurrency || 'USD'
  const formattedBudgetTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: budgetCurrency,
    maximumFractionDigits: 0,
  }).format(selectedBudgetTotal)

  function formatBudgetValue(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: budgetCurrency,
      maximumFractionDigits: 0,
    }).format(value)
  }

  function toggleBudgetItem(itemId) {
    setSelectedBudgetIds((currentIds) => {
      if (currentIds.includes(itemId)) {
        return currentIds.filter((id) => id !== itemId)
      }
      return [...currentIds, itemId]
    })
  }


  if (!project) {
    return (
      <section className="min-h-[60vh] bg-[#F7F4EF] px-6 py-16 text-[#0F2942]">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#0F2942]/15 bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Project Not Found</p>
          <h1 className="mt-3 text-3xl font-black">This project page is not available.</h1>
          <p className="mt-3 text-sm text-[#2D3142]/80">
            The project link may be outdated. Please return to the Home page and select an active project card.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-sm bg-[#0F2942] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#D4AF37] hover:text-[#0F2942]"
          >
            Back to Projects
          </Link>
        </div>
      </section>
    )
  }

  const relatedProjects = projectCatalog.filter((item) => item.slug !== project.slug)
  const selectedNames = selectedBudgetRows.map((item) => item.item).join(', ')
  const donateLink = `/give?project=${encodeURIComponent(project.slug)}&budget=${encodeURIComponent(formattedBudgetTotal)}&items=${encodeURIComponent(selectedNames)}`
  const isJordanBaptismPage = project.slug === 'jordan-construction'
  const isSecurityFencingPage = project.slug === 'security-fencing'
  const rollingBaptismMedia = (project.currentMedia || []).filter(
    (media) =>
      media.type === 'image' &&
      (media.src.toLowerCase().includes('baptism at clic6') || media.src.toLowerCase().includes('baptism at clinic6'))
  )
  const staticCurrentMedia = (project.currentMedia || []).filter(
    (media) =>
      !(
        media.type === 'image' &&
        (media.src.toLowerCase().includes('baptism at clic6') || media.src.toLowerCase().includes('baptism at clinic6'))
      )
  )
  const visibleCurrentMedia = staticCurrentMedia.slice(0, visibleCurrentMediaCount)
  const visibleDreamMedia = (project.dreamMedia || []).slice(0, visibleDreamMediaCount)

  return (
    <section className="bg-[#F7F4EF] px-6 py-12 text-[#2D3142] sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-[#D4AF37]/45 bg-gradient-to-br from-[#0F2942] via-[#173A5D] to-[#0F2942] p-7 text-white shadow-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#D4AF37]">Project Detail</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{project.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">{project.shortSummary}</p>
          <div className="mt-5 inline-flex rounded-full border border-white/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
            Priority: {project.urgency}
          </div>
        </div>

        {(project.currentMedia?.length > 0 || project.dreamMedia?.length > 0) && (
          <div className="mt-8 rounded-2xl border border-[#0F2942]/15 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]/70">
              Current Situation and Dream Illustrations
            </p>

            {project.currentMedia?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-black text-[#0F2942]">Current Situation</h3>
                {isJordanBaptismPage && rollingBaptismMedia.length > 0 && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-[#0F2942]/15 bg-[#F8F1E2]">
                    <div className="baptism-flow-track">
                      {rollingBaptismMedia.map((media, index) => (
                        <article
                          key={`flow-${media.src}-${index}`}
                          className="baptism-flow-card overflow-hidden rounded-lg border border-[#0F2942]/15 bg-white"
                        >
                          <img src={media.src} alt={media.alt} className="aspect-video w-full object-cover" loading="lazy" />
                          <div className="border-t border-[#0F2942]/12 px-3 py-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0F2942]/70">Baptism At Clinic6</p>
                            <p className="mt-1 text-xs leading-relaxed text-[#2D3142]/85">{media.illustration}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {visibleCurrentMedia.map((media, index) => (
                    <motion.article
                      key={`${media.type}-${media.src}`}
                      {...rollInViewport}
                      transition={{ ...rollInViewport.transition, delay: index * 0.07 }}
                      className={`overflow-hidden rounded-xl border border-[#0F2942]/15 bg-[#F8F1E2] ${isSecurityFencingPage ? 'md:col-span-2 lg:col-span-3' : ''}`}
                    >
                      {media.type === 'video' ? (
                        <video
                          className={isSecurityFencingPage ? 'aspect-[16/10] w-full object-cover' : 'aspect-[4/3] w-full object-cover'}
                          controls
                          preload="metadata"
                        >
                          <source src={media.src} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={media.src}
                          alt={media.alt}
                          className={isSecurityFencingPage ? 'aspect-[16/10] w-full object-cover' : 'aspect-[4/3] w-full object-cover'}
                          loading="lazy"
                        />
                      )}
                      <div className="border-t border-[#0F2942]/12 px-3 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0F2942]/70">Illustration Note</p>
                        <p className="mt-1 text-xs leading-relaxed text-[#2D3142]/85">{media.illustration}</p>
                      </div>
                    </motion.article>
                  ))}
                </div>
                {staticCurrentMedia.length > visibleCurrentMedia.length && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setVisibleCurrentMediaCount((count) => count + 3)}
                      className="inline-flex items-center rounded-sm border border-[#0F2942]/25 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0F2942] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    >
                      Load More Current Media
                    </button>
                  </div>
                )}
              </div>
            )}

            {project.dreamMedia?.length > 0 && (
              <div className="mt-7">
                <h3 className="text-lg font-black text-[#0F2942]">Dream Vision</h3>
                <div
                  className={`mt-3 grid gap-4 ${
                    isJordanBaptismPage
                      ? 'md:grid-cols-1 lg:grid-cols-2'
                      : isSecurityFencingPage
                      ? 'md:grid-cols-1 lg:grid-cols-2'
                      : 'md:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {visibleDreamMedia.map((media, index) => {
                    const isHighDutyMetal = media.src.toLowerCase().includes('high duty metal.jpg')
                    return (
                    <motion.article
                      key={`${media.type}-${media.src}`}
                      {...rollInViewport}
                      transition={{ ...rollInViewport.transition, delay: index * 0.07 }}
                      className={`overflow-hidden rounded-xl border border-[#0F2942]/15 bg-[#F8F1E2] ${isHighDutyMetal ? 'md:col-span-2 lg:col-span-2' : ''} ${isSecurityFencingPage ? 'md:col-span-1 lg:col-span-1' : ''}`}
                    >
                      {media.type === 'video' ? (
                        <video
                          className={
                            isHighDutyMetal
                              ? 'aspect-[16/10] w-full object-cover'
                              : isSecurityFencingPage
                              ? 'aspect-[16/10] w-full object-cover'
                              : isJordanBaptismPage
                              ? 'aspect-[5/4] w-full object-cover'
                              : 'aspect-[4/3] w-full object-cover'
                          }
                          controls
                          preload="metadata"
                        >
                          <source src={media.src} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          src={media.src}
                          alt={media.alt}
                          className={
                            isHighDutyMetal
                              ? 'aspect-[16/10] w-full object-cover'
                              : isSecurityFencingPage
                              ? 'aspect-[16/10] w-full object-cover'
                              : isJordanBaptismPage
                              ? 'aspect-[5/4] w-full object-cover'
                              : 'aspect-[4/3] w-full object-cover'
                          }
                          loading="lazy"
                        />
                      )}
                      <div className="border-t border-[#0F2942]/12 px-3 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0F2942]/70">Detailed Illustration</p>
                        <p className="mt-1 text-xs leading-relaxed text-[#2D3142]/85">{media.illustration}</p>
                      </div>
                    </motion.article>
                    )
                  })}
                </div>
                {project.dreamMedia.length > visibleDreamMedia.length && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setVisibleDreamMediaCount((count) => count + 3)}
                      className="inline-flex items-center rounded-sm border border-[#0F2942]/25 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0F2942] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    >
                      Load More Dream Media
                    </button>
                  </div>
                )}
              </div>
            )}

            {project.externalMediaLinks?.length > 0 && (
              <div className="mt-7">
                <h3 className="text-lg font-black text-[#0F2942]">Additional Baptism Media</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#2D3142]/80">
                  Some JPG photos are hosted on Google Photos and may require sign-in to view.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {project.externalMediaLinks.map((mediaLink, index) => (
                    <motion.a
                      key={mediaLink.url}
                      {...rollInViewport}
                      transition={{ ...rollInViewport.transition, delay: index * 0.06 }}
                      href={mediaLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-[#0F2942]/15 bg-[#F8F1E2] px-4 py-3 text-sm font-semibold text-[#0F2942] transition hover:border-[#D4AF37]"
                    >
                      {mediaLink.label}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-5">
          <article className="md:col-span-3 rounded-2xl border border-[#0F2942]/15 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]/70">Objective</p>
            <p className="mt-3 text-sm leading-relaxed text-[#2D3142]/90 sm:text-base">{project.objective}</p>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]/70">What Donations Support</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#2D3142]/90">
              {project.donationUse.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {budgetItems.length > 0 && (
              <div className="mt-8 rounded-xl border border-[#D4AF37]/40 bg-[#F8F1E2] p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]">Detailed Budget Sheet</p>
                <p className="mt-2 text-sm leading-relaxed text-[#2D3142]/88">
                  Select one or more budget lines to support. Your selected items build a transparent donation target.
                </p>

                <div className="mt-4 space-y-3">
                  {budgetItems.map((item) => {
                    const checked = selectedBudgetIds.includes(item.id)
                    return (
                      <label
                        key={item.id}
                        className={`block rounded-lg border px-3 py-3 transition ${
                          checked
                            ? 'border-[#0F2942] bg-white shadow-sm'
                            : 'border-[#0F2942]/15 bg-[#F8F1E2] hover:border-[#D4AF37]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleBudgetItem(item.id)}
                            className="mt-1 h-4 w-4 accent-[#0F2942]"
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-bold text-[#0F2942] leading-snug">{item.item}</p>
                              <p className="text-sm font-black text-[#0F2942]">{formatBudgetValue(item.cost)}</p>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-[#2D3142]/80">{item.detail}</p>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>

                <div className="mt-4 rounded-lg border border-[#0F2942]/20 bg-white px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]/70">Selected Budget Total</p>
                  <p className="mt-1 text-2xl font-black text-[#0F2942]">{formattedBudgetTotal}</p>
                  <p className="mt-1 text-xs text-[#2D3142]/75">{selectedBudgetRows.length} item(s) selected</p>

                  <Link
                    to={donateLink}
                    data-cta-persist="until-donation-complete"
                    onClick={() => {
                      sessionStorage.setItem('donation-flow-active', '1')
                    }}
                    className="donation-alert-cta mt-4 inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white"
                  >
                    Proceed With Your Donation
                  </Link>
                </div>
              </div>
            )}
          </article>

          <aside className="md:col-span-2 rounded-2xl border border-[#0F2942]/15 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]/70">Expected Impact</p>
            <p className="mt-3 text-sm leading-relaxed text-[#2D3142]/90">{project.expectedImpact}</p>

            <div className="mt-6 rounded-xl border border-[#D4AF37]/45 bg-[#F2E4C8] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F2942]">Support This Project</p>
              <p className="mt-2 text-sm leading-relaxed text-[#0F2942]/90">
                Continue to the giving portal and select this project in the donation options.
              </p>
              <Link
                to={donateLink}
                className="cta-give-pop mt-4 inline-flex w-full items-center justify-center rounded-sm bg-[#0F2942] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#D4AF37] hover:text-[#0F2942]"
              >
                Go to Giving Portal
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-10 rounded-2xl border border-[#0F2942]/15 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]/70">Related Project Pages</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((item) => (
              <Link
                key={item.slug}
                to={`/projects/${item.slug}`}
                className="rounded-xl border border-[#0F2942]/15 bg-[#F8F1E2] px-4 py-3 text-sm font-semibold text-[#0F2942] transition hover:border-[#D4AF37]"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
