import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home.jsx'
import OurStory from './pages/OurStory.jsx'
import SeatingPage from './SeatingPage.jsx'
import DonatePage from './DonatePage.jsx'
import MediaCenter from './MediaCenter.jsx'
import ChurchTimeline from './ChurchTimeline.jsx'
import JordanFeature from './JordanFeature.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import StickyActionBar from './StickyActionBar.jsx'
import { LanguageProvider } from './i18n.jsx'
import { smoothScrollToId } from './utils/smoothScroll.js'

/* =================================================================
   App.jsx — Router shell with Hybrid Navigation
   - "/"         → Home
   - "/seating"  → SeatingPage
   - "/give"     → DonatePage
   ================================================================= */

/* Scrolls to the hash target after navigation (e.g. /#story) and
   scrolls to top on route changes that don't include a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Wait one tick so the target section is mounted, then scroll.
      const id = hash.replace('#', '')
      requestAnimationFrame(() => {
        smoothScrollToId(id)
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    }
  }, [pathname, hash])

  return null
}

function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-[#F7F4EF] text-[#0F2942] px-6">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-[#D4AF37]">Error 404</p>
        <h1 className="font-display font-black text-5xl mt-3">Page not found</h1>
        <a
          href="/"
          className="inline-block mt-8 bg-[#0F2942] text-white font-bold px-6 py-3 rounded-sm uppercase tracking-widest text-xs"
        >
          ← Back to Home
        </a>
      </div>
    </section>
  )
}

/* Unified page transition shell for all route-level views. */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

/* Route layer with AnimatePresence to animate page exit/entry globally. */
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/our-story"
          element={
            <PageTransition>
              <OurStory />
            </PageTransition>
          }
        />
        <Route
          path="/seating"
          element={
            <PageTransition>
              <SeatingPage />
            </PageTransition>
          }
        />
        <Route
          path="/give"
          element={
            <PageTransition>
              <DonatePage />
            </PageTransition>
          }
        />
        <Route
          path="/media"
          element={
            <PageTransition>
              <>
                <MediaCenter />
                <ChurchTimeline />
                <JordanFeature />
              </>
            </PageTransition>
          }
        />
        <Route
          path="/timeline"
          element={
            <PageTransition>
              <ChurchTimeline />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <LanguageProvider>
    <BrowserRouter>
      <ScrollManager />
      {/* Prevent x-axis overflow from creating bottom scrollbar on narrow viewports. */}
      <div className="min-h-screen overflow-x-hidden bg-[#F7F4EF] text-[#2D3142] font-sans pb-16">
        <Header />
        <AnimatedRoutes />
        <Footer />
        <StickyActionBar />
      </div>
    </BrowserRouter>
    </LanguageProvider>
  )
}
