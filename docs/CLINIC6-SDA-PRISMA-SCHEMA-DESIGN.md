# Clinic 6 SDA Prisma Schema Design

## Overview

This document defines the proposed Prisma schema and entity relationship model for the Clinic 6 SDA platform. It serves as the design blueprint before Prisma code is generated and migrations are created.

**Status:** Design phase (no schema.prisma file created yet) — REQUIREMENTS: [CONFIRMED]; SCHEMA DESIGN: [CONFIRMED]

**Alignment:** Based on CLINIC6-SDA-INCREMENTAL-IMPLEMENTATION-PLAN.md, CLINIC6-SDA-AUDIT-VERIFICATION.md, CLINIC6-SDA-STRUCTURE.md, and CLINIC6-SDA-DOMAINS.md

**Key Principle:** This schema is designed to support an extensible, configurable multi-currency platform. The Currency entity and centralized catalog are NOT limited to a fixed set of currencies. Additional currencies can be added via configuration without schema changes.

---

## 1. Schema Design Principles

- **Normalized relational model** — Data is organized to minimize redundancy and maintain integrity.
- **Status tracking** — Enums track lifecycle states for payments, pledges, construction phases, etc.
- **Audit trail** — Timestamps and user tracking for financial and operational records.
- **Soft deletes** — Archive records rather than delete them (except for transient data).
- **Data ownership** — Records are associated with users (donors, volunteers, admins) and contexts (projects, campaigns).
- **Constraints** — Unique, foreign key, and check constraints prevent data corruption.
- **Indexes** — Frequently queried fields are indexed for performance.

---

## 2. Core Entities

### 2.1 Users

**Purpose:** User accounts for donors, volunteers, admins, and system roles.

**Fields:**

| Field          | Type              | Required | Unique | Notes                                      |
| -------------- | ----------------- | -------- | ------ | ------------------------------------------ |
| `id`           | String (UUID)     | ✓        | ✓      | Primary key                                |
| `email`        | String            | ✓        | ✓      | Unique email for login                     |
| `passwordHash` | String            | ✗        |        | Hashed password (no plaintext)             |
| `firstName`    | String            |          |        | User first name                            |
| `lastName`     | String            |          |        | User last name                             |
| `phoneNumber`  | String            |          |        | Optional contact phone                     |
| `role`         | Enum (Role)       | ✓        |        | Role: DONOR, VOLUNTEER, ADMIN, SUPER_ADMIN |
| `status`       | Enum (UserStatus) | ✓        |        | Status: ACTIVE, INACTIVE, SUSPENDED        |
| `createdAt`    | DateTime          | ✓        |        | Timestamp of account creation              |
| `updatedAt`    | DateTime          | ✓        |        | Timestamp of last update                   |
| `lastLoginAt`  | DateTime          |          |        | Timestamp of last login                    |
| `archivedAt`   | DateTime          |          |        | Soft-delete timestamp (null = active)      |

**Relationships:**

- One-to-many: User → Donations (a donor can make many donations)
- One-to-many: User → Pledges (a donor can make many pledges)
- One-to-many: User → Receipts (a donor can receive many receipts)
- One-to-many: User → VolunteerShifts (a volunteer can work many shifts)
- One-to-many: User → NotificationPreferences (a user can have many preferences)

**Status Enums:**

```
UserStatus: ACTIVE | INACTIVE | SUSPENDED
Role: DONOR | VOLUNTEER | ADMIN | SUPER_ADMIN
```

**Indexes:**

- Primary key: `id`
- Unique: `email`
- Query: `status`, `role`, `createdAt`

---

### 2.2 Donors

**Purpose:** Extended profile for donors and their giving history.

**Fields:**

| Field                       | Type                 | Required | Unique | Notes                                                              |
| --------------------------- | -------------------- | -------- | ------ | ------------------------------------------------------------------ |
| `id`                        | String (UUID)        | ✓        | ✓      | Primary key                                                        |
| `userId`                    | String (UUID)        | ✓        |        | Foreign key to Users                                               |
| `giverName`                 | String               |          |        | Alternative display name for giving records                        |
| `country`                   | String               |          |        | Donor country (for localizing receipts, currency detection)        |
| `totalDonatedKES`           | Decimal(12,2)        | ✓        |        | Sum of all verified donations in KES (settlement currency)         |
| `totalDonatedOriginal`      | Decimal(12,2)        | ✓        |        | Sum of all verified donations in original/transaction currencies   |
| `totalPledgedKES`           | Decimal(12,2)        | ✓        |        | Sum of all active pledges in KES (settlement currency)             |
| `totalPledgedOriginal`      | Decimal(12,2)        | ✓        |        | Sum of all active pledges in original/transaction currencies       |
| `donationCount`             | Int                  | ✓        |        | Count of verified donations                                        |
| `pledgeCount`               | Int                  | ✓        |        | Count of active pledges                                            |
| `preferredDisplayCurrency`  | String (3-char code) |          |        | ISO 4217 currency code for display preference (e.g., "USD", "KES") |
| `displayCurrencyAutoDetect` | Boolean              | ✓        |        | Whether display currency should auto-detect based on context       |
| `receiptEmailPreference`    | String               |          |        | Email for receipts (may differ from User.email)                    |
| `optInMarketing`            | Boolean              | ✓        |        | Whether donor consents to marketing emails                         |
| `optInUpdates`              | Boolean              | ✓        |        | Whether donor consents to project update emails                    |
| `notes`                     | String               |          |        | Admin notes about donor (GDPR-restricted)                          |
| `createdAt`                 | DateTime             | ✓        |        | Profile creation timestamp                                         |
| `updatedAt`                 | DateTime             | ✓        |        | Profile last update timestamp                                      |
| `archivedAt`                | DateTime             |          |        | Soft-delete timestamp (null = active)                              |

**Relationships:**

