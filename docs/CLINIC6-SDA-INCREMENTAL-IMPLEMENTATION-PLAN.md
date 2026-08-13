# Clinic 6 SDA Incremental Implementation Plan

## 1. Development Principles

- Preserve the existing public website, its routes, content, media, and multilingual support.
- Develop incrementally, one task at a time.
- Keep each task small, testable, and reviewable.
- Do not start backend, database, auth, payment, or major redesign work until the foundation tasks are complete.
- Treat the audit verification and master specification as authoritative.
- Avoid removing legacy files until their usage and dependencies are verified.
- Do not invent or hardcode production financial data.
- Keep payment provider secrets and backend credentials off the frontend.
- Do not replace working functionality without a clear migration path.

## 2. Current Verified Baseline

The current repository is a frontend-only SPA with:

- React 19 + Vite 7 + Tailwind CSS 3
- `App.jsx` client-side routing with routes:
  - `/`
  - `/our-story`
  - `/projects/:projectSlug`
  - `/seating`
  - `/give`
  - `/contact`
  - `/media`
- `DonatePage.jsx` as the active donation page with unsupported backend payment assumptions.
- Static business data in `src/data/projectCatalog.js`.
- Multilingual support via `src/i18n.jsx` and supplementary `src/translations.js`.
- Static assets in `src/assets/` and `public/videos/`.
- Legacy/orphaned prototypes and components still present.
- Render deployment configuration via `render.yaml`.

## 3. Target Architecture

The future platform will consist of:

- Public React website
- Node.js + Express backend API
- PostgreSQL database
- Prisma ORM
- Secure authentication
- RBAC authorization
- Admin portal
- Donation management
- Donor management
- Pledge management
- Payment records and verification
- Budget management
- Expense management
- Construction management
- Materials management
- Volunteer management
- Seating sponsorship
- Receipts
- Notifications
- Reports
- Public transparency
- Audit logging
- Structured media and asset management
- Human-centered frontend redesign
- Testing, accessibility, performance, and production hardening

## 4. Phase Roadmap

### PHASE 0: Audit and Baseline

- Confirm repository state and document active routes, payment assumptions, and asset dependencies.

### PHASE 1: Architecture and Documentation

- Define architecture, folder layout, API boundaries, domain entities, and migration strategy.

### PHASE 2: Backend Foundation

- Create backend project structure and API foundation.

### PHASE 3: Detailed Domain/Database Design

- Design the Prisma schema and domain models.

### PHASE 4: PostgreSQL + Prisma

- Install and configure PostgreSQL and Prisma, then create migrations.

### PHASE 5: Authentication + RBAC

- Add secure user auth and role-based access.

### PHASE 6: Donors + Pledges + Payments

- Build donors, pledges, payment records, and verification endpoints.

### PHASE 7: Budget + Expenses

- Add budget and expense management.

### PHASE 8: Construction + Progress

- Add construction phases, progress updates, and status tracking.

### PHASE 9: Materials + Volunteers + Seating Sponsorship

- Add materials, volunteers, seating sponsorship, and related entities.

### PHASE 10: Receipts + Notification Architecture

- Build receipts, notifications, and messaging infrastructure.

### PHASE 11: Admin Portal

- Create the admin portal and management UI.

### PHASE 12: Public API Integration

- Expose public API endpoints and migrate frontend features.

### PHASE 13: Giving Experience Consolidation

- Consolidate donation experience around the backend and reduce static assumptions.

### PHASE 14: Public Transparency + Reporting

- Build reporting and transparency pages.

### PHASE 15: Human-Centered Frontend Redesign

- Apply the redesigned frontend gradually while preserving content.

### PHASE 16: Testing + Accessibility + Performance

- Add tests, accessibility audits, and performance hardening.

### PHASE 17: Production Hardening + Deployment

- Finalize production deployment, secrets, monitoring, and release readiness.

## 5. Detailed Task List

