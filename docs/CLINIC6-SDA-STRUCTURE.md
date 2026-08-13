# Clinic 6 SDA Repository Structure Plan

## 1. Purpose

This document defines the planned repository structure for the incremental Clinic 6 platform migration. It describes the current frontend-only layout and the proposed target structure for the future platform, including the public website, backend API, admin portal, database/Prisma, authentication, payment, media, notification, and reporting code.

## 2. Current Repository Structure

The current repository is a working frontend-only React/Vite SPA. The important existing frontend structure is:

- `index.html`
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `eslint.config.js`
- `render.yaml`
- `README.md`
- `public/`
  - `_redirects`
  - `Component/`
  - `videos/`
- `src/`
  - `App.jsx`
  - `main.jsx`
  - `index.css`
  - `App.css`
  - `main.css`
  - `Header.jsx`
  - `Footer.jsx`
  - `StickyActionBar.jsx`
  - `DonatePage.jsx`
  - `SeatingPage.jsx`
  - `Contact.jsx`
  - `MediaCenter.jsx`
  - `ChurchTimeline.jsx`
  - `JordanFeature.jsx`
  - `LandingPage.jsx`
  - `MissionImpact.jsx`
  - `DonationPortal.jsx`
  - `GivingGateway.jsx`
  - `PaymentPortal.jsx`
  - `i18n.jsx`
  - `translations.js`
  - `data/`
  - `assets/`
  - `components/`
  - `layouts/`
  - `styles/`
  - `utils/`

The current public site routes are:

- `/`
- `/our-story`
- `/projects/:projectSlug`
- `/seating`
- `/give`
- `/contact`
- `/media`

The current frontend must remain intact during this planning task.

## 3. Target Repository Structure

The proposed future repository structure is adapted to the architecture and the goals of incremental migration. It preserves the existing frontend while creating a clean separation for future backend and admin portal work.

CLINIC6-SDA/
├── frontend/
│ ├── public-site/
│ │ ├── src/
│ │ │ ├── components/
│ │ │ ├── pages/
│ │ │ ├── layouts/
│ │ │ ├── data/
│ │ │ ├── assets/
│ │ │ ├── styles/
│ │ │ ├── utils/
│ │ │ ├── i18n/
│ │ │ ├── services/
│ │ │ └── App.jsx
│ │ ├── public/
│ │ ├── package.json
│ │ ├── vite.config.js
│ │ ├── tailwind.config.js
│ │ └── postcss.config.js
│ └── admin-portal/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── layouts/
│ │ ├── services/
│ │ ├── utils/
│ │ ├── i18n/
│ │ └── App.jsx
│ ├── public/
│ ├── package.json
│ ├── vite.config.js
│ └── tailwind.config.js
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── utils/
│ │ ├── validation/
│ │ ├── auth/
│ │ ├── domain/
│ │ └── index.js
│ ├── prisma/
│ │ ├── schema.prisma
│ │ └── migrations/
│ ├── tests/
│ ├── package.json
│ └── .env.example
├── docs/
│ ├── CLINIC6-SDA-MASTER-UPGRADE-SPECIFICATION.md
│ ├── CLINIC6-SDA-AUDIT-VERIFICATION.md
│ ├── CLINIC6-SDA-INCREMENTAL-IMPLEMENTATION-PLAN.md
│ ├── CLINIC6-SDA-ARCHITECTURE.md
│ └── CLINIC6-SDA-STRUCTURE.md
└── README.md

This structure is intentionally modular and incremental. The existing current frontend may remain at the repository root until migration into `frontend/public-site/` is explicitly approved and planned.

## 4. Frontend Structure

### Public Website

The public website is the current baseline and will remain the primary frontend until backend migration begins. It consists of:

- `src/App.jsx` — route shell and layout
- route pages: `Home`, `OurStory`, `ProjectDetail`, `SeatingPage`, `DonatePage`, `Contact`, `Media`
- shared UI: `Header.jsx`, `Footer.jsx`, `StickyActionBar.jsx`
- static content and data: `src/data/projectCatalog.js`
- translations: `src/i18n.jsx` and `src/translations.js`
- assets: `src/assets/`, `public/videos/`
- utilities: `src/utils/`

