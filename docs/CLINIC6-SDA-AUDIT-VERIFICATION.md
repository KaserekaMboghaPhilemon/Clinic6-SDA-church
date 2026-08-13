# Clinic 6 SDA Repository Audit Verification

## Purpose

This document verifies the current repository contents against the master upgrade specification in `docs/CLINIC6-SDA-MASTER-UPGRADE-SPECIFICATION.md`. It is audit-only and does not include any code changes.

## 1. Technology Stack Verification

Confirmed in `package.json`:

- React `^19.2.0`
- Vite `^7.3.1`
- Tailwind CSS `^3.4.17`
- Framer Motion `^12.38.0`
- React Router DOM `^7.13.1`
- `qrcode.react` for QR rendering
- `i18next` and `react-i18next` present as dependencies, though actual translation is implemented in `src/i18n.jsx` and `src/translations.js`

Build/tooling files present:

- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `eslint.config.js`

Deployment config:

- `render.yaml` configured for static hosting with `npm ci && npm run build` and `dist` publish path.

## 2. Runtime Architecture Verification

Confirmed:

- The repository is frontend-only.
- `src/main.jsx` mounts `App` and imports `index.css`.
- `src/App.jsx` provides client-side routing under `BrowserRouter`.
- No backend or admin portal implementation exists in this repo.

### Active route graph in `src/App.jsx`

- `/` → `Home` page
- `/our-story` → `OurStory` page
- `/projects/:projectSlug` → `ProjectDetail` page
- `/seating` → `SeatingPage`
- `/give` → `DonatePage`
- `/contact` → `Contact` page
- `/media` → composite view of `MediaCenter`, `ChurchTimeline`, and `JordanFeature`
- `*` → custom 404 `NotFound`

This matches the current spec section on active route graph.

## 3. Code and Page Verification

### `App.jsx`

- `App.jsx` also contains scroll management for hash navigation and a fixed top marquee banner.
- It renders `Header`, `Footer`, and `StickyActionBar` across every route.
- `Media` route is a single route rendering three components together rather than separate nested routes.

### `DonatePage.jsx`

- Confirmed as the primary donation flow with the most complex business logic.
- Includes:
  - currency conversion engine
  - donation tiers and custom amount handling
  - project selection from `projectCatalog`
  - QR code rendering via `qrcode.react`
  - form submission and status handling
  - network calls to external services and to `/api/*`

- Confirmed backend assumptions that are unsupported in this repo:
  - `fetch('https://open.er-api.com/v6/latest/USD', ...)`
  - `fetch('/api/payments/status/${ref}')`
  - `fetch('/api/payments/mpesa/initiate', ...)`

### `src/i18n.jsx` and `src/translations.js`

- `src/i18n.jsx` is the active language provider and contains English, French, and Swahili dictionary keys.
- `src/translations.js` is a parallel translation file used by some donation UI fragments.
- Translation flow is fragmented across `i18n.jsx` and `translations.js`, confirming the spec's note about split localization sources.

### `Home.jsx`

- Uses `projectCatalog` as a content source for featured project previews.
- Contains hero messaging, urgency sections, mission snapshots, and direct CTAs.
- Includes in-page anchor navigation for the landing page.

### `ProjectDetail.jsx`

- Renders a project page by slug from `projectCatalog`.
- Uses the project slug to build a donation link to `/give` with query parameters.
- Displays project budget items, current media, and related projects.

### `SeatingPage.jsx`

- Standalone page and embedded `SeatingSection` component.
- Contains seat sponsorship tiers and hardcoded Paybill instructions.
- Uses `href="#give"` anchor inside its cards, which is not aligned with the actual route-based donation entry point.

### `Contact.jsx`

- Confirms payment and contact details.
- Uses `clinic6.sda.kakuma@gmail.com` while other site content references `clinic6sdachurch@gmail.com`, indicating inconsistent contact messaging.
- Includes an embedded `MapJourney` component.

### `Header.jsx`, `Footer.jsx`, and `StickyActionBar.jsx`

- `Header.jsx` implements hybrid anchor/route navigation and a language dropdown.
- `Footer.jsx` contains quick links to broken or mismatched routes:
  - `/ourstory` (should be `/our-story`)
  - `/projects` (no active `/projects` route exists)
  - `/donate` (active donation route is `/give`)
  - `/privacy` (no `/privacy` route defined in `App.jsx`)