### PHASE 0: Audit and Baseline

#### TASK 0.1: Confirm active route graph and link integrity

- Objective: Verify the current active routes, broken links, and anchor behavior.
- Why: Ensures the migration preserves the public website experience.
- Dependencies: Existing `App.jsx`, `Header.jsx`, `Footer.jsx`, route pages.
- Files to create: None.
- Files to modify: None.
- Files that must not be modified: Core route pages unless needed for verification.
- Implementation requirements: Review route definitions and link targets; document broken/mismatched routes.
- Expected behavior: A verified route map and documented mismatches.
- Testing requirements: Manual navigation through each current public route.
- Acceptance criteria: Route graph documented and anomalies listed.
- Risks: Missing a hidden route reference.
- Rollback/Recovery: None required; no changes.

#### TASK 0.2: Catalog legacy assets and component usage

- Objective: Identify legacy files, components, and media dependencies without deleting them.
- Why: Prevent accidental removal of still-used content.
- Dependencies: Repository source files and asset imports.
- Files to modify: None.
- Implementation requirements: Search for references and record dependencies.
- Expected behavior: A catalog of legacy candidates plus usage status.
- Testing requirements: Confirm search results and cross-references.
- Acceptance criteria: Legacy file list with verified usage status.
- Risks: Misclassifying a still-needed file.
- Rollback/Recovery: None required.

### PHASE 1: Architecture and Documentation

#### TASK 1.1: Document the architecture and project boundaries