### Admin Portal

The admin portal is a future separate frontend application. It will live under `frontend/admin-portal/` and share patterns with the public site where appropriate, but it will be developed as a distinct app with its own routes, pages, and components.

### Shared Frontend Concerns

Where appropriate, shared concerns may be maintained in a common frontend layer later, but only after the public site and admin portal are both defined. Shared concerns may include:

- common UI components
- shared service layer utilities
- shared i18n helpers
- shared asset loading helpers

### Components

Public site components remain in the existing `src/components/` and `src/layouts/` folders until a migration path is defined.

### Pages / Routes

The current route-based pages and their routes must remain intact during planning and early migration.

### Assets / Media

Current assets remain in `src/assets/` and `public/videos/`. The future public site and admin portal may continue to reference the same assets until migration to a managed media layer is ready.

### i18n / Translations

The current multilingual infrastructure is in `src/i18n.jsx` and `src/translations.js`. The future frontend structure will preserve frontend translation consumption while moving auth and backend-backed data to API-driven services.

### API Service Layer

A future frontend service layer will be introduced as part of migration. It will live under `src/services/` in the public site and admin portal and will consume backend API endpoints rather than containing business logic.

### Frontend Tests

Frontend tests will be added under `frontend/public-site/tests/` and `frontend/admin-portal/tests/` as the platforms mature. Existing application behavior remains unchanged until tests are introduced.

## 5. Backend Structure

The backend will be a separate service living under `backend/`.

### Planned backend locations

- `backend/src/index.js` — Express entrypoint
- `backend/src/config/` — environment and runtime configuration
- `backend/src/controllers/` — request handlers and endpoint orchestration
- `backend/src/middleware/` — authentication, authorization, validation, error handling, security
- `backend/src/routes/` — API route definitions
- `backend/src/services/` — business logic and domain operations
- `backend/src/utils/` — helpers, response formatting, logging
- `backend/src/validation/` — request validation schemas and rules
- `backend/src/auth/` — authentication and authorization utilities
- `backend/src/domain/` — domain models, shared business rules, aggregates
- `backend/tests/` — backend unit and integration tests

This planning task does not create any backend code or install dependencies.

## 6. Database and Prisma Structure