- Many-to-one: Donor → User (back-reference)
- One-to-many: Donor → Donations (donor's donation records)
- One-to-many: Donor → Pledges (donor's pledge records)
- One-to-many: Donor → Receipts (donor's receipts)
- Many-to-one: Donor → Currency (preferred display currency, optional)
- One-to-many: Donor → DonorCurrencyPreferences (currency selection history)

**Indexes:**

- Primary key: `id`
- Foreign key: `userId`
- Query: `totalDonatedKES`, `donationCount`, `createdAt`, `archivedAt`, `preferredDisplayCurrency`

---

### 2.3 Currency

**Purpose:** Centralized global currency catalog supporting multi-currency donations.

**Fields:**

| Field           | Type          | Required | Unique | Notes                                                                |
| --------------- | ------------- | -------- | ------ | -------------------------------------------------------------------- |
| `id`            | String (UUID) | ✓        | ✓      | Primary key                                                          |
| `code`          | String (3)    | ✓        | ✓      | ISO 4217 currency code (e.g., "KES", "USD", "EUR")                   |
| `name`          | String        | ✓        |        | Currency name (e.g., "Kenyan Shilling")                              |
| `symbol`        | String        | ✓        |        | Currency symbol (e.g., "KSh", "$", "€")                              |
| `decimalPlaces` | Int           | ✓        |        | Decimal precision (usually 2, some currencies 0-3)                   |
| `active`        | Boolean       | ✓        |        | Whether currency is currently supported                              |
| `settlementMap` | String        |          |        | ISO 4217 code for settlement currency (null=not a settlement target) |
| `searchAliases` | String[]      |          |        | JSON array of searchable aliases (e.g., ["Kenya", "shilling"])       |
| `displayOrder`  | Int           | ✓        |        | Display ordering in currency selector                                |
| `createdAt`     | DateTime      | ✓        |        | Record creation timestamp                                            |
| `updatedAt`     | DateTime      | ✓        |        | Record last update timestamp                                         |

**Relationships:**

- One-to-many: Currency → Countries (which countries use this currency)
- One-to-many: Currency → ExchangeRates (historical exchange rates involving this currency)
- One-to-many: Currency → Donations (donations in this currency)
- One-to-many: Currency → DonorCurrencyPreferences (donors preferring this display currency)

**Indexes:**

- Primary key: `id`
- Unique: `code`
- Query: `active`, `displayOrder`, `code`

**Special Constraint:**

- KES is designated as Clinic 6's primary settlement/accounting currency (required)
- At least one currency must always be marked `active`

---

### 2.4 CurrencyCountry

**Purpose:** Maps currencies to countries/regions for automatic currency detection.

**Fields:**

| Field         | Type          | Required | Unique | Notes                                                |
| ------------- | ------------- | -------- | ------ | ---------------------------------------------------- |
| `id`          | String (UUID) | ✓        | ✓      | Primary key                                          |
| `currencyId`  | String (UUID) | ✓        |        | Foreign key to Currency                              |
| `countryCode` | String (2)    | ✓        |        | ISO 3166-1 alpha-2 country code                      |
| `countryName` | String        | ✓        |        | Country or region name                               |
| `isPrimary`   | Boolean       | ✓        |        | Whether this is the primary currency for the country |
| `createdAt`   | DateTime      | ✓        |        | Record creation timestamp                            |

**Relationships:**

- Many-to-one: CurrencyCountry → Currency (back-reference)

**Unique Constraint:**

- (currencyId, countryCode) — Each currency-country pair is unique

**Indexes:**

- Primary key: `id`
- Foreign key: `currencyId`
- Query: `countryCode`, `isPrimary`

---

### 2.5 ExchangeRate

**Purpose:** Historical exchange rates for currency conversion.

**Fields:**

| Field               | Type          | Required | Unique | Notes                                                  |
| ------------------- | ------------- | -------- | ------ | ------------------------------------------------------ |
| `id`                | String (UUID) | ✓        | ✓      | Primary key                                            |
| `sourceCode`        | String (3)    | ✓        |        | Source currency ISO 4217 code                          |
| `targetCode`        | String (3)    | ✓        |        | Target currency ISO 4217 code (usually KES)            |
| `rate`              | Decimal(15,6) | ✓        |        | Exchange rate (source → target)                        |
| `timestamp`         | DateTime      | ✓        |        | When exchange rate was obtained                        |
| `source`            | String        | ✓        |        | Rate provider (e.g., "openexchangerates", "xe", "cbk") |
| `reliable`          | Boolean       | ✓        |        | Whether rate is from authoritative provider            |
| `usedInTransaction` | Boolean       | ✓        |        | Whether rate was used in actual transaction            |
| `createdAt`         | DateTime      | ✓        |        | Record creation timestamp                              |

**Relationships:**

- Many-to-one: ExchangeRate → Currency (source, optional reference)
- Many-to-one: ExchangeRate → Currency (target, optional reference)
- One-to-many: ExchangeRate ← Donations (donations reference this rate)
- One-to-many: ExchangeRate ← Settlements (settlements reference this rate)

**Immutability:**

- Exchange rates are immutable once created
- Historical rates are never deleted or recalculated

**Indexes:**

- Primary key: `id`
- Query: `sourceCode`, `targetCode`, `timestamp`, `source`, `usedInTransaction`

---

### 2.6 DonorCurrencyPreference

**Purpose:** Tracks donor's manual currency selections and auto-detection strategy.

**Fields:**

| Field               | Type          | Required | Unique | Notes                                                             |
| ------------------- | ------------- | -------- | ------ | ----------------------------------------------------------------- |
| `id`                | String (UUID) | ✓        | ✓      | Primary key                                                       |
| `donorId`           | String (UUID) | ✓        |        | Foreign key to Donors                                             |
| `currencyCode`      | String (3)    | ✓        |        | ISO 4217 currency code                                            |
| `isManualSelection` | Boolean       | ✓        |        | Whether donor manually selected this or it was auto-detected      |
| `detectionMethod`   | String        |          |        | How currency was detected (locale, timezone, ipgeo, manual, etc.) |
| `selectionReason`   | String        |          |        | Admin notes on why currency was selected                          |
| `activeSince`       | DateTime      | ✓        |        | When this preference became active                                |
| `createdAt`         | DateTime      | ✓        |        | Record creation timestamp                                         |

**Relationships:**

- Many-to-one: DonorCurrencyPreference → Donor (back-reference)
- Many-to-one: DonorCurrencyPreference → Currency (referenced currency)

**Indexes:**

- Primary key: `id`
- Foreign keys: `donorId`, `currencyCode`
- Query: `activeSince`, `donorId`

---

### 2.7 Donations (Updated)

**Purpose:** Individual donations and their payment records with multi-currency support.

**Fields:**

| Field                   | Type                  | Required | Unique | Notes                                                    |
| ----------------------- | --------------------- | -------- | ------ | -------------------------------------------------------- |
| `id`                    | String (UUID)         | ✓        | ✓      | Primary key                                              |
| `donorId`               | String (UUID)         | ✓        |        | Foreign key to Donors                                    |
| `projectId`             | String (UUID)         | ✓        |        | Foreign key to Projects                                  |
| `amountOriginal`        | Decimal(12,2)         | ✓        |        | Amount in donor's original/transaction currency          |
| `currencyOriginal`      | String (3)            | ✓        |        | Original/transaction currency ISO 4217 code              |
| `amountSettlement`      | Decimal(12,2)         | ✓        |        | Amount in KES (settlement/accounting currency)           |
| `currencySettlement`    | String (3)            | ✓        |        | Settlement currency (always "KES" for now)               |
| `exchangeRateUsed`      | Decimal(15,6)         | ✓        |        | Exchange rate applied (original → settlement)            |
| `exchangeRateId`        | String (UUID)         |          |        | Foreign key to ExchangeRate (historical reference)       |
| `exchangeRateTimestamp` | DateTime              | ✓        |        | When exchange rate was captured                          |
| `paymentMethod`         | String                |          |        | Payment method (e.g., "M-Pesa", "Bank", "Card")          |
| `transactionReference`  | String                | ✓        | ✓      | Unique payment provider reference (idempotency key)      |
| `paymentEventId`        | String (UUID)         |          |        | Foreign key to PaymentEvent (webhook/confirmation)       |
| `status`                | Enum (DonationStatus) | ✓        |        | Status: PENDING, PROCESSING, VERIFIED, FAILED, CANCELLED |
| `paymentVerifiedAt`     | DateTime              |          |        | Timestamp when payment was confirmed                     |
| `paymentFailedReason`   | String                |          |        | Error message if payment failed                          |
| `anonymous`             | Boolean               | ✓        |        | Whether donation is anonymous                            |
| `publicRecognition`     | Boolean               | ✓        |        | Whether donor allows public listing                      |
| `message`               | String                |          |        | Optional donor message (max 500 chars)                   |
| `createdAt`             | DateTime              | ✓        |        | Donation initiated timestamp                             |
| `updatedAt`             | DateTime              | ✓        |        | Donation last updated timestamp                          |

**Relationships:**

- Many-to-one: Donation → Donor (back-reference)
- Many-to-one: Donation → Project (back-reference)
- One-to-one: Donation → Receipt (donation generates one receipt)
- Many-to-one: Donation → ExchangeRate (historical exchange rate reference)
- Many-to-one: Donation → PaymentEvent (payment confirmation event)

**Status Enums:**

```
DonationStatus: PENDING | PROCESSING | VERIFIED | FAILED | CANCELLED | REFUNDED | REVERSED
```

**Immutable Fields:**

- `amountOriginal` — Original transaction amount never changes
- `currencyOriginal` — Original currency never changes
- `exchangeRateUsed` — Rate at time of transaction is preserved
- `exchangeRateTimestamp` — When rate was captured is preserved

**Constraints:**

- `amountOriginal > 0`
- `amountSettlement > 0`
- `exchangeRateUsed > 0`
- `transactionReference` is globally unique (prevents duplicate processing)
- If `status = VERIFIED`, then `paymentVerifiedAt` must be set
- If `status = FAILED`, then `paymentFailedReason` should be set

**Indexes:**

- Primary key: `id`
- Unique: `transactionReference`
- Foreign keys: `donorId`, `projectId`, `exchangeRateId`, `paymentEventId`
- Query: `status`, `createdAt`, `paymentVerifiedAt`, `projectId`, `donorId`

---

### 2.8 PaymentTransaction

**Purpose:** Tracks payment provider transactions (e.g., M-Pesa, bank transfer, card).

**Fields:**

| Field                   | Type          | Required | Unique | Notes                                                       |
| ----------------------- | ------------- | -------- | ------ | ----------------------------------------------------------- |
| `id`                    | String (UUID) | ✓        | ✓      | Primary key                                                 |
| `donationId`            | String (UUID) | ✓        |        | Foreign key to Donations                                    |
| `providerCode`          | String        | ✓        |        | Payment provider code (e.g., "mpesa", "stripe", "bank")     |
| `providerTransactionId` | String        | ✓        | ✓      | Unique ID from payment provider                             |
| `providerStatus`        | String        | ✓        |        | Status from provider (e.g., "Success", "Pending", "Failed") |
| `initiatedAt`           | DateTime      | ✓        |        | When transaction was initiated                              |
| `confirmedAt`           | DateTime      |          |        | When transaction was confirmed by provider                  |
| `phoneNumber`           | String        |          |        | Phone number (for M-Pesa and similar)                       |
| `providerResponse`      | JSON          |          |        | Full response from payment provider (for debugging)         |
| `createdAt`             | DateTime      | ✓        |        | Record creation timestamp                                   |

**Relationships:**

- One-to-one: PaymentTransaction ↔ Donation (back-reference)
- One-to-many: PaymentTransaction ← PaymentEvents (multiple webhook events for one transaction)

**Immutability:**

- Provider transaction details are never modified once captured
- `providerResponse` is preserved exactly as received from provider

**Indexes:**

- Primary key: `id`
- Unique: `providerTransactionId`
- Foreign key: `donationId`
- Query: `providerStatus`, `confirmedAt`, `initiatedAt`

---

### 2.9 PaymentEvent

**Purpose:** Webhook events and confirmations from payment providers (ensures idempotency).

**Fields:**

| Field                  | Type          | Required | Unique | Notes                                                   |
| ---------------------- | ------------- | -------- | ------ | ------------------------------------------------------- |
| `id`                   | String (UUID) | ✓        | ✓      | Primary key                                             |
| `paymentTransactionId` | String (UUID) | ✓        |        | Foreign key to PaymentTransaction                       |
| `eventId`              | String        | ✓        | ✓      | Unique event ID from payment provider (idempotency key) |
| `eventType`            | String        | ✓        |        | Event type (e.g., "payment.success", "payment.failed")  |
| `eventTimestamp`       | DateTime      | ✓        |        | When event occurred at provider                         |
| `payload`              | JSON          | ✓        |        | Full webhook payload from provider                      |
| `processed`            | Boolean       | ✓        |        | Whether event has been processed by Clinic 6 system     |
| `processedAt`          | DateTime      |          |        | When Clinic 6 processed this event                      |
| `processingStatus`     | String        |          |        | Status of processing (SUCCESS, FAILED, PENDING)         |
| `processingError`      | String        |          |        | Error message if processing failed                      |
| `createdAt`            | DateTime      | ✓        |        | Record creation timestamp                               |

**Relationships:**

- Many-to-one: PaymentEvent → PaymentTransaction (back-reference)
- Many-to-one: PaymentEvent → Donation (implied through PaymentTransaction)

**Immutability:**

- Events are never modified, only processed or reprocessed
- Payloads are preserved exactly as received
- Idempotency key (`eventId`) prevents duplicate processing

**Unique Constraint:**

- `eventId` is globally unique (provider + event ID is unique)

**Indexes:**

- Primary key: `id`
- Unique: `eventId`
- Foreign key: `paymentTransactionId`
- Query: `processed`, `eventType`, `eventTimestamp`, `processingStatus`

---

### 2.10 Settlement

**Purpose:** Records how donations settle in KES with Clinic 6.

**Fields:**

| Field              | Type          | Required | Unique | Notes                                        |
| ------------------ | ------------- | -------- | ------ | -------------------------------------------- |
| `id`               | String (UUID) | ✓        | ✓      | Primary key                                  |
| `donationId`       | String (UUID) | ✓        | ✓      | Foreign key to Donations (one-to-one)        |
| `amountKES`        | Decimal(12,2) | ✓        |        | Settlement amount in KES                     |
| `exchangeRateUsed` | Decimal(15,6) | ✓        |        | Exchange rate used for settlement            |
| `settlementDate`   | DateTime      | ✓        |        | When settlement is expected/completed        |
| `status`           | String        | ✓        |        | Status: PENDING, SETTLED, REVERSED, REFUNDED |
| `notes`            | String        |          |        | Admin notes about settlement                 |
| `createdAt`        | DateTime      | ✓        |        | Record creation timestamp                    |

**Relationships:**

- One-to-one: Settlement ↔ Donation (back-reference)

**Immutability:**

- Settlement amount is immutable (historical record)
- Original exchange rate is preserved

**Indexes:**

- Primary key: `id`
- Unique: `donationId`
- Query: `status`, `settlementDate`

---

### 2.11 RefundReversal

**Purpose:** Tracks refunds and reversals of confirmed donations.

**Fields:**

| Field              | Type                        | Required | Unique | Notes                                        |
| ------------------ | --------------------------- | -------- | ------ | -------------------------------------------- |
| `id`               | String (UUID)               | ✓        | ✓      | Primary key                                  |
| `donationId`       | String (UUID)               | ✓        |        | Foreign key to Donations (original donation) |
| `refundType`       | Enum (RefundType)           | ✓        |        | FULL_REFUND, PARTIAL_REFUND, REVERSAL        |
| `amountRefunded`   | Decimal(12,2)               | ✓        |        | Amount being refunded (in original currency) |
| `reason`           | String                      | ✓        |        | Reason for refund/reversal                   |
| `initiatedBy`      | String (UUID)               |          |        | Foreign key to Users (who initiated refund)  |
| `providerRefundId` | String                      |          |        | Refund ID from payment provider              |
| `status`           | Enum (RefundReversalStatus) | ✓        |        | PENDING, PROCESSING, COMPLETED, FAILED       |
| `processedAt`      | DateTime                    |          |        | When refund/reversal was processed           |
| `createdAt`        | DateTime                    | ✓        |        | Record creation timestamp                    |
| `updatedAt`        | DateTime                    | ✓        |        | Record last updated timestamp                |

**Relationships:**

- Many-to-one: RefundReversal → Donation (back-reference)
- Many-to-one: RefundReversal → User (who initiated, optional)

**Status Enums:**

```
RefundType: FULL_REFUND | PARTIAL_REFUND | REVERSAL
RefundReversalStatus: PENDING | PROCESSING | COMPLETED | FAILED
```

**Important Rules:**

1. Original donation record remains unchanged (immutable)
2. Refund/reversal is a separate transaction
3. Audit trail is preserved
4. Financial aggregates updated appropriately

**Indexes:**

- Primary key: `id`
- Foreign keys: `donationId`, `initiatedBy`
- Query: `status`, `refundType`, `processedAt`

---

### 2.12 Projects

**Purpose:** Fundraising projects and their financial targets.

**Fields:**

| Field                   | Type                 | Required | Unique | Notes                                                         |
| ----------------------- | -------------------- | -------- | ------ | ------------------------------------------------------------- |
| `id`                    | String (UUID)        | ✓        | ✓      | Primary key                                                   |
| `slug`                  | String               | ✓        | ✓      | URL-friendly identifier (from frontend projectCatalog)        |
| `name`                  | String               | ✓        |        | Project display name                                          |
| `description`           | String               |          |        | Detailed project description                                  |
| `category`              | String               |          |        | Project category (e.g., "sanctuary", "education", "outreach") |
| `targetAmount`          | Decimal(12,2)        | ✓        |        | Fundraising goal in USD                                       |
| `raisedAmountKES`       | Decimal(12,2)        | ✓        |        | Total verified donations in KES (settlement currency)         |
| `raisedAmountOriginal`  | Decimal(12,2)        | ✓        |        | Total verified donations in original currencies               |
| `pledgedAmountKES`      | Decimal(12,2)        | ✓        |        | Total active pledges in KES (settlement currency)             |
| `pledgedAmountOriginal` | Decimal(12,2)        | ✓        |        | Total active pledges in original currencies                   |
| `status`                | Enum (ProjectStatus) | ✓        |        | Status: PLANNING, ACTIVE, PAUSED, COMPLETED, ARCHIVED         |
| `startDate`             | DateTime             |          |        | Project launch date                                           |
| `targetEndDate`         | DateTime             |          |        | Expected completion date                                      |
| `actualEndDate`         | DateTime             |          |        | Actual completion date                                        |
| `heroImageUrl`          | String               |          |        | URL to hero/featured image                                    |
| `mediaUrls`             | String[]             |          |        | JSON array of additional media URLs                           |
| `createdAt`             | DateTime             | ✓        |        | Created timestamp                                             |
| `updatedAt`             | DateTime             | ✓        |        | Updated timestamp                                             |

**Relationships:**

- One-to-many: Project → Donations (all donations to this project)
- One-to-many: Project → Pledges (all pledges to this project)
- One-to-many: Project → ProgressUpdates (construction/status updates)
- One-to-many: Project → Budgets (project budget line items)
- One-to-many: Project → ConstructionPhases (project phases)

**Status Enums:**

```
ProjectStatus: PLANNING | ACTIVE | PAUSED | COMPLETED | ARCHIVED
```

**Indexes:**

- Primary key: `id`
- Unique: `slug`
- Query: `status`, `raisedAmountKES`, `startDate`

---

---

### 2.13 Receipts (Updated)

**Purpose:** Tax receipts and donor acknowledgments with multi-currency support.

**Fields:**

| Field                   | Type            | Required | Unique | Notes                                               |
| ----------------------- | --------------- | -------- | ------ | --------------------------------------------------- |
| `id`                    | String (UUID)   | ✓        | ✓      | Primary key                                         |
| `donorId`               | String (UUID)   | ✓        |        | Foreign key to Donors                               |
| `donationId`            | String (UUID)   | ✓        | ✓      | Foreign key to Donations (one-to-one)               |
| `receiptNumber`         | String          | ✓        | ✓      | Unique receipt identifier (e.g., "RCP-2026-001234") |
| `receiptDate`           | DateTime        | ✓        |        | Date receipt was issued                             |
| `amountOriginal`        | Decimal(12,2)   | ✓        |        | Amount on receipt (original transaction currency)   |
| `currencyOriginal`      | String (3)      | ✓        |        | Original transaction currency code                  |
| `amountSettlement`      | Decimal(12,2)   | ✓        |        | Amount in KES (settlement/accounting currency)      |
| `currencySettlement`    | String (3)      | ✓        |        | Settlement currency (always "KES")                  |
| `exchangeRate`          | Decimal(15,6)   | ✓        |        | Exchange rate applied at time of receipt            |
| `exchangeRateTimestamp` | DateTime        | ✓        |        | When exchange rate was captured                     |
| `taxExemptStatus`       | String          |          |        | Tax exemption code (if applicable to jurisdiction)  |
| `recipientName`         | String          | ✓        |        | Name on receipt (from Donor profile)                |
| `recipientEmail`        | String          | ✓        |        | Email for receipt delivery                          |
| `format`                | String          |          |        | Format: EMAIL, PDF, PRINT                           |
| `sentAt`                | DateTime        |          |        | When receipt was sent to donor                      |
| `failureReason`         | String          |          |        | Error if receipt delivery failed                    |
| `locale`                | String (2-char) |          |        | Language of receipt (e.g., "en", "fr", "sw")        |
| `createdAt`             | DateTime        | ✓        |        | Record creation timestamp                           |
| `updatedAt`             | DateTime        | ✓        |        | Record last update timestamp                        |

**Relationships:**

- Many-to-one: Receipt → Donor (back-reference)
- One-to-one: Receipt ↔ Donation (each donation generates exactly one receipt)

**Immutable Fields:**

- `amountOriginal` — Original transaction amount preserved
- `currencyOriginal` — Original currency preserved
- `amountSettlement` — Settlement amount preserved
- `exchangeRate` — Rate at receipt generation preserved

**Constraints:**

- `amountOriginal > 0`
- `amountSettlement > 0`
- `receiptNumber` unique across all time
- Historical receipt values never change

**Indexes:**

- Primary key: `id`
- Unique: `receiptNumber`, `donationId`
- Foreign keys: `donorId`, `donationId`
- Query: `receiptDate`, `sentAt`, `donorId`

---

### 2.14 Pledges

**Purpose:** Recurring/installment donation commitments with multi-currency support.

**Fields:**

| Field                  | Type                | Required | Unique | Notes                                                           |
| ---------------------- | ------------------- | -------- | ------ | --------------------------------------------------------------- |
| `id`                   | String (UUID)       | ✓        | ✓      | Primary key                                                     |
| `donorId`              | String (UUID)       | ✓        |        | Foreign key to Donors                                           |
| `projectId`            | String (UUID)       | ✓        |        | Foreign key to Projects                                         |
| `totalAmount`          | Decimal(12,2)       | ✓        |        | Total pledge amount in original currency                        |
| `totalAmountKES`       | Decimal(12,2)       | ✓        |        | Total pledge amount in KES (settlement currency)                |
| `currency`             | String (3)          | ✓        |        | Original pledge currency (ISO 4217 code)                        |
| `currencySettlement`   | String (3)          | ✓        |        | Settlement currency (always "KES")                              |
| `installmentAmount`    | Decimal(12,2)       | ✓        |        | Amount per installment in original currency                     |
| `numberOfInstallments` | Int                 | ✓        |        | Total number of installment payments expected                   |
| `frequency`            | Enum (Frequency)    | ✓        |        | Payment frequency: WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, ANNUAL |
| `amountPaid`           | Decimal(12,2)       | ✓        |        | Amount paid to date in original currency                        |
| `amountPaidKES`        | Decimal(12,2)       | ✓        |        | Amount paid to date in KES                                      |
| `remainingAmount`      | Decimal(12,2)       | ✓        |        | Remaining balance in original currency                          |
| `remainingAmountKES`   | Decimal(12,2)       | ✓        |        | Remaining balance in KES                                        |
| `status`               | Enum (PledgeStatus) | ✓        |        | Status: ACTIVE, PAUSED, COMPLETED, CANCELLED, DEFAULTED         |
| `startDate`            | DateTime            | ✓        |        | When pledge begins                                              |
| `expectedEndDate`      | DateTime            | ✓        |        | When pledge is expected to complete                             |
| `actualEndDate`        | DateTime            |          |        | When pledge actually completed (if applicable)                  |
| `nextPaymentDueDate`   | DateTime            |          |        | When next installment payment is due                            |
| `lastPaymentDate`      | DateTime            |          |        | When last payment was received                                  |
| `defaultNoticesSent`   | Int                 | ✓        |        | Number of default reminder notices sent                         |
| `notes`                | String              |          |        | Admin notes about pledge                                        |
| `createdAt`            | DateTime            | ✓        |        | Record creation timestamp                                       |
| `updatedAt`            | DateTime            | ✓        |        | Record last update timestamp                                    |

**Relationships:**

- Many-to-one: Pledge → Donor (back-reference)
- Many-to-one: Pledge → Project (back-reference)
- One-to-many: Pledge ← Donations (donation records applying to this pledge)

**Status Enums:**

```
PledgeStatus: ACTIVE | PAUSED | COMPLETED | CANCELLED | DEFAULTED
Frequency: WEEKLY | BIWEEKLY | MONTHLY | QUARTERLY | ANNUAL
```

**Constraints:**

- `totalAmount > 0`
- `installmentAmount > 0`
- `numberOfInstallments >= 1`
- `amountPaid >= 0` and `amountPaid <= totalAmount`
- `remainingAmount = totalAmount - amountPaid` (auto-calculated)
- `remainingAmountKES = totalAmountKES - amountPaidKES` (auto-calculated)
- If `status = COMPLETED`, then `amountPaid >= totalAmount`
- If `status = DEFAULTED`, then `nextPaymentDueDate < current date` and payment is overdue

**Immutable Fields:**

- `totalAmount` — Original pledge amount never changes
- `currency` — Original currency never changes
- `startDate` — Pledge start date is immutable

**Indexes:**

- Primary key: `id`
- Foreign keys: `donorId`, `projectId`
- Query: `status`, `projectId`, `donorId`, `nextPaymentDueDate`, `startDate`

**Financial Calculation Rules:**

1. `remainingAmount = totalAmount - amountPaid` (must equal actual outstanding balance)
2. `remainingAmountKES = totalAmountKES - amountPaidKES` (must equal actual outstanding balance in settlement currency)
3. When donation is applied to pledge: increment `amountPaid` and `amountPaidKES`
4. When pledge completes: transition `status` to `COMPLETED` and set `actualEndDate`

---

## 3. Construction & Progress Entities

### 3.1 ConstructionPhases

**Purpose:** Project construction phases and status tracking.

**Fields:**

| Field              | Type                      | Required | Unique | Notes                                                     |
| ------------------ | ------------------------- | -------- | ------ | --------------------------------------------------------- |
| `id`               | String (UUID)             | ✓        | ✓      | Primary key                                               |
| `projectId`        | String (UUID)             | ✓        |        | Foreign key to Projects                                   |
| `phaseName`        | String                    | ✓        |        | Display name (e.g., "Foundation", "Walls")                |
| `description`      | String                    |          |        | Detailed phase description                                |
| `sequenceNumber`   | Int                       | ✓        |        | Order of phases (1, 2, 3, ...)                            |
| `status`           | Enum (ConstructionStatus) | ✓        |        | Status: PLANNED, IN_PROGRESS, COMPLETED, DELAYED, ON_HOLD |
| `plannedStartDate` | DateTime                  |          |        | Expected start date                                       |
| `plannedEndDate`   | DateTime                  |          |        | Expected end date                                         |
| `actualStartDate`  | DateTime                  |          |        | Actual start date                                         |
| `actualEndDate`    | DateTime                  |          |        | Actual completion date                                    |
| `percentComplete`  | Int                       | ✓        |        | Progress percentage (0-100)                               |
| `budgetAllocated`  | Decimal(12,2)             |          |        | Budget for this phase in USD                              |
| `budgetUsed`       | Decimal(12,2)             | ✓        |        | Actual spending to date                                   |
| `createdAt`        | DateTime                  | ✓        |        | Record creation timestamp                                 |
| `updatedAt`        | DateTime                  | ✓        |        | Record last update timestamp                              |

**Relationships:**

- Many-to-one: ConstructionPhase → Project (back-reference)
- One-to-many: ConstructionPhase → ProgressUpdates (updates for this phase)

**Status Enums:**

```
ConstructionStatus: PLANNED | IN_PROGRESS | COMPLETED | DELAYED | ON_HOLD
```

**Indexes:**

- Primary key: `id`
- Foreign key: `projectId`
- Query: `status`, `projectId`, `sequenceNumber`

---

### 3.2 ProgressUpdates

**Purpose:** Time-stamped updates about construction progress.

**Fields:**

| Field                 | Type          | Required | Unique | Notes                                                                     |
| --------------------- | ------------- | -------- | ------ | ------------------------------------------------------------------------- |
| `id`                  | String (UUID) | ✓        | ✓      | Primary key                                                               |
| `projectId`           | String (UUID) | ✓        |        | Foreign key to Projects                                                   |
| `constructionPhaseId` | String (UUID) |          |        | Foreign key to ConstructionPhases (optional, updates can be project-wide) |
| `title`               | String        | ✓        |        | Update title                                                              |
| `description`         | String        |          |        | Detailed update description                                               |
| `mediaUrls`           | String[]      |          |        | JSON array of URLs to photos/videos                                       |
| `percentComplete`     | Int           |          |        | Updated progress percentage (0-100)                                       |
| `publishedAt`         | DateTime      | ✓        |        | When update was published to public                                       |
| `createdBy`           | String (UUID) |          |        | Foreign key to Users (admin who created update)                           |
| `createdAt`           | DateTime      | ✓        |        | Record creation timestamp                                                 |
| `updatedAt`           | DateTime      | ✓        |        | Record last update timestamp                                              |

**Relationships:**

- Many-to-one: ProgressUpdate → Project (back-reference)
- Many-to-one: ProgressUpdate → ConstructionPhase (optional back-reference)
- Many-to-one: ProgressUpdate → User (admin who created it)

**Indexes:**

- Primary key: `id`
- Foreign keys: `projectId`, `constructionPhaseId`, `createdBy`
- Query: `publishedAt`, `projectId`

---

## 4. Budget & Expenses Entities

### 4.1 Budgets

**Purpose:** Project budget allocation and tracking.

**Fields:**

| Field             | Type                | Required | Unique | Notes                                                     |
| ----------------- | ------------------- | -------- | ------ | --------------------------------------------------------- |
| `id`              | String (UUID)       | ✓        | ✓      | Primary key                                               |
| `projectId`       | String (UUID)       | ✓        |        | Foreign key to Projects                                   |
| `year`            | Int                 | ✓        |        | Budget fiscal year                                        |
| `category`        | String              | ✓        |        | Budget category (e.g., "Labor", "Materials", "Equipment") |
| `allocatedAmount` | Decimal(12,2)       | ✓        |        | Budgeted amount in USD                                    |
| `spentAmount`     | Decimal(12,2)       | ✓        |        | Amount spent to date                                      |
| `remainingAmount` | Decimal(12,2)       | ✓        |        | Unspent balance                                           |
| `status`          | Enum (BudgetStatus) | ✓        |        | Status: PLANNED, ACTIVE, REVIEWED, CLOSED                 |
| `approvedBy`      | String (UUID)       |          |        | Foreign key to Users (admin who approved)                 |
| `approvedAt`      | DateTime            |          |        | Approval timestamp                                        |
| `notes`           | String              |          |        | Admin notes about budget                                  |
| `createdAt`       | DateTime            | ✓        |        | Record creation timestamp                                 |
| `updatedAt`       | DateTime            | ✓        |        | Record last update timestamp                              |

**Relationships:**

- Many-to-one: Budget → Project (back-reference)
- Many-to-one: Budget → User (approver)
- One-to-many: Budget → Expenses (expenses charged to this budget)

**Status Enums:**

```
BudgetStatus: PLANNED | ACTIVE | REVIEWED | CLOSED
```

**Constraints:**

- `allocatedAmount > 0`
- `spentAmount >= 0` and `spentAmount <= allocatedAmount`
- `remainingAmount = allocatedAmount - spentAmount`

**Indexes:**

- Primary key: `id`
- Foreign keys: `projectId`, `approvedBy`
- Query: `year`, `category`, `status`, `projectId`

---

### 4.2 Expenses

**Purpose:** Individual expense records.

**Fields:**

| Field             | Type                 | Required | Unique | Notes                                     |
| ----------------- | -------------------- | -------- | ------ | ----------------------------------------- |
| `id`              | String (UUID)        | ✓        | ✓      | Primary key                               |
| `budgetId`        | String (UUID)        | ✓        |        | Foreign key to Budgets                    |
| `description`     | String               | ✓        |        | Expense description                       |
| `amount`          | Decimal(12,2)        | ✓        |        | Expense amount in USD                     |
| `vendor`          | String               |          |        | Vendor/supplier name                      |
| `receiptUrl`      | String               |          |        | URL to receipt image/PDF                  |
| `category`        | String               |          |        | Expense category (Materials, Labor, etc.) |
| `status`          | Enum (ExpenseStatus) | ✓        |        | Status: PENDING, APPROVED, PAID, REJECTED |
| `submittedBy`     | String (UUID)        | ✓        |        | Foreign key to Users (who submitted)      |
| `approvedBy`      | String (UUID)        |          |        | Foreign key to Users (who approved)       |
| `approvedAt`      | DateTime             |          |        | Approval timestamp                        |
| `paidAt`          | DateTime             |          |        | Payment timestamp                         |
| `rejectionReason` | String               |          |        | Reason if expense was rejected            |
| `notes`           | String               |          |        | Additional notes                          |
| `createdAt`       | DateTime             | ✓        |        | Record creation timestamp                 |
| `updatedAt`       | DateTime             | ✓        |        | Record last update timestamp              |

**Relationships:**

- Many-to-one: Expense → Budget (back-reference)
- Many-to-one: Expense → User (submitter)
- Many-to-one: Expense → User (approver, optional)

**Status Enums:**

```
ExpenseStatus: PENDING | APPROVED | PAID | REJECTED
```

**Constraints:**

- `amount > 0`

**Indexes:**

- Primary key: `id`
- Foreign keys: `budgetId`, `submittedBy`, `approvedBy`
- Query: `status`, `createdAt`, `budgetId`

---

## 5. Volunteer & Materials Entities

### 5.1 Volunteers

**Purpose:** Volunteer profile and availability.

**Fields:**

| Field               | Type                   | Required | Unique | Notes                                                            |
| ------------------- | ---------------------- | -------- | ------ | ---------------------------------------------------------------- |
| `id`                | String (UUID)          | ✓        | ✓      | Primary key                                                      |
| `userId`            | String (UUID)          | ✓        |        | Foreign key to Users                                             |
| `skills`            | String[]               |          |        | JSON array of volunteer skills (e.g., ["carpentry", "plumbing"]) |
| `availabilityNotes` | String                 |          |        | When volunteer is available                                      |
| `totalHoursWorked`  | Int                    | ✓        |        | Total hours contributed                                          |
| `status`            | Enum (VolunteerStatus) | ✓        |        | Status: ACTIVE, INACTIVE, INACTIVE_REQUEST                       |
| `createdAt`         | DateTime               | ✓        |        | Profile creation timestamp                                       |
| `updatedAt`         | DateTime               | ✓        |        | Profile last update timestamp                                    |
| `archivedAt`        | DateTime               |          |        | Soft-delete timestamp                                            |

**Relationships:**

- One-to-one: Volunteer ↔ User (back-reference)
- One-to-many: Volunteer → VolunteerShifts (volunteer's work records)

**Status Enums:**

```
VolunteerStatus: ACTIVE | INACTIVE | INACTIVE_REQUEST
```

**Indexes:**

- Primary key: `id`
- Foreign key: `userId`
- Query: `status`, `totalHoursWorked`

---

### 5.2 VolunteerShifts

**Purpose:** Individual volunteer work assignments.

**Fields:**

| Field           | Type               | Required | Unique | Notes                                                                 |
| --------------- | ------------------ | -------- | ------ | --------------------------------------------------------------------- |
| `id`            | String (UUID)      | ✓        | ✓      | Primary key                                                           |
| `volunteerId`   | String (UUID)      | ✓        |        | Foreign key to Volunteers                                             |
| `projectId`     | String (UUID)      |          |        | Foreign key to Projects (optional, shift may not be project-specific) |
| `title`         | String             | ✓        |        | Shift title (e.g., "Concrete pouring")                                |
| `description`   | String             |          |        | Detailed shift description                                            |
| `scheduledDate` | DateTime           | ✓        |        | Date/time shift was scheduled                                         |
| `startTime`     | DateTime           | ✓        |        | Shift start time                                                      |
| `endTime`       | DateTime           | ✓        |        | Shift end time                                                        |
| `hoursWorked`   | Decimal(5,2)       |          |        | Hours actually worked                                                 |
| `status`        | Enum (ShiftStatus) | ✓        |        | Status: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED                  |
| `notes`         | String             |          |        | Admin notes about shift                                               |
| `createdAt`     | DateTime           | ✓        |        | Record creation timestamp                                             |
| `updatedAt`     | DateTime           | ✓        |        | Record last update timestamp                                          |

**Relationships:**

- Many-to-one: VolunteerShift → Volunteer (back-reference)
- Many-to-one: VolunteerShift → Project (optional back-reference)

**Status Enums:**

```
ShiftStatus: SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED
```

**Indexes:**

- Primary key: `id`
- Foreign keys: `volunteerId`, `projectId`
- Query: `scheduledDate`, `status`, `volunteerId`

---

### 5.3 Materials

**Purpose:** Donated and project materials.

**Fields:**

| Field            | Type                  | Required | Unique | Notes                                                 |
| ---------------- | --------------------- | -------- | ------ | ----------------------------------------------------- |
| `id`             | String (UUID)         | ✓        | ✓      | Primary key                                           |
| `projectId`      | String (UUID)         | ✓        |        | Foreign key to Projects                               |
| `name`           | String                | ✓        |        | Material name (e.g., "Concrete bags")                 |
| `category`       | String                |          |        | Category (e.g., "Building supplies", "Equipment")     |
| `quantity`       | Decimal(10,2)         | ✓        |        | Quantity                                              |
| `unit`           | String                | ✓        |        | Unit of measurement (e.g., "bags", "liters", "pcs")   |
| `estimatedValue` | Decimal(12,2)         |          |        | Estimated USD value                                   |
| `source`         | String                |          |        | Source of material (donation, purchased, etc.)        |
| `donor`          | String (UUID)         |          |        | Foreign key to Donors (if donated by a donor)         |
| `status`         | Enum (MaterialStatus) | ✓        |        | Status: RECEIVED, IN_USE, CONSUMED, RETURNED, DAMAGED |
| `receivedDate`   | DateTime              |          |        | Date material was received                            |
| `usedDate`       | DateTime              |          |        | Date material was put into use                        |
| `notes`          | String                |          |        | Admin notes                                           |
| `createdAt`      | DateTime              | ✓        |        | Record creation timestamp                             |
| `updatedAt`      | DateTime              | ✓        |        | Record last update timestamp                          |

**Relationships:**

- Many-to-one: Material → Project (back-reference)
- Many-to-one: Material → Donor (optional, if donor-supplied)

**Status Enums:**

```
MaterialStatus: RECEIVED | IN_USE | CONSUMED | RETURNED | DAMAGED
```

**Indexes:**

- Primary key: `id`
- Foreign keys: `projectId`, `donor`
- Query: `status`, `category`, `projectId`

---

## 6. Seating Sponsorship Entity

### 6.1 SeatingSponsorship

**Purpose:** Seating sponsorship campaigns and individual seat purchases.

**Fields:**

| Field              | Type                 | Required | Unique | Notes                                                      |
| ------------------ | -------------------- | -------- | ------ | ---------------------------------------------------------- |
| `id`               | String (UUID)        | ✓        | ✓      | Primary key                                                |
| `projectId`        | String (UUID)        | ✓        |        | Foreign key to Projects (seating campaign associated with) |
| `seatNumber`       | String               | ✓        |        | Unique seat identifier (e.g., "ROW-A-001")                 |
| `row`              | String               |          |        | Seating row (e.g., "A", "B")                               |
| `position`         | Int                  |          |        | Seat position in row                                       |
| `tierName`         | String               |          |        | Sponsorship tier (e.g., "Standard", "Premium", "VIP")      |
| `tierPrice`        | Decimal(12,2)        | ✓        |        | Price for this tier in USD                                 |
| `status`           | Enum (SeatingStatus) | ✓        |        | Status: AVAILABLE, PLEDGED, SPONSORED, RESERVED            |
| `sponsorId`        | String (UUID)        |          |        | Foreign key to Donors (null if not yet sponsored)          |
| `sponsorshipDate`  | DateTime             |          |        | Date seat was sponsored                                    |
| `donationId`       | String (UUID)        |          |        | Foreign key to Donations (payment for sponsorship)         |
| `dedicationPlaque` | String               |          |        | Name/text for plaque (if requested)                        |
| `notes`            | String               |          |        | Admin notes                                                |
| `createdAt`        | DateTime             | ✓        |        | Record creation timestamp                                  |
| `updatedAt`        | DateTime             | ✓        |        | Record last update timestamp                               |

**Relationships:**

- Many-to-one: SeatingSponsorship → Project (back-reference)
- Many-to-one: SeatingSponsorship → Donor (sponsor, optional)
- Many-to-one: SeatingSponsorship → Donation (sponsorship payment)

**Status Enums:**

```
SeatingStatus: AVAILABLE | PLEDGED | SPONSORED | RESERVED
```

**Unique Constraint:**

- `(projectId, seatNumber)` — Seat number must be unique within a project

**Indexes:**

- Primary key: `id`
- Foreign keys: `projectId`, `sponsorId`, `donationId`
- Query: `status`, `projectId`, `sponsorId`

---

## 7. Media & Notification Entities

### 7.1 Media

**Purpose:** Centralized media asset management.

**Fields:**

| Field          | Type               | Required | Unique | Notes                                                                 |
| -------------- | ------------------ | -------- | ------ | --------------------------------------------------------------------- |
| `id`           | String (UUID)      | ✓        | ✓      | Primary key                                                           |
| `projectId`    | String (UUID)      |          |        | Foreign key to Projects (optional, media may not be project-specific) |
| `fileName`     | String             | ✓        |        | Original file name                                                    |
| `fileType`     | String             | ✓        |        | MIME type (e.g., "image/jpeg", "video/mp4")                           |
| `fileSize`     | Int                | ✓        |        | File size in bytes                                                    |
| `storageUrl`   | String             | ✓        |        | URL to stored media                                                   |
| `thumbnailUrl` | String             |          |        | URL to thumbnail (for images/videos)                                  |
| `uploadedBy`   | String (UUID)      | ✓        |        | Foreign key to Users (uploader)                                       |
| `caption`      | String             |          |        | Media caption/description                                             |
| `altText`      | String             |          |        | Alt text for accessibility                                            |
| `category`     | String             |          |        | Category (e.g., "project-update", "progress-photo", "community")      |
| `status`       | Enum (MediaStatus) | ✓        |        | Status: UPLOADED, PROCESSING, PUBLISHED, ARCHIVED                     |
| `publishedAt`  | DateTime           |          |        | When media was published                                              |
| `createdAt`    | DateTime           | ✓        |        | Upload timestamp                                                      |
| `updatedAt`    | DateTime           | ✓        |        | Last update timestamp                                                 |

**Relationships:**

- Many-to-one: Media → Project (optional back-reference)
- Many-to-one: Media → User (uploader)

**Status Enums:**

```
MediaStatus: UPLOADED | PROCESSING | PUBLISHED | ARCHIVED
```

**Indexes:**

- Primary key: `id`
- Foreign keys: `projectId`, `uploadedBy`
- Query: `status`, `publishedAt`, `projectId`

---

### 7.2 NotificationPreferences

**Purpose:** User notification subscription settings.

**Fields:**

| Field                      | Type            | Required | Unique | Notes                                        |
| -------------------------- | --------------- | -------- | ------ | -------------------------------------------- |
| `id`                       | String (UUID)   | ✓        | ✓      | Primary key                                  |
| `userId`                   | String (UUID)   | ✓        |        | Foreign key to Users                         |
| `emailOnDonationReceipt`   | Boolean         | ✓        |        | Email donation receipt                       |
| `emailOnProjectUpdate`     | Boolean         | ✓        |        | Email project updates                        |
| `emailOnPledgeReminder`    | Boolean         | ✓        |        | Email pledge payment reminders               |
| `emailOnMilestone`         | Boolean         | ✓        |        | Email when project hits milestone            |
| `smsOnPaymentDue`          | Boolean         | ✓        |        | SMS when pledge payment is due               |
| `pushNotificationsEnabled` | Boolean         | ✓        |        | Enable push notifications (if app exists)    |
| `notificationFrequency`    | String          |          |        | Frequency: IMMEDIATE, DAILY, WEEKLY, MONTHLY |
| `preferredLanguage`        | String (2-char) |          |        | ISO 639-1 language code (en, fr, sw)         |
| `updatedAt`                | DateTime        | ✓        |        | Last update timestamp                        |

**Relationships:**

- One-to-one: NotificationPreferences ↔ User (back-reference)

**Unique Constraint:**

- `userId` — One preferences record per user

**Indexes:**

- Primary key: `id`
- Unique foreign key: `userId`

---

### 7.3 Notifications

**Purpose:** Notification/message audit log.

**Fields:**

| Field               | Type                      | Required | Unique | Notes                                                                       |
| ------------------- | ------------------------- | -------- | ------ | --------------------------------------------------------------------------- |
| `id`                | String (UUID)             | ✓        | ✓      | Primary key                                                                 |
| `userId`            | String (UUID)             | ✓        |        | Foreign key to Users (recipient)                                            |
| `type`              | String                    | ✓        |        | Notification type (DONATION_RECEIPT, PROJECT_UPDATE, PLEDGE_REMINDER, etc.) |
| `title`             | String                    | ✓        |        | Notification title                                                          |
| `message`           | String                    |          |        | Notification message body                                                   |
| `channel`           | String                    | ✓        |        | Channel: EMAIL, SMS, PUSH, IN_APP                                           |
| `relatedDonationId` | String (UUID)             |          |        | Foreign key to Donations (optional, for donation-related notifications)     |
| `relatedProjectId`  | String (UUID)             |          |        | Foreign key to Projects (optional, for project-related notifications)       |
| `sentAt`            | DateTime                  | ✓        |        | Timestamp when notification was sent                                        |
| `deliveredAt`       | DateTime                  |          |        | Timestamp when delivery was confirmed                                       |
| `readAt`            | DateTime                  |          |        | Timestamp when user read the notification (if in-app)                       |
| `status`            | Enum (NotificationStatus) | ✓        |        | Status: PENDING, SENT, FAILED, DELIVERED, READ                              |
| `failureReason`     | String                    |          |        | Error reason if delivery failed                                             |
| `createdAt`         | DateTime                  | ✓        |        | Record creation timestamp                                                   |

**Relationships:**

- Many-to-one: Notification → User (back-reference)
- Many-to-one: Notification → Donation (optional back-reference)
- Many-to-one: Notification → Project (optional back-reference)

**Status Enums:**

```
NotificationStatus: PENDING | SENT | FAILED | DELIVERED | READ
```

**Indexes:**

- Primary key: `id`
- Foreign keys: `userId`, `relatedDonationId`, `relatedProjectId`
- Query: `sentAt`, `status`, `userId`

---

## 8. Audit & System Entities

### 8.1 AuditLog

**Purpose:** Immutable record of sensitive operations for compliance and debugging.

**Fields:**

| Field          | Type               | Required | Unique | Notes                                                                      |
| -------------- | ------------------ | -------- | ------ | -------------------------------------------------------------------------- |
| `id`           | String (UUID)      | ✓        | ✓      | Primary key                                                                |
| `actorId`      | String (UUID)      |          |        | Foreign key to Users (who performed action, null if system)                |
| `action`       | String             | ✓        |        | Action type (e.g., "DONATION_VERIFIED", "BUDGET_APPROVED", "USER_CREATED") |
| `entityType`   | String             | ✓        |        | Entity being acted upon (e.g., "Donation", "User", "Budget")               |
| `entityId`     | String (UUID)      | ✓        |        | ID of entity being acted upon                                              |
| `description`  | String             |          |        | Detailed description of action                                             |
| `oldValues`    | JSON               |          |        | Previous values (before change)                                            |
| `newValues`    | JSON               |          |        | New values (after change)                                                  |
| `ipAddress`    | String             |          |        | IP address of actor (if web request)                                       |
| `userAgent`    | String             |          |        | User agent string (if web request)                                         |
| `status`       | Enum (AuditStatus) | ✓        |        | Status: SUCCESS, FAILURE, PENDING                                          |
| `errorMessage` | String             |          |        | Error details if status is FAILURE                                         |
| `timestamp`    | DateTime           | ✓        |        | Timestamp of action                                                        |

**Relationships:**

- Many-to-one: AuditLog → User (actor, optional)

**Status Enums:**

```
AuditStatus: SUCCESS | FAILURE | PENDING
```

**Constraints:**

- Immutable — once created, records cannot be modified
- Retention — logs should be archived after retention period (e.g., 7 years)

**Indexes:**

- Primary key: `id`
- Foreign keys: `actorId`, `entityId`
- Query: `timestamp`, `action`, `entityType`, `entityId`

---

## 9. Global Design Patterns

### 9.1 Timestamps

All entities include:

- `createdAt` — Record creation, set by database
- `updatedAt` — Last modification, updated automatically
- `archivedAt` — Soft-delete timestamp (null = active, optional for non-deletable records)

### 9.2 Soft Deletes

Where applicable, records are marked `archivedAt` instead of deleted:

- Users
- Donors
- Volunteers
- Pledges (can be cancelled, which is different from archived)

Records with `archivedAt IS NULL` are considered active.

### 9.3 Enums

All enum values are stored as VARCHAR strings in the database for readability and easier migration. Examples:

```sql
-- User roles
ADMIN, SUPER_ADMIN, DONOR, VOLUNTEER

-- Donation/Payment status
PENDING, VERIFIED, FAILED, CANCELLED

-- Project status
PLANNING, ACTIVE, PAUSED, COMPLETED, ARCHIVED
```

### 9.4 Decimal Precision

All monetary amounts use `Decimal(12, 2)` for USD values to ensure financial accuracy. This allows values up to `$9,999,999.99`.

### 9.5 Relationships at a Glance

| Relationship                        | Type | Notes                                      |
| ----------------------------------- | ---- | ------------------------------------------ |
| User ↔ Donor                        | 1:1  | Each user can have a donor profile         |
| Donor → Donations                   | 1:N  | Donor makes many donations                 |
| Donor → Pledges                     | 1:N  | Donor makes many pledges                   |
| Donation → Receipt                  | 1:1  | Each donation generates one receipt        |
| Pledge → Donations                  | 1:N  | Pledges can be paid via multiple donations |
| Project → Donations                 | 1:N  | Project receives many donations            |
| Project → Pledges                   | 1:N  | Project receives many pledges              |
| Project → ConstructionPhases        | 1:N  | Project has many construction phases       |
| ConstructionPhase → ProgressUpdates | 1:N  | Phase has many updates                     |
| Project → Budgets                   | 1:N  | Project has multiple budgets               |
| Budget → Expenses                   | 1:N  | Budget tracks many expenses                |
| Volunteer → VolunteerShifts         | 1:N  | Volunteer works many shifts                |
| Project → SeatingSponsorship        | 1:N  | Project has many seating sponsorships      |
| Donor → SeatingSponsorship          | 1:N  | Donor can sponsor many seats               |
| User → Media                        | 1:N  | User uploads many media files              |
| User → Notifications                | 1:N  | User receives many notifications           |
| User → AuditLog                     | 1:N  | User performs many audited actions         |

---

## 10. Future Confirmations

The following aspects are marked for future clarification and are **NOT YET DESIGNED**:

- **Payment Provider Integration Details** — How payment provider webhooks will be stored/audited
- **Notification Delivery Services** — Email/SMS provider integration details
- **Media Storage Service** — Cloud storage strategy (AWS S3, Cloudinary, etc.)
- **Multi-currency Handling** — Full multi-currency support strategy
- **Compliance & Tax** — Tax calculation and remittance workflows
- **Reporting Queries** — Specific business intelligence queries and aggregations
- **Caching Strategy** — Which entities/queries will need caching (Redis, in-memory)
- **Pagination & Filtering Defaults** — API response limits and default filter logic

---

## 11. Summary

This schema design provides:

- ✅ Comprehensive entity model for donors, projects, donations, pledges, payments, and receipts
- ✅ Construction and progress tracking
- ✅ Budget and expense management
- ✅ Volunteer and materials management
- ✅ Seating sponsorship support
- ✅ Media and notification infrastructure
- ✅ Audit logging for compliance
- ✅ Clear relationships and constraints
- ✅ Soft-delete and archive strategies
- ✅ Financial precision and integrity
- ✅ Scalable, normalized design

**Next Phase (Task 4):** Convert this design into `backend/prisma/schema.prisma` using Prisma syntax, create migrations, and establish database connectivity.