- Objective: Produce a formal architecture document that separates frontend, backend, database, auth, payments, and reporting.
- Why: Provides a shared blueprint before any code is written.
- Dependencies: `docs/CLINIC6-SDA-MASTER-UPGRADE-SPECIFICATION.md` and `docs/CLINIC6-SDA-AUDIT-VERIFICATION.md`.
- Files to create: `docs/CLINIC6-SDA-ARCHITECTURE.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Define boundaries, service responsibilities, and incremental migration constraints.
- Expected behavior: A clear architecture document.
- Testing requirements: Review with the team for correctness.
- Acceptance criteria: Architecture document approved and aligned with master specification.
- Risks: Overlooking a dependency or scope detail.
- Rollback/Recovery: Revise document.

#### TASK 1.2: Define the backend and frontend folder structure

- Objective: Create the directory plan for `backend/`, `frontend/`, and shared artifacts.
- Why: Ensures the repository can host both legacy frontend and new backend without conflict.
- Dependencies: Project architecture definition.
- Files to create: `docs/CLINIC6-SDA-STRUCTURE.md`.
- Files to modify: None.
- Implementation requirements: Propose folder layout, config boundaries, and migration path.
- Expected behavior: A documented directory structure plan.
- Testing requirements: Review for feasibility against existing repo.
- Acceptance criteria: Directory plan accepted.
- Risks: Creating an impractical layout.
- Rollback/Recovery: Refine plan.

### PHASE 2: Backend Foundation

#### TASK 2.1: Initialize backend directory and package manifest

- Objective: Create `backend/` and a minimal `package.json` for the Node.js API.
- Why: Provides the foundation for backend development without touching the frontend.
- Dependencies: Architecture and structure docs.
- Files to create: `backend/package.json`, `backend/README.md`.
- Files to modify: None.
- Files that must not be modified: Frontend source files.
- Implementation requirements: Define scripts for `dev`, `start`, and `lint`.
- Expected behavior: Clean backend package ready for dependencies.
- Testing requirements: `npm install` not executed yet; simply verify the manifest.
- Acceptance criteria: Backend package manifest exists and follows conventions.
- Risks: None if no install executed.
- Rollback/Recovery: Delete backend files if needed.

#### TASK 2.2: Add Express server skeleton and health endpoint

- Objective: Create the backend entrypoint with Express and a health check route.
- Why: Provides a safe backend starting point for future endpoints.
- Dependencies: `backend/package.json`.
- Files to create: `backend/src/index.js`, `backend/src/routes/health.js`.
- Files to modify: None.
- Files that must not be modified: Frontend source files.
- Implementation requirements: Add a `/health` endpoint returning JSON.
- Expected behavior: Backend can start and respond to `/health`.
- Testing requirements: Verify endpoint with a simple request.
- Acceptance criteria: Health endpoint defined and reachable in development.
- Risks: Minimal.
- Rollback/Recovery: Remove backend files.

#### TASK 2.3: Add backend configuration and environment loading

- Objective: Add a config layer that reads runtime settings from environment variables.
- Why: Prepares for secure credentials and runtime portability.
- Dependencies: Backend foundation.
- Files to create: `backend/src/config.js`, `.env.example` in `backend/`.
- Files to modify: `backend/src/index.js`.
- Files that must not be modified: Frontend source files.
- Implementation requirements: Support `PORT`, `NODE_ENV`, and database/secret placeholders.
- Expected behavior: Config module centralizes settings.
- Testing requirements: Verify config values load without secrets.
- Acceptance criteria: Config module works and example env file exists.
- Risks: None if no secrets are added.
- Rollback/Recovery: Remove backend config files.

#### TASK 2.4: Add backend security middleware and basic request logging

- Objective: Add CORS, JSON body parsing, helmet, and request logging foundation.
- Why: Protects the API and provides observability.
- Dependencies: Express server skeleton.
- Files to create: `backend/src/middleware/security.js`, `backend/src/middleware/logger.js`.
- Files to modify: `backend/src/index.js`.
- Files that must not be modified: Frontend source files.
- Implementation requirements: Configure CORS for the public site and JSON parsing.
- Expected behavior: Backend uses security middleware and logs requests.
- Testing requirements: Validate startup and no runtime errors.
- Acceptance criteria: Middleware is integrated with the server.
- Risks: None if configured conservatively.
- Rollback/Recovery: Remove middleware files.

#### TASK 2.5: Add backend error handling and centralized API response format

- Objective: Add a global error handler and consistent API response structure.
- Why: Prepares the backend for safe, maintainable API growth.
- Dependencies: Express server skeleton.
- Files to create: `backend/src/middleware/errorHandler.js`, `backend/src/utils/apiResponse.js`.
- Files to modify: `backend/src/index.js`.
- Files that must not be modified: Frontend source files.
- Implementation requirements: Return `{ status, data, error }` responses.
- Expected behavior: Errors are normalized and do not leak stack traces in production.
- Testing requirements: Simulate an error route if desired.
- Acceptance criteria: Error handling is wired and consistent.
- Risks: Low.
- Rollback/Recovery: Remove error middleware.

### PHASE 3: Detailed Domain/Database Design

#### TASK 3.1: Draft the Prisma schema and entity relationship plan

- Objective: Design the domain model and Prisma schema based on the customer requirements.
- Why: Prevents schema mistakes before migrations are created.
- Dependencies: Master spec, audit document, backend architecture.
- Files to create: `docs/CLINIC6-SDA-PRISMA-SCHEMA-DESIGN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Define entities, relationships, constraints, status fields, and indexes.
- Expected behavior: A detailed schema design document.
- Testing requirements: Review with stakeholders.
- Acceptance criteria: Schema design approved for Prisma migration.
- Risks: Missing a required relationship.
- Rollback/Recovery: Revise design.

#### TASK 3.2: Define domain state and status models for payments, pledges, and construction

