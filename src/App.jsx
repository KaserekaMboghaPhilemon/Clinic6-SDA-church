import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home.jsx";
import OurStory from "./pages/OurStory.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Contact from "./pages/Contact.jsx";
import SeatingPage from "./SeatingPage.jsx";
import DonatePage from "./DonatePage.jsx";
import MediaCenter from "./MediaCenter.jsx";
import ChurchTimeline from "./ChurchTimeline.jsx";
import JordanFeature from "./JordanFeature.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import StickyActionBar from "./StickyActionBar.jsx";
import { LanguageProvider } from "./i18n.jsx";
import { smoothScrollToId } from "./utils/smoothScroll.js";

/* =================================================================
   App.jsx — Router shell with Hybrid Navigation
   - "/"         → Home
   - "/seating"  → SeatingPage
   - "/give"     → DonatePage
   ================================================================= */

/* Scrolls to the hash target after navigation (e.g. /#story) and
   scrolls to top on route changes that don't include a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait one tick so the target section is mounted, then scroll.
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        smoothScrollToId(id);
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "instant" in window ? "instant" : "auto",
      });
    }
  }, [pathname, hash]);

  return null;
}

function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-[#F7F4EF] text-[#0F2942] px-6">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-[#D4AF37]">
          Error 404
        </p>
        <h1 className="font-display font-black text-5xl mt-3">
          Page not found
        </h1>
        <a
          href="/"
          className="inline-block mt-8 bg-[#0F2942] text-white font-bold px-6 py-3 rounded-sm uppercase tracking-widest text-xs"
        >
          ← Back to Home
        </a>
      </div>
    </section>
  );
}

/* Unified page transition shell for all route-level views. */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* Route layer with AnimatePresence to animate page exit/entry globally. */
function AnimatedRoutes() {
  const location = useLocation();

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
          path="/projects/:projectSlug"
          element={
            <PageTransition>
              <ProjectDetail />
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
          path="/contact"
          element={
            <PageTransition>
              <Contact />
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
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useEffect(() => {
    function handleCtaClick(event) {
      const target = event.target instanceof Element ? event.target : null;
      const cta = target?.closest(
        ".cta-give-pop, .cta-donate-pop, .donation-alert-cta",
      );
      if (!cta) return;

      if (cta.getAttribute("data-cta-persist") === "until-donation-complete") {
        return;
      }

      cta.classList.add("cta-is-paused");
    }

    document.addEventListener("click", handleCtaClick);
    return () => document.removeEventListener("click", handleCtaClick);
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollManager />
        {/* Prevent x-axis overflow from creating bottom scrollbar on narrow viewports. */}
        <div className="relative min-h-screen overflow-x-hidden bg-[#F7F4EF] text-[#2D3142] font-sans pb-16">
          <div className="fixed inset-x-0 top-0 z-50 overflow-hidden bg-[#D4AF37] text-[#0F2942] border-b border-[#0F2942]/10 py-2">
            <div className="marquee relative whitespace-nowrap text-center text-sm font-semibold uppercase tracking-[0.24em]">
              <div className="marquee__track inline-block animate-marquee">
                Site under development — content and layout are still being finalized.
                <span className="mx-8">|</span>
                Site under development — content and layout are still being finalized.
                <span className="mx-8">|</span>
                Site under development — content and layout are still being finalized.
              </div>
            </div>
          </div>
          <div className="pt-12">
            <Header />
          <AnimatedRoutes />
          <Footer />
          <StickyActionBar />
        </div>
      </BrowserRouter>
      <style>{`
        .animate-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 18s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </LanguageProvider>
  );
}