- `StickyActionBar.jsx` provides a persistent Paybill CTA linking to `/give`.

### Legacy / orphaned content

- `src/LandingPage.jsx` is not mounted by any active route.
- `src/MissionImpact.jsx` is only referenced inside `LandingPage.jsx`.
- `src/DonationPortal.jsx`, `src/GivingGateway.jsx`, `src/PaymentPortal.jsx`, and `src/pages/Donation.jsx` are alternate or legacy donation prototypes not routed by `App.jsx`.
- `src/components/Navbar.jsx` and `src/components/Slideshow.jsx` appear unused by the active route tree.
- `src/styles/` and `main.css` are legacy style layers likely overlapping Tailwind usage.

## 4. Asset and Media Verification

Confirmed asset locations:

- Bundled image assets under `src/assets/`.
- Video assets under `public/videos/`.
- `public/videos/first-storm.mp4` is included and referenced by the app.

Media risk areas:

- `projectCatalog.js` contains `currentMedia` and `dreamMedia` entries that reference `/src/assets/...` asset paths. These are resolved through a local map in `resolveAssetPath`.
- `JordanFeature.jsx` depends on an externally hosted Pinterest image, which is a brittle remote dependency.
- Some video imports are commented out in `MediaCenter.jsx`, indicating unused or legacy media handling.
- `Contact.jsx` uses `MapJourney`, which may depend on a local video asset and should be audited for missing media, but the component itself is present.

## 5. Payment and Business Logic Verification

Confirmed hardcoded payment details across multiple files:

- Paybill: `247247`
- Account: `105225`
- Bank: `Equity Bank Kenya Limited`
- SWIFT: `EQBLKENAXXX`
- `DonatePage.jsx` includes paybill and bank credentials plus project selection logic.

Confirmed business logic risks:

- Donation flow mixes UI, localization, payment rules, and backend assumptions in one page.
- Multiple copy sources (`src/i18n.jsx` and `src/translations.js`) increase translation maintenance risk.
- `DonatePage.jsx` attempts payment polling and API calls with no backend present in this repo.
- `SeatingPage.jsx` and `StickyActionBar.jsx` duplicate donation instructions.

## 6. Routing and Link Integrity

Confirmed mismatches / broken links:

- `Footer.jsx` links to `/ourstory` but actual route is `/our-story`.
- `Footer.jsx` links to `/projects` but no `/projects` route exists; only `/projects/:projectSlug` is mounted.
- `Footer.jsx` links to `/donate` but active donation route is `/give`.
- `Footer.jsx` links to `/privacy` but no such route exists in `App.jsx`.
- `Header.jsx` and most route-based CTAs correctly target `/give`, `/seating`, `/our-story`, `/contact`, and `/media`.

## 7. Spec Confirmation Summary

Verified correct elements from the master spec:

- Frontend-only SPA architecture is accurate.
- Active route graph in `App.jsx` matches the reported set of public pages.
- `DonatePage.jsx` is the current canonical giving experience.
- `projectCatalog.js` is the static business data source for fundraising projects.
- `i18n.jsx` is the active language context provider.
- `render.yaml` is configured for static SPA hosting.

Discrepancies / implementation gaps relative to the spec:

- No backend or admin portal exists in the repository.
- Backend payment endpoints referenced by `DonatePage.jsx` are absent.
- Several legacy/unused pages and components remain in the repo.
- Footer quick links are inconsistent with current route paths.
- Translation content is split between `i18n.jsx` and `translations.js`.
- Contact email addresses differ across pages.
- Remote image dependency in `JordanFeature.jsx` introduces a brittle external asset.

## 8. Recommended Audit Findings

From the repository verification, these areas should be treated as confirmed issues for follow-up:

- `DonatePage.jsx` assumes a backend that is not present.
- `Footer.jsx` contains broken route links.
- Legacy pages and components are present but not mounted or part of the active route graph.
- Translation and content sources are inconsistent.
- Payment and contact information are duplicated in multiple files.

## 9. Notes

This audit was conducted without modifying code and using only repository inspection. The findings reflect the current state of the workspace at the time of analysis.