- Objective: Specify lifecycle states for payments, pledges, expenses, and project progress.
- Why: Ensures backend business rules can be implemented consistently.
- Dependencies: Domain model draft.
- Files to create: `docs/CLINIC6-SDA-DOMAINS.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Document enums, statuses, and workflows.
- Expected behavior: Clear state diagrams or definitions.
- Testing requirements: Review for completeness.
- Acceptance criteria: State design accepted.
- Risks: Overcomplicating or missing states.
- Rollback/Recovery: Refine definitions.

#### TASK 3.3: Plan backend APIs for public site and admin portal

- Objective: Define the initial API contract for donor, project, payment, and admin endpoints.
- Why: Guides backend development and frontend migration.
- Dependencies: Domain model and architecture docs.
- Files to create: `docs/CLINIC6-SDA-API-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: List endpoints, request/response shapes, authentication requirements.
- Expected behavior: A documented API plan aligned with public and admin needs.
- Testing requirements: Review API plan for completeness.
- Acceptance criteria: API plan accepted.
- Risks: API scope mismatch.
- Rollback/Recovery: Revise plan.

### PHASE 4: PostgreSQL + Prisma

#### TASK 4.1: Add Prisma to backend dependencies and initialize schema

- Objective: Add Prisma tooling and create the initial schema file.
- Why: Prepares database migration capability.
- Dependencies: Backend foundation and Prisma schema design.
- Files to create: `backend/prisma/schema.prisma`, `backend/.env.example` update.
- Files to modify: `backend/package.json`.
- Files that must not be modified: Frontend source files.
- Implementation requirements: Use `provider = "postgresql"`, define datasource and generator.
- Expected behavior: Backend can later run Prisma migrations.
- Testing requirements: Validate schema file syntax manually.
- Acceptance criteria: Schema file exists and is syntactically valid.
- Risks: None if the file is only created, not migrated.
- Rollback/Recovery: Delete schema file.

#### TASK 4.2: Create the first Prisma migration plan document

- Objective: Document the first migration steps and database objects.
- Why: Ensures migration readiness before execution.
- Dependencies: Prisma schema file.
- Files to create: `docs/CLINIC6-SDA-PRISMA-MIGRATION-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Describe initial tables, indexes, and constraints.
- Expected behavior: A clear migration plan.
- Testing requirements: Peer review.
- Acceptance criteria: Migration plan accepted.
- Risks: None.
- Rollback/Recovery: Refine plan.

### PHASE 5: Authentication + RBAC

#### TASK 5.1: Design the auth and RBAC model

- Objective: Define user, role, and permission models for the admin portal and API.
- Why: Creates a secure authorization foundation before code.
- Dependencies: Domain design docs.
- Files to create: `docs/CLINIC6-SDA-AUTHORIZATION.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Document roles, permissions, and access boundaries.
- Expected behavior: A formal RBAC design.
- Testing requirements: Review with stakeholders.
- Acceptance criteria: Auth model approved.
- Risks: Role creep.
- Rollback/Recovery: Refine model.

#### TASK 5.2: Add auth architecture notes to the backend design

- Objective: Document chosen auth approach and JWT/session strategy.
- Why: Avoids premature coding decisions.
- Dependencies: Auth model.
- Files to create: `docs/CLINIC6-SDA-AUTH-ARCHITECTURE.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Include token storage, refresh strategy, and secret management guidelines.
- Expected behavior: A clear auth architecture doc.
- Testing requirements: Review.
- Acceptance criteria: Auth architecture approved.
- Risks: None.
- Rollback/Recovery: Refine architecture.

### PHASE 6: Donors + Pledges + Payments

#### TASK 6.1: Define donor and pledge domain behavior in docs

- Objective: Describe donor lifecycle, pledge creation, and payment reconciliation rules.
- Why: Sets backend business rules before implementation.
- Dependencies: Domain model and API plan.
- Files to create: `docs/CLINIC6-SDA-DONOR-PLEDGE-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Document donor record structure and pledge states.
- Expected behavior: Business rules are captured.
- Testing requirements: Review for completeness.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine documentation.

#### TASK 6.2: Document payment record and verification workflow

