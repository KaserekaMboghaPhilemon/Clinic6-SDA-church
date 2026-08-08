import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { GlobalReveal, GlobalRevealItem } from "../components/GlobalReveal.jsx";
import { useT } from "../i18n.jsx";
import { projectCatalog } from "../data/projectCatalog.js";
import heroImage from "../assets/image_e6151f.png";
import stormDamageImage from "../assets/wornout-clinic6-church.png";
import metalBuildImage from "../assets/assumed-for-work.png";
import highDutyMetalImage from "../assets/high duty metal.jpg";
import milestoneImage from "../assets/b2093d91212795215ff70d93560a56b1 (1).jpg";

function SchoolIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z" />
      <path d="M7 11.5V16c0 .7 2.2 2 5 2s5-1.3 5-2v-4.5" />
    </svg>
  );
}

function HealthIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 10.5 12 4l8 6.5V20H4v-9.5Z" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M14.5 6.5a4 4 0 0 0 3.8 5.2L12 18l-3-3 6.3-6.3a4 4 0 0 0-.8-2.2Z" />
      <path d="M5 19l2.5-2.5" />
      <path d="M19 5l-2 2" />
    </svg>
  );
}

function AudioIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 14h3l4 4V6L8 10H5v4Z" />
      <path d="M16 9a5 5 0 0 1 0 6" />
      <path d="M18.5 6.5a8.5 8.5 0 0 1 0 11" />
    </svg>
  );
}

function MealIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 10.5h16" />
      <path d="M7 10.5V7.5a2.5 2.5 0 0 1 5 0v3" />
      <path d="M12 10.5V7" />
      <path d="M4.5 10.5l1.2 8.5h12.6l1.2-8.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 20.2 4.8 13.4A4.8 4.8 0 0 1 12 7.2a4.8 4.8 0 0 1 7.2 6.2L12 20.2Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M2.8 12s3.4-6 9.2-6 9.2 6 9.2 6-3.4 6-9.2 6-9.2-6-9.2-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

const lineageMap = [
  { name: "Clinic 6 Mother Church", location: "Kakuma 3", members: 868 },
  { name: "Kalobeyei Village 1", location: "Kalobeyei", members: 400 },
  { name: "Clinic 7", location: "Kakuma", members: 250 },
  { name: "Kalobeyei Village 3", location: "Kalobeyei", members: 200 },
];

const pillars = [
  {
    titleKey: "vision.school.title",
    icon: SchoolIcon,
    descriptionKey: "vision.school.copy",
  },
  {
    titleKey: "vision.health.title",
    icon: HealthIcon,
    descriptionKey: "vision.health.copy",
  },
  {
    titleKey: "vision.home.title",
    icon: HomeIcon,
    descriptionKey: "vision.home.copy",
  },
  {
    titleKey: "vision.vocational.title",
    icon: ToolsIcon,
    descriptionKey: "vision.vocational.copy",
  },
  {
    titleKey: "vision.pa.title",
    icon: AudioIcon,
    descriptionKey: "vision.pa.copy",
  },
  {
    titleKey: "vision.feeding.title",
    icon: MealIcon,
    descriptionKey: "vision.feeding.copy",
  },
];

const homeHighlights = [
  "home.highlight.faith",
  "home.highlight.footprint",
  "home.highlight.expansion",
  "home.highlight.emergency",
  "home.highlight.rebuild",
  "home.highlight.urgent",
];

// Required milestone image path for the metal structure construction spotlight.
const milestoneImageSrc = milestoneImage;

const milestoneKeyFeatures = [
  "home.milestone.feature1",
  "home.milestone.feature2",
  "home.milestone.feature3",
];

// Event anchor used to describe storm timing dynamically as months/years pass.
const STORM_EVENT_DATE = new Date(2026, 2, 1);