The database and Prisma artifacts are planned to live under the backend service.

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/`

The current task does not create any Prisma files.

## 7. Authentication and RBAC Boundary

Authentication and authorization belong on the backend.

- backend-owned: authentication flows, JWT/session handling, password and token security, RBAC rules, permission checks
- frontend-owned: consuming authenticated API capabilities and rendering protected UI
- secrets must never be stored in frontend source code
- frontend should only hold token references in secure, appropriate client storage after backend issuance

The frontend consumes backend authorization decisions through API responses and access control metadata; it does not implement business-critical auth logic.

## 8. Payment Boundary

Payment provider integrations belong on the backend.

- public frontend collects donor input and displays donation flow UI only
- backend communicates with payment providers and verification services
- provider secrets remain server-side only
- payment status is authoritative only after backend verification
- no real payment credentials should be added as part of this planning task

## 9. Media and Asset Structure

Current authentic media remains in place:

- existing `src/assets/`
- existing `public/videos/`

Planned future media handling:

- managed media metadata in the backend database
- admin-uploaded media stored in a managed media layer or object storage
- construction progress media captured through admin workflows
- public content assets served through the public frontend or a CDN

No current media files are moved or deleted during this planning task.

## 10. Notifications

Future notification services will live as backend services and integrations.

Planned backend notification locations:

- `backend/src/services/notification/`
- `backend/src/config/` for notification provider settings
- `backend/src/utils/` for template rendering and delivery helpers

Notification types include:

- email notifications
- SMS or messaging notifications
- donor/payment notifications
- administrative notifications

No notification services are implemented in this task.

## 11. Reporting and Transparency

Future reporting logic and transparency data will belong to the backend and database.

Planned areas:

- internal/admin reporting: backend reporting services, admin portal dashboards
- public transparency: backend public endpoints for approved transparency data
- financial data access: controlled by backend APIs and RBAC
- audit data: backend audit logging and restricted access

Public transparency pages will consume backend APIs and will not directly expose raw financial records.

## 12. API Boundary

The planned relationship is:

Public React Website
↓
Backend API
↓
Services / Business Logic
↓
Prisma
↓
PostgreSQL

The Admin Portal will also consume the backend API:

Admin Portal
↓
Backend API
↓
Services / Business Logic
↓
Prisma
↓
PostgreSQL

This boundary keeps the backend as the source of truth for data, business rules, payments, and authorization.

## 13. Environment and Secrets

Environment configuration belongs in backend environment files and deployment secrets.

- backend `.env.example` is a template only
- never commit real secrets
- never expose database credentials to the frontend
- never expose payment provider secrets to the frontend
- never hardcode production credentials in source control

The frontend may use non-sensitive runtime values only after the backend securely exposes them.

## 14. Deployment Boundary

The planned deployment separation is:

- public frontend deployment for the public website
- admin frontend deployment for the admin portal if applicable
- backend deployment for API and services
- PostgreSQL/database hosting separate from frontend hosting
- external payment/notification services integrated through backend

The current Render configuration is preserved until migration is explicitly approved.

## 15. Migration Strategy

The current frontend will migrate gradually toward the target architecture:

- preserve existing routes
- preserve existing content
- preserve multilingual support
- preserve authentic media
- introduce backend functionality incrementally
- migrate one feature at a time
- keep static data until API replacements are proven
- avoid breaking the public website

The public site remains the baseline throughout the migration.

## 16. Legacy File Strategy

Legacy files must not be deleted during this phase.

They must first be:

1. identified
2. searched for references
3. marked as legacy/deprecated in documentation
4. replaced and tested
5. removed only after explicit approval

This document does not delete or move any legacy files.

## 17. Ownership Matrix

| Concern            | Owner                                    |
| ------------------ | ---------------------------------------- |
| Public content     | Public frontend                          |
| Admin UI           | Admin frontend                           |
| Business logic     | Backend                                  |
| Authentication     | Backend                                  |
| Authorization/RBAC | Backend                                  |
| Financial records  | Database/backend                         |
| Payments           | Backend/payment services                 |
| Media metadata     | Backend                                  |
| Media assets       | Frontend + backend-managed media storage |
| Reporting          | Backend/reporting layer                  |
| Translations       | Frontend/i18n initially                  |
| Secrets            | Deployment/backend environment           |

## 18. Current-to-Target Mapping

The existing frontend structure maps into the future structure as follows:

- current `src/` → future `frontend/public-site/src/`
- current `public/` → future `frontend/public-site/public/`
- current `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js` → future `frontend/public-site/`
- future `frontend/admin-portal/` will be a separate app for administrative workflows
- future `backend/` will contain Express, API routes, services, Prisma, and database-related code
- future `backend/prisma/` will contain schema and migrations while the current frontend remains unchanged

No current files are moved or renamed by this task.

## 19. Constraints and Non-Goals

This task does NOT do any of the following:

- no backend creation
- no Express installation
- no database creation
- no Prisma installation
- no authentication implementation
- no payment integration
- no admin portal implementation
- no frontend redesign
- no route replacement
- no legacy deletion
- no production deployment

## 20. Acceptance Criteria

- `docs/CLINIC6-SDA-STRUCTURE.md` exists.
- The structure aligns with the master upgrade specification and audit verification.
- Existing frontend remains unchanged.
- No packages were installed.
- No backend was created.
- No routes were changed.
- No files were deleted or moved.
- Migration boundaries are documented.
- The document is ready for review before TASK 2.1.

---

### Notes

- `docs/CLINIC6-SDA-ARCHITECTURE.md` was referenced by the task instructions but is not present in the repository. This structure plan is based on the authoritative specification and audit verification documents that are present.