- Objective: Capture how donations will be recorded, verified, and audited.
- Why: Prevents frontend/backed mismatch on payment state.
- Dependencies: Domain model and auth docs.
- Files to create: `docs/CLINIC6-SDA-PAYMENT-WORKFLOW.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Define receipt generation, status updates, and verification flows.
- Expected behavior: Payment workflow documented.
- Testing requirements: Review.
- Acceptance criteria: Workflow accepted.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 7: Budget + Expenses

#### TASK 7.1: Document budget and expense domain rules

- Objective: Define categories, approvals, and tracking rules for budgets and expenses.
- Why: Keeps budget management consistent and auditable.
- Dependencies: Domain model and reporting plans.
- Files to create: `docs/CLINIC6-SDA-BUDGET-EXPENSE-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Capture budget lifecycle and expense attachments.
- Expected behavior: Budget rules documented.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 8: Construction + Progress

#### TASK 8.1: Document construction management and progress updates

- Objective: Define construction phases, milestones, and progress record structure.
- Why: Aligns the public story with backend tracking.
- Dependencies: Domain model.
- Files to create: `docs/CLINIC6-SDA-CONSTRUCTION-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Describe progress updates, statuses, and media attachments.
- Expected behavior: Construction domain documented.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 9: Materials + Volunteers + Seating Sponsorship

#### TASK 9.1: Document materials and volunteer management

- Objective: Define how donated materials and volunteer activities are tracked.
- Why: Completes the operational domain model.
- Dependencies: Domain design.
- Files to create: `docs/CLINIC6-SDA-MATERIALS-VOLUNTEERS-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Capture material categories, volunteer shifts, and engagement status.
- Expected behavior: Operational domain documented.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

#### TASK 9.2: Document seating sponsorship and sponsorship units

- Objective: Define seating campaigns, seat units, and sponsorship records.
- Why: Preserves existing seating sponsorship features in the new domain.
- Dependencies: Domain model.
- Files to create: `docs/CLINIC6-SDA-SEATING-SPONSORSHIP-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Describe tickets, seat inventory, and pledge mapping.
- Expected behavior: Seating sponsorship domain documented.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 10: Receipts + Notification Architecture

#### TASK 10.1: Document receipt and notification requirements

- Objective: Define receipt data, delivery channels, and notification triggers.
- Why: Ensures the backend can support donor transparency.
- Dependencies: Payment workflow and auth docs.
- Files to create: `docs/CLINIC6-SDA-RECEIPTS-NOTIFICATIONS-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Include email/text/video notification concepts.
- Expected behavior: Notification architecture documented.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 11: Admin Portal

#### TASK 11.1: Define admin portal pages and permissions

- Objective: Document admin UI scope for donors, payments, budgets, construction, and media.
- Why: Guides the portal implementation and RBAC design.
- Dependencies: Auth, API, and domain docs.
- Files to create: `docs/CLINIC6-SDA-ADMIN-PORTAL-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing public app files.
- Implementation requirements: Define required admin views and associated API permissions.
- Expected behavior: Admin portal plan documented.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 12: Public API Integration

#### TASK 12.1: Document public API data contracts and migration strategy

- Objective: Specify how the frontend will consume backend APIs incrementally.
- Why: Protects the public website during migration.
- Dependencies: API plan and frontend baseline.
- Files to create: `docs/CLINIC6-SDA-FRONTEND-MIGRATION-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing active route pages until migration tasks begin.
- Implementation requirements: Provide an incremental API migration checklist.
- Expected behavior: Frontend migration strategy documented.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 13: Giving Experience Consolidation

#### TASK 13.1: Document donation UI consolidation goals