function formatElapsedFrom(date, now = new Date()) {
  let totalMonths =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());

  // If the current month-day is earlier than the event day, back off one month.
  if (now.getDate() < date.getDate()) {
    totalMonths -= 1;
  }

  const safeMonths = Math.max(totalMonths, 0);

  if (safeMonths < 12) {
    return `${safeMonths} month${safeMonths === 1 ? "" : "s"}`;
  }

  const years = Math.floor(safeMonths / 12);
  const months = safeMonths % 12;

  if (months === 0) {
    return `${years} year${years === 1 ? "" : "s"}`;
  }

  return `${years} year${years === 1 ? "" : "s"} and ${months} month${months === 1 ? "" : "s"}`;
}

function buildPathwayAnimationOrder(cards) {
  if (!cards.length) {
    return [];
  }

  const sortedByTopThenLeft = [...cards].sort((a, b) => {
    if (Math.abs(a.top - b.top) < 24) {
      return a.left - b.left;
    }
    return a.top - b.top;
  });

  const rows = [];
  sortedByTopThenLeft.forEach((card) => {
    const lastRow = rows[rows.length - 1];
    if (!lastRow || Math.abs(lastRow.rowTop - card.top) > 36) {
      rows.push({ rowTop: card.top, cards: [card] });
      return;
    }
    lastRow.cards.push(card);
  });

  rows.forEach((row) => {
    row.cards.sort((a, b) => a.left - b.left);
  });

  return rows.flatMap((row, rowIndex) => {
    if (rows.length === 2) {
      return rowIndex === 0 ? row.cards : [...row.cards].reverse();
    }

    if (rows.length >= 3) {
      if (rowIndex === 0 || rowIndex === 1) {
        return row.cards;
      }
      return rowIndex % 2 === 0 ? [...row.cards].reverse() : row.cards;
    }

    return row.cards;
  });
}

function getProjectShowcaseMedia(project) {
  return (
    project.currentMedia?.find((media) => media.type === "image") ||
    project.dreamMedia?.find((media) => media.type === "image") ||
    project.currentMedia?.[0] ||
    project.dreamMedia?.[0] ||
    null
  );
}