- Objective: Define how the existing donation pages and fragments will converge into one canonical flow.
- Why: Avoids redundant donation experiences and inconsistent payment messaging.
- Dependencies: Audit findings and API migration plan.
- Files to create: `docs/CLINIC6-SDA-GIVING-CONSOLIDATION-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing donation page files before consolidation begins.
- Implementation requirements: Outline which components will be preserved and which are legacy.
- Expected behavior: Donation consolidation plan documented.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 14: Public Transparency + Reporting

#### TASK 14.1: Document reporting and transparency requirements

- Objective: Define public-facing reports, metrics, and audit-ready data exposure.
- Why: Aligns delivery with the specification’s transparency goals.
- Dependencies: Domain and payment plans.
- Files to create: `docs/CLINIC6-SDA-REPORTING-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Document needed dashboards and public report endpoints.
- Expected behavior: Reporting plan documented.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 15: Human-Centered Frontend Redesign

#### TASK 15.1: Define the redesign principles and visual system

- Objective: Document the brand, tone, and human-centered design principles for the new site.
- Why: Ensures the redesign preserves the authentic church story.
- Dependencies: Audit and asset inventory.
- Files to create: `docs/CLINIC6-SDA-REDESIGN-GUIDELINES.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code until redesign begins.
- Implementation requirements: Capture tone, imagery rules, layout guidance, and accessibility.
- Expected behavior: Redesign guidelines documented.
- Testing requirements: Review.
- Acceptance criteria: Guidelines approved.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 16: Testing + Accessibility + Performance

#### TASK 16.1: Define test and quality gates

- Objective: Document testing requirements for frontend, backend, and integration.
- Why: Ensures safe incremental implementation.
- Dependencies: Architecture, backend, and frontend migration plans.
- Files to create: `docs/CLINIC6-SDA-TESTING-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Cover unit tests, integration tests, accessibility, and performance checks.
- Expected behavior: Quality gate document.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

### PHASE 17: Production Hardening + Deployment

#### TASK 17.1: Document production deployment and secret management

- Objective: Define deployment, environment, and monitoring strategy.
- Why: Prepares the platform for safe production launches.
- Dependencies: Backend and hosting architecture.
- Files to create: `docs/CLINIC6-SDA-PRODUCTION-PLAN.md`.
- Files to modify: None.
- Files that must not be modified: Existing app code.
- Implementation requirements: Cover Render migration, PostgreSQL hosting, secrets, and monitoring.
- Expected behavior: Deployment plan documented.
- Testing requirements: Review.
- Acceptance criteria: Plan approved.
- Risks: None.
- Rollback/Recovery: Refine.

## 6. Dependencies

- `docs/CLINIC6-SDA-MASTER-UPGRADE-SPECIFICATION.md` and `docs/CLINIC6-SDA-AUDIT-VERIFICATION.md` are the authoritative input.
- Backend work depends on architecture and domain design docs.
- Database work depends on Prisma schema design and migration planning.
- Auth and admin portal work depends on completed RBAC design.
- Frontend migration depends on stable backend APIs and public data contracts.

## 7. Task Sequencing

1. Complete architecture and documentation phase.
2. Establish backend foundation.
3. Design domains and Prisma schema.
4. Prepare PostgreSQL+Prisma without executing migrations yet.
5. Define auth and RBAC before implementing login.
6. Define donor/payment rules before coding payment endpoints.
7. Add budget and construction domains after core transactional entities are defined.
8. Build the admin portal after backend APIs and auth are in place.
9. Migrate frontend features incrementally through public APIs.
10. Add reporting, transparency, and frontend redesign last.

## 8. Safety Rules

- Do not delete or remove legacy files until their usage is verified.
- Do not implement a broad backend or frontend redesign in one step.
- Do not add production secrets to source control.
- Do not hardcode real financial metrics in code.
- Do not replace active routes without a fallback.
- Do not change the public site’s visual identity until redesign planning is complete.

## 9. Testing Gates

- Every task must include a testable acceptance criterion.
- Verification may be manual for documentation tasks.
- Backend foundation tasks must prove endpoints start and respond safely.
- Domain and schema tasks must be reviewed before migration.
- Frontend migration tasks must preserve existing route behavior.
- Production hardening tasks must include deployment validation criteria.

## 10. Definition of Done

A phase or task is done when:

- The requested files and documentation exist.
- Changes are limited to the stated scope.
- Existing functionality remains intact.
- The task passes its testing requirements.
- The output is reviewed and accepted by the project owner.
- No implementation proceeds without explicit next-task approval.

## 11. Legacy Removal Strategy

- First identify legacy files and document references.
- Then mark legacy content as deprecated in docs.
- Only remove a file after explicit approval and preservation of any still-needed content.
- Preserve legacy media/UI files until the backend and admin portal are stable.
- Use the phased migration path to retire legacy fragments only after replacements are verified.

## 12. Frontend Migration Strategy

- Keep the current public website working as the baseline.
- Add a backend API service layer in the new backend first.
- Build one API endpoint at a time.
- Connect a single frontend feature to the backend before migrating the next.
- Keep static `projectCatalog` and translation sources until their API replacements are stable.
- Leave the current route graph intact while introducing backend-backed content gradually.
- Audit every migration step for broken links and regressions.

## 13. Backend Migration Strategy

- Start by creating the backend foundation and health route.
- Add config and middleware before domain endpoints.
- Document the API contract first.
- Implement domain models incrementally, beginning with donors and payments.
- Keep payment provider integration server-side and sandboxed.
- Do not expose secret keys to the frontend.
- Preserve the public site by only switching one route or component at a time.

## 14. Database Migration Strategy

- Design the Prisma schema before generating migrations.
- Store schema and migration plans in docs first.
- Use `backend/.env.example` for development placeholders.
- Only create production-ready migrations after review.
- Treat the database as the source of truth for financial and operational state.
- Migrate static data only after API endpoints are validated.

## 15. Media/Asset Migration Strategy

- Preserve existing authentic images and videos.
- Inventory existing media and map each asset to its story section.
- Replace brittle remote assets with local managed assets only when ready.
- Do not fill empty slots with unauthentic imagery.
- Document asset requirements before any redesign.
- Keep the current `src/assets/` and `public/videos/` usage until rewritten safely.

## 16. Production Deployment Strategy

- Retain `render.yaml` for the current frontend deployment until new hosting is ready.
- Plan backend deployment separately from the public website.
- Use environment variables for secrets and database connections.
- Avoid migrating deployment until backend, auth, and database are stable.
- Document production readiness criteria before live rollout.

---

## FIRST IMPLEMENTATION TASK

TASK ID: 1.1
PHASE: 1
TASK NAME: Document the architecture and project boundaries
OBJECTIVE: Produce a formal architecture document that separates frontend, backend, database, auth, payments, and reporting.
WHY IT IS NEEDED: Provides a shared blueprint before any code is written and keeps the migration aligned with the authoritative spec and audit.
DEPENDENCIES: `docs/CLINIC6-SDA-MASTER-UPGRADE-SPECIFICATION.md`, `docs/CLINIC6-SDA-AUDIT-VERIFICATION.md`.
FILES TO CREATE: `docs/CLINIC6-SDA-ARCHITECTURE.md`.
FILES THAT MAY BE MODIFIED: None.
FILES THAT MUST NOT BE MODIFIED: Existing application source files.
IMPLEMENTATION REQUIREMENTS: Define boundaries, service responsibilities, incremental migration constraints, and the separation between public website, backend API, database, auth, admin portal, payment, media, and reporting.
EXPECTED BEHAVIOR: A clear architecture document that can be reviewed and used as the foundation for subsequent tasks.
TESTING REQUIREMENTS: Review the document for alignment with the master spec and audit verification.
ACCEPTANCE CRITERIA: Architecture document exists, is consistent with authoritative docs, and is approved for the next task.
RISKS: Missing a dependency or scope detail in the architecture definition.
ROLLBACK / RECOVERY NOTES: Revise the architecture document if issues are found; no code changes were made.