export default function Home() {
  const { t } = useT();
  const [mainProject, ...secondaryProjects] = projectCatalog;
  const pathwaySectionRef = useRef(null);
  const pathwayCardRefs = useRef(new Map());
  const pathwayStepRef = useRef(0);
  const pathwayTimerRef = useRef(null);
  const [isPathwayInView, setIsPathwayInView] = useState(false);
  const [activePathwayKey, setActivePathwayKey] = useState("");
  const stormElapsedLabel = formatElapsedFrom(STORM_EVENT_DATE);
  const stormMonthLabel = STORM_EVENT_DATE.toLocaleString("en-US", {
    month: "long",
  });
  const stormYearLabel = STORM_EVENT_DATE.getFullYear();

  const allPathwayKeys = useMemo(() => {
    return [
      mainProject.slug,
      ...secondaryProjects.map((project) => project.slug),
    ];
  }, [mainProject.slug, secondaryProjects]);

  const setPathwayCardRef = useCallback((slug) => {
    return (node) => {
      if (node) {
        pathwayCardRefs.current.set(slug, node);
        return;
      }
      pathwayCardRefs.current.delete(slug);
    };
  }, []);

  useEffect(() => {
    const sectionNode = pathwaySectionRef.current;
    if (!sectionNode) {
      return;
    }

    // Partial and near-full viewport thresholds both count as in-view triggers.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPathwayInView(
          entry.isIntersecting && entry.intersectionRatio >= 0.14,
        );
      },
      {
        threshold: [0.14, 0.45, 0.9],
      },
    );

    observer.observe(sectionNode);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPathwayInView) {
      if (pathwayTimerRef.current) {
        clearTimeout(pathwayTimerRef.current);
      }
      setActivePathwayKey("");
      return;
    }

    let cancelled = false;

    const runStep = () => {
      if (cancelled) {
        return;
      }

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const visibleCards = allPathwayKeys
        .map((slug) => {
          const node = pathwayCardRefs.current.get(slug);
          if (!node) {
            return null;
          }

          const rect = node.getBoundingClientRect();
          const isPartiallyVisible =
            rect.bottom > 0 &&
            rect.top < viewportHeight &&
            rect.right > 0 &&
            rect.left < viewportWidth;
          if (!isPartiallyVisible) {
            return null;
          }

          return {
            slug,
            top: rect.top,
            left: rect.left,
          };
        })
        .filter(Boolean);

      const orderedVisibleCards = buildPathwayAnimationOrder(visibleCards);
      if (!orderedVisibleCards.length) {
        setActivePathwayKey("");
        pathwayTimerRef.current = setTimeout(runStep, 5440);
        return;
      }

      const nextCard =
        orderedVisibleCards[
          pathwayStepRef.current % orderedVisibleCards.length
        ];
      pathwayStepRef.current += 1;
      setActivePathwayKey(nextCard.slug);

      pathwayTimerRef.current = setTimeout(() => {
        setActivePathwayKey("");
        pathwayTimerRef.current = setTimeout(runStep, 4160);
      }, 16000);
    };

    runStep();

    return () => {
      cancelled = true;
      if (pathwayTimerRef.current) {
        clearTimeout(pathwayTimerRef.current);
      }
    };
  }, [allPathwayKeys, isPathwayInView]);

  return (
    <div className="bg-[#F7F4EF] text-[#2D3142]">
      {/* Hero section sets campaign tone with a Pinterest-inspired editorial portrait layout. */}
      <section
        id="home"
        className="relative min-h-[92vh] overflow-hidden bg-[#0B2F4A]"
      >
        <img
          src={heroImage}
          alt="Clinic 6 Mother Church worship background"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#041A2A]/85 via-[#0A4162]/60 to-[#041A2A]/88" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(72,180,228,0.30),transparent_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_72%,rgba(255,255,255,0.16),transparent_38%)]" />

        <div className="relative z-10 mx-auto grid min-h-[92vh] w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 py-20 lg:grid-cols-[0.95fr_1.45fr] lg:px-10">
          {/* Left narrative panel keeps copy highly readable over the atmospheric background. */}
          <div className="rounded-2xl border border-white/20 bg-[#041A2A]/55 p-6 text-center backdrop-blur-sm sm:p-8 lg:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#F0CD59]">
              {t("hero.eyebrow")}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              {t("hero.headline")}
            </h1>
            <p className="mt-5 max-w-2xl text-sm font-semibold leading-relaxed text-[#ECF6FF] sm:text-base lg:max-w-none">
              {t("hero.sub")}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#E5F2FF] sm:text-base lg:max-w-none">
              From the first roaring wind to the first steady hand, this film
              carries the truth of our journey in motion. Watch how Gospel
              courage transformed battered roofs and broken hope into a living
              promise of renewal.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <Link
                to="/give"
                className="cta-donate-pop inline-flex items-center justify-center rounded-sm bg-[#D4AF37] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#0F2942] transition hover:bg-yellow-400"
              >
                {t("hero.cta.give")} →
              </Link>
              <Link
                to="/our-story"
                className="cta-give-pop inline-flex items-center justify-center rounded-sm border border-white/50 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#D4AF37]"
              >
                {t("hero.cta.story")}
              </Link>
            </div>
          </div>

          {/* Right video frame brings the front page to life with firsthand storm footage. */}
          <figure className="group relative w-full overflow-hidden rounded-[28px] border border-white/35 bg-[#0A2436]/40 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.75)]">
            <video
              className="aspect-video w-full object-cover min-h-[420px]"
              src="/videos/first-storm.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03121F]/62 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-[#04263C]/78 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F9E9A3]">
              Storm Story in Motion
            </div>
            <figcaption className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/30 bg-[#03121F]/80 p-4 text-sm text-[#F1F7FF] backdrop-blur-sm">
              A moving witness to the first storm that shaped our church,
              captured in the moment when faith rose above the rain.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Stats strip provides immediate credibility and mission scale. */}
      <section className="border-y border-[#0F2942]/10 bg-white py-5">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-5 text-center sm:grid-cols-4 lg:px-10">
          <div>
            <p className="text-2xl font-black text-[#0F2942]">868</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D3142]/70">
              {t("stats.members")}
            </p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#0F2942]">2013</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D3142]/70">
              {t("stats.founded")}
            </p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#0F2942]">3</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D3142]/70">
              {t("stats.daughterChurches")}
            </p>
          </div>
          <div>
            <p className="text-base font-black text-[#0F2942]">
              {t("stats.approved")}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D3142]/70">
              {t("stats.riftValleyField")}
            </p>
          </div>
        </div>
      </section>

      {/* Urgency block makes the current need concrete before detailed storytelling. */}
      <section className="bg-[#F2E4C8] py-10">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2942]">
            {t("home.snapshot")}
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0F2942] sm:text-4xl">
            {t("home.urgentHighlights")}
          </h2>
          <ul className="mt-6 grid list-disc gap-3 pl-5 text-sm leading-relaxed text-[#2D3142] sm:grid-cols-2 sm:gap-x-8">
            {homeHighlights.map((item) => (
              <li key={item}>{t(item)}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Story section anchors nav "Our Story" and frames the storm timeline. */}
      <GlobalReveal
        as="section"
        id="story"
        className="bg-[#F7F4EF] py-16"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}
      >
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-10">
          <h2 className="text-3xl font-black text-[#0F2942] sm:text-4xl">
            {t("story.headline")}
          </h2>
          <p className="mt-5 max-w-4xl text-base leading-relaxed text-[#2D3142]/90">
            {t("story.body1")} (<em>"udongo"</em>) {t("story.body2")} (
            <em>"algoropa"</em>), {t("story.body3")} {t("home.stormWhen")}{" "}
            {stormMonthLabel} {stormYearLabel} ({stormElapsedLabel}).
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-[#0F2942]/15 bg-white shadow-sm">
              <img
                src={stormDamageImage}
                alt="2nd storm worn out building damage"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = stormDamageImage;
                }}
              />
              <figcaption className="border-t border-[#0F2942]/12 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#2D3142]">
                {t("home.stormDamageCaption")}
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-2xl border border-[#0F2942]/15 bg-white shadow-sm">
              <img
                src={metalBuildImage}
                alt="Welder and metal construction preparation"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="border-t border-[#0F2942]/12 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#2D3142]">
                {t("home.transitionCaption")}
              </figcaption>
            </figure>
          </div>
        </div>
      </GlobalReveal>

      <GlobalReveal
        as="section"
        id="infrastructure"
        className="bg-[#F8F1E2] py-16"
        style={{ contentVisibility: "auto", containIntrinsicSize: "1px 900px" }}
      >
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0F2942]">
            {t("home.footprint")}
          </p>
          <h3 className="mt-3 text-2xl font-black text-[#0F2942] sm:text-3xl">
            {t("home.lineageReach")}
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lineageMap.map((church, index) => (
              <article
                key={church.name}
                className={
                  "rounded-2xl border p-5 shadow-sm " +
                  (index === 0
                    ? "border-[#0F2942]/35 bg-[#0F2942] text-[#F5ECD9] lg:col-span-2"
                    : "border-[#0F2942]/20 bg-white text-[#0F2942]")
                }
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-75">
                  {index === 0
                    ? t("home.motherChurch")
                    : t("home.daughterChurch")}
                </p>
                <h4 className="mt-2 text-lg font-black">{church.name}</h4>
                <p className="mt-1 text-sm opacity-85">{church.location}</p>
                <p className="mt-4 text-2xl font-black">
                  {church.members} {t("stats.members")}
                </p>
              </article>
            ))}
          </div>
        </div>
      </GlobalReveal>

      {/* Mission section anchors nav "Mission" and ends with direct giving CTA. */}
      <GlobalReveal
        as="section"
        id="impact"
        className="bg-[#F7F4EF] py-16"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "1px 1100px",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0F2942]">
            {t("home.outreachPillars")}
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0F2942] sm:text-4xl">
            {t("vision.beyondSanctuary")}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#2D3142]/85">
            {t("vision.fivePillars")}
          </p>

          {/* Project milestone block highlights the permanent metal-frame sanctuary progress. */}
          <GlobalReveal className="mt-8 rounded-2xl border border-[#0F2942]/20 bg-[#F8F1E2] p-4 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]">
              {t("home.milestone")}
            </p>
            <h3 className="mt-2 text-2xl font-black text-[#0F2942] sm:text-3xl">
              {t("home.milestoneTitle")}
            </h3>
            <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#2D3142]/88 sm:text-base">
              {t("home.milestoneBody")}
            </p>

            <figure className="mt-5 overflow-hidden rounded-lg border border-[#0F2942]/25 bg-white shadow-sm">
              <img
                src={milestoneImageSrc}
                alt="Metal structure construction progress for the permanent sanctuary"
                className="aspect-video w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.01]"
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  // Fallback keeps the milestone visible until the requested file is added.
                  event.currentTarget.src = metalBuildImage;
                }}
              />
            </figure>

            {/* High-duty metal reference clarifies bolt-joined durability strategy for donors. */}
            <figure className="mt-5 overflow-hidden rounded-lg border border-[#0F2942]/25 bg-white shadow-sm">
              <img
                src={highDutyMetalImage}
                alt="High-duty metal quality and bolt-joining strategy for durable sanctuary construction"
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.01]"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="border-t border-[#0F2942]/12 px-4 py-3 text-xs leading-relaxed text-[#2D3142]/88">
                This high-duty metal reference shows the joining strategy
                planned for long-term durability: bolt-joined steel connections,
                reinforced load-transfer points, and anti-rust finishing to keep
                the sanctuary frame stable through wind, heat, and daily use.
                Supporting this phase means funding structure quality that
                protects worshippers for years, not a short-term fix.
              </figcaption>
            </figure>

            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#2D3142]/88">
              {milestoneKeyFeatures.map((item) => (
                <li key={item}>{t(item)}</li>
              ))}
            </ul>
          </GlobalReveal>

          {/* Vision section pairs the planned sanctuary image with a direct partnership call-to-action. */}
          <GlobalReveal className="mt-8 grid grid-cols-1 gap-6 rounded-2xl border border-[#0F2942]/20 bg-white p-4 sm:p-6 md:grid-cols-2 md:items-center">
            <figure className="relative overflow-hidden rounded-lg border border-[#0F2942]/35 bg-[#F8F1E2]">
              <img
                src={milestoneImageSrc}
                alt="Planned permanent dream sanctuary concept"
                className="aspect-video w-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  // Preserve visual continuity until the requested planned-image file is available.
                  event.currentTarget.src = metalBuildImage;
                }}
              />
              <div className="absolute inset-0 bg-[#1A2412]/12" />
              <figcaption className="absolute left-3 top-3 rounded-md border border-[#F5ECD9]/55 bg-[#0F2942]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#F5ECD9]">
                {t("home.plannedMilestone")}
              </figcaption>
            </figure>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F2942]">
                {t("home.futureVision")}
              </p>
              <h3 className="mt-2 text-2xl font-black text-[#0F2942] sm:text-3xl">
                {t("home.futureTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#2D3142]/88 sm:text-base">
                {t("home.futureBody1")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#2D3142]/88 sm:text-base">
                {t("home.futureBody2")}
              </p>
              <Link
                to="/give"
                className="cta-donate-pop mt-5 inline-flex items-center justify-center rounded-sm bg-[#D4AF37] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#0F2942] transition hover:bg-yellow-400"
              >
                {t("home.partnerWithUs")}
              </Link>
            </div>
          </GlobalReveal>

          {/* Staggered reveal guides the eye through each outreach pillar card. */}
          <GlobalReveal
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            staggerChildren={0.12}
          >
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <GlobalRevealItem
                  as="article"
                  key={pillar.titleKey}
                  className="group flex h-full flex-col rounded-2xl border border-[#0F2942]/20 bg-white p-6 text-[#0F2942] shadow-sm transition-all duration-300 ease-in-out will-change-transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2E4C8] text-[#0F2942] transition-colors duration-300 ease-in-out group-hover:bg-[#D4AF37]">
                    <Icon />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-[#0F2942]">
                    {t(pillar.titleKey)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#2D3142]/88">
                    {t(pillar.descriptionKey)}
                  </p>
                </GlobalRevealItem>
              );
            })}
          </GlobalReveal>

          {/* Funding priority cards now use a unified editorial grid with image-first hover overlays. */}
          <GlobalReveal className="mt-10 rounded-2xl border border-[#0F2942]/15 bg-white p-6 shadow-sm">
            <div ref={pathwaySectionRef} className="pathway-cards-stage">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0F2942]/70">
                Project Donation Pathways
              </p>
              <h3 className="mt-2 text-2xl font-black text-[#0F2942] sm:text-3xl">
                Main Urgent Need: Church Construction
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#2D3142]/88 sm:text-base">
                Church construction is the immediate priority for urgent
                donations. The following projects are also available as
                dedicated subpages with detailed objectives, funding use, and
                impact goals.
              </p>

              <div className="project-showcase-grid mt-6">
                {[mainProject, ...secondaryProjects].map((project, index) => {
                  const previewMedia = getProjectShowcaseMedia(project);
                  const isActive = activePathwayKey === project.slug;

                  return (
                    <Link
                      key={project.slug}
                      to={`/projects/${project.slug}`}
                      ref={setPathwayCardRef(project.slug)}
                      className={`project-showcase-card pathway-card ${isActive ? "pathway-card--active is-highlighted" : ""}`}
                    >
                      <div className="project-showcase-media">
                        {previewMedia?.type === "image" ? (
                          <img
                            src={previewMedia.src}
                            alt={previewMedia.alt || project.title}
                            loading="lazy"
                            decoding="async"
                            className="project-showcase-image"
                          />
                        ) : (
                          <div
                            className="project-showcase-fallback"
                            aria-hidden="true"
                          />
                        )}

                        <div className="project-showcase-scrim" />

                        <div className="project-showcase-badges">
                          <span className="project-showcase-badge project-showcase-badge--accent">
                            {index === 0 ? "Main Need" : "Project Brief"}
                          </span>
                          <span className="project-showcase-badge">
                            {project.urgency}
                          </span>
                        </div>

                        <div className="project-showcase-overlay">
                          <div>
                            <p className="project-showcase-kicker">
                              {project.urgency} priority
                            </p>
                            <h4 className="project-showcase-title">
                              {project.title}
                            </h4>
                            <p className="project-showcase-summary">
                              {project.shortSummary}
                            </p>
                          </div>

                          <div className="project-showcase-footer">
                            <div
                              className="project-showcase-actions"
                              aria-hidden="true"
                            >
                              <span className="project-showcase-action">
                                <HeartIcon />
                                Support
                              </span>
                              <span className="project-showcase-action">
                                <EyeIcon />
                                Preview
                              </span>
                            </div>

                            <span className="project-showcase-cta">
                              View project
                              <ArrowUpRightIcon />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </GlobalReveal>

          <div className="mt-10 rounded-2xl border border-[#D4AF37]/50 bg-[#0F2942] px-6 py-8 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              {t("give.partnerWith")}
            </p>
            <h3 className="mt-2 text-2xl font-black sm:text-3xl">
              {t("give.giftTurnsPrayer")}
            </h3>
            <p className="mt-3 max-w-3xl text-sm text-white/85 sm:text-base">
              {t("give.everyContribution")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/give"
                className="inline-flex items-center justify-center rounded-sm bg-[#D4AF37] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#0F2942] transition hover:bg-yellow-400"
              >
                {t("give.viewChannels")} →
              </Link>
              <Link
                to="/seating"
                className="inline-flex items-center justify-center rounded-sm border border-white/55 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-[#0F2942]"
              >
                {t("give.sponsorSeat")}
              </Link>
            </div>
          </div>
        </div>
      </GlobalReveal>
    </div>
  );
}
