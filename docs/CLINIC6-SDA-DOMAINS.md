# Clinic 6 SDA Domain Model & Business Rules

## Overview

This document defines the domain concepts, lifecycles, and business rules for the Clinic 6 SDA platform. It captures how entities transition through states and what rules govern those transitions.

**Status:** Design phase (business rules only, no code implementation)

**Alignment:** Based on CLINIC6-SDA-INCREMENTAL-IMPLEMENTATION-PLAN.md and CLINIC6-SDA-PRISMA-SCHEMA-DESIGN.md

---

## 1. Donor Domain

### 1.1 Donor Profile Lifecycle

A user with a `DONOR` role creates a donor profile to begin making contributions.

| State            | Status           | Description                                                                           |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------- |
| **New**          | ACTIVE           | Donor profile created; no donations or pledges yet                                    |
| **Active Giver** | ACTIVE           | Donor has made at least one verified donation or active pledge                        |
| **Inactive**     | INACTIVE         | Donor has not given in 12+ months (automatic or manual marking)                       |
| **Opted Out**    | INACTIVE         | Donor requests no further contact (respects optInMarketing=false, optInUpdates=false) |
| **Suspended**    | SUSPENDED        | Donor account flagged for review (e.g., suspected fraud)                              |
| **Archived**     | (archivedAt set) | Donor account closed/deleted (soft-delete)                                            |

### 1.2 Donor Aggregate State

**Key Rules:**

- `totalDonated` = SUM of all verified donations (`Donation.status = VERIFIED`)
- `totalPledged` = SUM of all active pledges (`Pledge.status = ACTIVE`)
- `donationCount` = COUNT of verified donations
- `pledgeCount` = COUNT of active pledges
- These aggregates are updated whenever a donation/pledge status changes

### 1.3 Communication Preferences

**Rules:**

- `optInMarketing = true` → Donor agrees to promotional emails
- `optInMarketing = false` → No marketing emails (GDPR/CAN-SPAM compliant)
- `optInUpdates = true` → Donor agrees to project update emails
- `optInUpdates = false` → No project emails
- `receiptEmailPreference` may differ from `User.email` if donor prefers separate email for receipts
- Notifications are sent only if both the donor's preference is enabled AND the system notification settings allow it

---

## 2. Currency & Multi-Currency Domain

### 2.1 Global Currency Architecture

**Overview:**

Clinic 6 operates in Kenya and serves an international donor base. The platform supports donations in multiple currencies while maintaining financial integrity and clear accounting.

**Core Principles (CONFIRMED):**

1. **KES is Settlement Currency** — Clinic 6's primary accounting and settlement currency is Kenyan Shilling (KES) [CONFIRMED]
2. **Global Active Display Currency** — The public website uses one active display currency across the site for applicable monetary figures [CONFIRMED]
3. **Display Currency is Presentation Preference** — Donors can view fundraising targets and amounts in any supported display currency [CONFIRMED]
4. **Transaction Currency is What Donor Pays** — Recorded at time of payment (e.g., USD, EUR, GBP, KES) [CONFIRMED]
5. **Historical Values are Immutable** — Once a donation is VERIFIED, original transaction amounts and exchange rates are never recalculated [CONFIRMED]
6. **Traceability is Mandatory** — Every converted value is traceable to source currency, target currency, exchange rate, timestamp, and provider [CONFIRMED]
7. **Extensible Catalog** — The currency catalog is NOT limited to a fixed set of currencies [CONFIRMED]

**Important Rule:** Display currency, transaction currency, and settlement currency are distinct concepts. Changing the active display currency must not change historical donation records, receipt values, settlement amounts, or exchange-rate snapshots.

**Currency Catalog Architecture (CONFIRMED - Extensible):**

The platform maintains a centralized, configurable currency catalog. The system is designed to support any ISO 4217 currency without code changes.

**Examples of Initial/Common Supported Currencies:**

- KES (Kenyan Shilling) — Primary settlement currency, always active
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- CHF (Swiss Franc)
- JPY (Japanese Yen)
- CNY (Chinese Yuan)
- ZAR (South African Rand)
- NGN (Nigerian Naira)
- TZS (Tanzanian Shilling)
- UGX (Ugandan Shilling)
- RWF (Rwandan Franc)
- AED (United Arab Emirates Dirham)
- SAR (Saudi Arabian Riyal)

**Note:** This list represents common initial currencies. The Currency entity supports an arbitrary number of currencies. Additional currencies can be activated/configured without schema changes or code deployment. The catalog is the single source of truth.

### 2.2 Centralized Currency Catalog

**Definition:**

A single source of truth for all currency data accessible to frontend, backend, and external systems.

**Currency Catalog Entry Contains:**

- `code` — ISO 4217 code (e.g., "KES", "USD")
- `name` — Full name (e.g., "Kenyan Shilling")
- `symbol` — Display symbol (e.g., "KSh", "$", "€")
- `decimalPlaces` — Decimal precision (usually 2, some 0-3)
- `active` — Whether currently enabled for donations
- `searchAliases` — Names/terms for searching (e.g., ["Kenya", "shilling", "KSH"])
- `displayOrder` — Ranking in selector (KES first, then donor's detected currency, then alphabetical)
- `countries` — List of countries using this currency (for geographic detection)
- `countryCodes` — ISO 3166-1 alpha-2 codes (for IP-based detection)

**Example Entry:**

```json
{
  "code": "KES",
  "name": "Kenyan Shilling",
  "symbol": "KSh",
  "decimalPlaces": 2,
  "active": true,
  "searchAliases": ["Kenya", "shilling", "ksh"],
  "displayOrder": 1,
  "countries": ["Kenya"],
  "countryCodes": ["KE"]
}
```

### 2.3 Automatic Currency Detection (6-Layer Strategy - [CONFIRMED])

**Status:** [CONFIRMED] Automatic detection follows a 6-layer priority hierarchy. Implementation details such as specific geolocation APIs and privacy consent mechanisms are [IMPLEMENTATION DETAIL].

**Principle:** Automatically detect donor's preferred currency without restricting their choices.

**[CONFIRMED] Detection Priority (First Match Wins):**

1. **Saved Donor Preference** — If authenticated, check Donor.preferredDisplayCurrency [CONFIRMED: highest priority]
2. **Explicit Selection** — If donor manually selects currency, use it [CONFIRMED: manual selection overrides auto-detection]
3. **Browser Locale** — navigator.language (e.g., "en-KE", "en-US", "fr-FR") → Map locale to primary country → primary currency [CONFIRMED]
   - Implementation: Exact locale parsing and country mapping are [IMPLEMENTATION DETAIL]
   - Fallback: Proceed to next layer if locale unavailable
4. **Browser Timezone** — Detect timezone offset, approximate country, map to currency [CONFIRMED]
   - Limitation: Timezone only provides approximate region, not exact country
   - Fallback: Proceed to next layer if timezone resolution fails or is ambiguous
5. **IP-Based Geolocation** — If approved and available, detect country from IP → primary currency [CONFIRMED]
   - Privacy: Requires clear user disclosure and consent [CONFIRMED]
   - Fallback: User can opt out; system proceeds to next layer
   - Accuracy: IP geolocation may be inaccurate or unavailable
6. **Fallback** — If all above fail, default to KES [CONFIRMED]

**Critical Caveats (CONFIRMED):**

- Browser cannot always accurately determine location (user may be traveling)
- IP geolocation is approximate and may be inaccurate or blocked
- Website must remain fully functional if geolocation is unavailable or denied
- No detection mechanism should block or degrade donor experience
- Message to user: "We've automatically selected [Currency] based on your location. You can change this anytime."
- Automatic detection is a convenience feature, NOT a restriction

### 2.4 Manual Currency Override

**Rules:**

1. Donor can always change automatically detected currency
2. Manual selection overrides automatic detection
3. Selection can be per-session (anonymous) or saved (authenticated)
4. Selected currency persists across pages during session
5. For authenticated donors, preference is stored in Donor.preferredDisplayCurrency
6. System never forces donor to use detected country's currency
7. Principle: Currency selection is a convenience, not a restriction

### 2.5 Currency Search & Filter

**Donor Experience:**

- Global currency selector with responsive search field
- Search by: code, name, symbol, country name, country code, aliases
- Requirements: case-insensitive, partial matching, handles whitespace, fast/responsive, dynamic updates (no Enter required)

**Search Logic:**

1. Accept search input (case-insensitive)
2. Match against: code, name, symbol, country.name, country.code, aliases (all searchable)
3. Score results by relevance (ranking priority):
   - Exact code match → Highest (e.g., "KES" → {"code": "KES"})
   - Code prefix match → High (e.g., "K" → KES, KWD, etc.)
   - Exact name match → High (e.g., "Kenyan Shilling")
   - Name partial match → Medium (e.g., "Shilling" → KES, GBP, etc.)
   - Country exact match → Medium (e.g., "Kenya")
   - Country partial match → Low (e.g., "Ken" → Kenya)
   - Symbol match → Low (e.g., "$" → USD, CAD, AUD, ZAR)
   - Aliases → Low (e.g., "shilling" → KES)
4. Display top results ordered by score
5. Show multiple matches clearly
6. If multiple currencies per country, show all and indicate primary
7. Empty state: "No currencies found" (informational, not an error)
8. Clearing search immediately restores complete active currency list
9. Selected currency remains visibly marked even during search

**Result Display Format:**

```
[Flag] Currency Name / CODE · Country
```

Examples:

```
🇰🇪 Kenyan Shilling / KES · Kenya
🇺🇸 United States Dollar / USD · United States
🇪🇺 Euro / EUR · European Union (19 countries)
```

### 2.6 Site-Wide Display Currency Behavior

**Rules:**

1. One global active display currency is applied across the public website wherever monetary figures are displayed [CONFIRMED]
2. The active display currency is an application-level preference, not a per-page setting and not a transaction currency [CONFIRMED]
3. Applies to: fundraising targets, amounts raised, remaining balance, donation amounts, suggested amounts, pledge amounts, construction budget, project summaries, seating prices, expenses, budgets, campaign progress, donation forms, donor summaries, receipts, financial statistics, announcements
4. When donor selects EUR → all applicable figures display EUR equivalents
5. When donor switches to KES → all figures immediately update to KES equivalents
6. Donor does NOT have to select currency separately per page
7. No inconsistent display (USD on one page, KES on another) unless explicitly labeled
8. Frontend consumes normalized values + currency metadata from API, not arbitrary conversions
9. Display amounts may be calculated from settlement amounts using current exchange rates for presentation only [CONFIRMED]
10. Changing display currency does NOT modify historical financial records, payment settlement records, receipt snapshots, or exchange-rate history [CONFIRMED]
11. Automatic detection only initializes the default display currency; it must not change donation transaction currency, settlement currency, receipt currency, or historical exchange-rate records [CONFIRMED]
12. Donor may always manually override the detected display currency [CONFIRMED]

### 2.7 Display vs Transaction vs Settlement Currencies

**Clear Distinctions:**

| Aspect                   | Description                                               | Example                                     |
| ------------------------ | --------------------------------------------------------- | ------------------------------------------- |
| **Display Currency**     | What user sees on website (presentation preference)       | Donor in UK sees "£100"                     |
| **Transaction Currency** | What donor actually pays (payment method determines this) | Donor pays in USD via bank transfer: $100   |
| **Settlement Currency**  | What Clinic 6 receives and accounts (KES)                 | Clinic 6 receives 12,950 KES                |
| **Exchange Rate**        | Conversion from transaction to settlement                 | 1 USD = 129.50 KES (at time of transaction) |

**Example Flow:**

1. Donor in UK selects EUR for display
2. Website shows: "Donate €90"
3. Donor clicks Donate and is directed to payment provider
4. Donor chooses payment method (Bank transfer in USD)
5. Payment provider: $100 USD charged to donor account
6. Backend records: amountOriginal=100, currencyOriginal=USD, exchangeRate=129.50, amountSettlement=12950, currencySettlement=KES
7. Receipt shows: "Donation: €90 (equivalent USD: $100, settled as KES 12,950)"
8. Display currency change does NOT modify historical values

### 2.8 Currency Conversion Architecture

**Principles:**

1. Every converted value must be traceable
2. Conversion is performed at authoritative exchange-rate source (not hardcoded)
3. Exchange rates are immutable once applied to transaction
4. Historical rates are preserved, never recalculated

**Traceability Requirements:**

Every conversion must record:

- Source currency code
- Target currency code
- Source amount
- Converted amount
- Exchange rate used
- Exchange-rate timestamp (when rate was obtained)
- Exchange-rate provider/source (e.g., "openexchangerates", "xe.com", "Central Bank Kenya")
- Conversion precision (decimal places)
- Rounding rules applied

**Example:**

```
Original:  100 USD
Rate:      1 USD = 129.50 KES (from CBK at 2026-08-13 14:30:00)
Settlement: 12,950 KES
```

### 2.9 Exchange Rate Locking

**Rules:**

1. Exchange rate for confirmed transaction is locked at time of payment confirmation
2. Historical transactions NEVER use current exchange rates (they use original rates)
3. Historical receipts remain immutable re: original conversion
4. Display conversions use current rates (cosmetic only)
5. Settlement conversions use locked rates (immutable for accounting)

**Scenario:**

- Donation confirmed on 2026-01-01: 100 USD = 12,900 KES (rate on that day)
- Today (2026-08-13): 100 USD = 13,100 KES (current rate)
- Historical receipt: Still shows 12,900 KES (original rate preserved)
- Display conversion: Uses current rate (13,100 KES) for real-time dashboard only

---

## 3. Donation Domain (Updated)

### 3.1 Donation Lifecycle

A donation is a single contribution by a donor to a project.

```
[PENDING] → [PROCESSING] → [VERIFIED] → (final)
    ↓           ↓
[FAILED] → (no further action)
    ↓
[CANCELLED] → (before payment confirmation)
```

| State          | Status     | Meaning                                              | Who Can Trigger                         | Next Allowed State             |
| -------------- | ---------- | ---------------------------------------------------- | --------------------------------------- | ------------------------------ |
| **Pending**    | PENDING    | Payment initiated, awaiting processing               | Donor starts donation                   | PROCESSING, FAILED, CANCELLED  |
| **Processing** | PROCESSING | Payment submitted to provider, awaiting confirmation | Payment processor                       | VERIFIED, FAILED               |
| **Verified**   | VERIFIED   | Payment confirmed by authoritative infrastructure    | Payment provider webhook/confirmation   | REFUNDED, REVERSED (future)    |
| **Failed**     | FAILED     | Payment failed; donation not credited                | Payment processor or timeout            | (no further transitions)       |
| **Cancelled**  | CANCELLED  | Donor cancelled before payment                       | Donor or admin                          | (no further transitions)       |
| **Refunded**   | REFUNDED   | Payment refunded after VERIFIED (future)             | Donor request or chargeback             | (final, audit trail preserved) |
| **Reversed**   | REVERSED   | Payment reversed after VERIFIED (future)             | Donor chargeback or fraud investigation | (final, audit trail preserved) |

### 3.2 Payment Confirmation Workflow (CONFIRMED)

**STATUS: CONFIRMED REQUIREMENT**

**CRITICAL RULE (CONFIRMED):** A donation is NOT considered received and verified because:

- ❌ Donor clicked "Donate"
- ❌ Payment page opened
- ❌ Donor returned to website
- ❌ Frontend received success response from payment processor
- ❌ Donor saw success screen
- ❌ Client-side code reports transaction successful

**AUTHORITATIVE STATUS (CONFIRMED):** Donation is VERIFIED only after reliable confirmation from an authoritative payment provider/bank infrastructure.

**Verification Sources [CONFIRMED]:**

- ✅ Payment provider webhook with verified authenticity [CONFIRMED as primary]
- ✅ Bank transfer confirmation from financial institution [CONFIRMED as alternative]
- ✅ Approved authoritative reconciliation mechanism [CONFIRMED as fallback]

**Payment Provider Architecture [CONFIRMED]:** The platform uses a provider-neutral payment architecture. The specific payment infrastructure provider will be selected during implementation without changing the financial domain model.

**Workflow (CONFIRMED):**

1. Donor selects amount and currency → donation moves to PENDING
2. Donation record created with: amountOriginal, currencyOriginal, exchangeRateUsed, transactionReference
3. Donor sent to payment provider (specific provider selected during implementation [IMPLEMENTATION DETAIL])
4. Payment provider processes payment → donation moves to PROCESSING
5. Payment provider sends authoritative confirmation (webhook, API callback, or reconciliation report)
6. **Backend receives and verifies confirmation authenticity** (never trust client-side notification alone)
7. If payment confirmed by authoritative source:
   - PaymentEvent.processed = true
   - Donation.status = VERIFIED
   - Donation.paymentVerifiedAt = current timestamp
   - Settlement record created with amountKES and exchangeRate
   - Receipt generated
   - Thank-you notification triggered
   - Donor aggregates updated
   - Project aggregates updated
   - Fundraising totals updated
8. If payment failed or unconfirmed:
   - Donation.status = FAILED
   - Donation.paymentFailedReason = error message from authoritative source
   - Donor notified of failure
   - No settlement record created
   - No receipt generated

### 3.3 Donation Business Rules (Multi-Currency)

**Financial Rules:**

1. `amountOriginal > 0` — Original transaction amount must be positive
2. `amountSettlement > 0` — Settlement amount (in KES) must be positive
3. `exchangeRateUsed > 0` — Exchange rate must be positive
4. `transactionReference` is unique globally (prevents duplicate processing)
5. `currencyOriginal` is ISO 4217 code (KES, USD, EUR, etc.)
6. `currencySettlement` is always "KES"

**Status Transition Rules:**

1. When `status` transitions to `VERIFIED`:
   - `paymentVerifiedAt` is set to current timestamp
   - Donor's `totalDonatedKES` aggregate is incremented by `amountSettlement`
   - Donor's `totalDonatedOriginal` aggregate is incremented by `amountOriginal`
   - Donor's `donationCount` is incremented
   - Project's `raisedAmountKES` is incremented by `amountSettlement`
   - Project's `raisedAmountOriginal` is incremented by `amountOriginal`
   - Receipt is auto-generated
   - Settlement record is created
   - Thank-you notification is triggered
2. When `status` is `FAILED`:
   - `paymentFailedReason` contains error message from payment provider
   - Donor is NOT credited
   - Project is NOT credited
   - No settlement, no receipt, no notification

**Immutable Fields (After VERIFIED):**

- `amountOriginal` — Original transaction amount never changes
- `currencyOriginal` — Original currency never changes
- `exchangeRateUsed` — Rate at time of transaction is preserved
- `exchangeRateTimestamp` — When rate was captured is preserved
- `amountSettlement` — Settlement amount never recalculated
- `currencySettlement` — Settlement currency never changes

**Visibility Rules:**

1. If donation `anonymous = true`:
   - Donor's name is not shown publicly
   - Donor still receives receipt privately
   - Public reports don't list donor name
2. If donation `publicRecognition = true`:
   - Donor may be publicly acknowledged (name, amount, date, currency)
   - Requires `anonymous = false`
   - Requires `optInMarketing = true`

### 3.4 Idempotency & Duplicate Protection

**Principle:** If the same payment event arrives multiple times (webhook retries, system failures), the system must handle it safely.

**Rules:**

1. `transactionReference` is globally unique (prevents duplicate donations)
2. `PaymentEvent.eventId` is globally unique (prevents duplicate processing)
3. If webhook event arrives twice:
   - First arrival: Creates/updates donation, marks PaymentEvent.processed=true
   - Second arrival: Recognizes eventId, skips reprocessing, logs as duplicate
   - Result: No duplicate donations, receipts, thank-yous, or settlement records
4. Donation counts are never incremented twice
5. Fundraising totals are never double-counted

**Implementation:**

- Check if `transactionReference` exists before creating donation
- Check if `eventId` exists before processing event
- If exists with same outcome, return success (idempotent)
- If exists with different outcome, log conflict for manual review
- Unique constraints on database level enforce this

---

## 4. Receipt Domain (Updated)

### 4.1 Receipt Generation Workflow

**Trigger:** Near-real-time after payment confirmation

**Workflow:**

1. Payment confirmed → Donation.status = VERIFIED
2. Event processing verifies authenticity of webhook
3. Settlement amount calculated and recorded
4. Receipt generated with:
   - Unique receipt number (e.g., RCP-2026-001234)
   - Donor name and contact info (where permitted)
   - Donation date/time
   - Original amount + currency (e.g., "USD 100")
   - Settlement amount + currency (e.g., "KES 12,950")
   - Exchange rate applied (e.g., "1 USD = 129.50 KES")
   - Exchange rate timestamp
   - Payment reference/transaction ID
   - Donation purpose (project name)
   - Project ID for audit trail
   - Payment status (VERIFIED)
   - Receipt creation timestamp
   - Tax/charitable status (where legally applicable)
   - Appropriate disclaimer/legal text
5. Receipt is sent to donor via configured channels (email, PDF download, SMS notification)
6. Receipt delivery tracked separately from payment status

### 4.2 Receipt Design & Historical Preservation

**Critical Rules:**

1. Receipt values are preserved historically (never recalculated)
2. Original amounts in receipt never change
3. Original exchange rate in receipt never recalculates
4. Historical receipt for "USD 100 = KES 12,900" remains unchanged even if USD→KES rate changes
5. New receipts can only be generated for new donations
6. Duplicate receipts for same donation use same receipt number

**Receipt Contents (Immutable):**

```
═══════════════════════════════════════════════════════════════
                     DONATION RECEIPT
═══════════════════════════════════════════════════════════════

Receipt #: RCP-2026-001234
Date: 2026-08-13
Status: Verified

Donor:
  Name: Jane Doe
  Email: jane@example.com

Project: Clinic 6 Church Construction
Project ID: proj-12345

Donation Amount:
  Original: USD 100.00
  Settlement: KES 12,950.00
  Exchange Rate: 1 USD = 129.50 KES (as of 2026-08-13 14:30:00 UTC)

Payment Method: Bank Transfer
Transaction ID: PROV-2026-ABCD1234

For Clinic 6 Seventh-day Adventist Church
Charity/NPO Registration Number: [...]
Tax Exemption ID: [...]

═══════════════════════════════════════════════════════════════
```

### 4.3 Receipt Delivery

**Channels:**

1. EMAIL — Primary delivery
2. PDF DOWNLOAD — Available in donor account
3. SMS — Notification only (with download link)
4. IN-APP — Accessible in donor account history

**Rules:**

- Multiple channels supported simultaneously
- Failure in one channel doesn't prevent others
- Delivery status tracked separately per channel
- Retry logic for failed deliveries
- Donor can request resend

---

## 5. Thank-You Notification Domain

### 5.1 Warm, Christ-Centered Thank-You Workflow

**Trigger:** Immediately after Donation.status = VERIFIED

**Message Tone & Content:**

- Sincere, respectful gratitude
- Warm, Christ-centered appreciation (without assuming donor's religious identity)
- Specific reference to donation purpose (project name)
- Confirmation that donation was received
- Support for construction/mission
- Inviting continued partnership

**Example Message:**

```
Subject: Thank You for Your Generous Gift to Clinic 6 Church

Dear [Donor Name],

Thank you sincerely for your generous contribution toward the Clinic 6
Seventh-day Adventist Church construction project. Your gift has been received
and recorded with gratitude.

We deeply appreciate your support, prayers, and partnership in helping provide
a lasting place of worship and service to the community. Your donation will
directly impact the lives of countless individuals seeking spiritual refuge and
community connection.

Donation Summary:
  Amount: USD 100.00 (settled as KES 12,950)
  Date: 2026-08-13
  Project: Clinic 6 Church Construction
  Receipt: RCP-2026-001234 [Download Receipt]

With heartfelt appreciation and prayers,

Clinic 6 SDA Church Leadership
```

**Message Channels:**

1. EMAIL — Primary
2. SMS — Brief notification with link to full message
3. IN-APP — Notification dashboard
4. PHYSICAL MAIL — (Future) For major donors

**Rules:**

1. Message is triggered automatically upon VERIFIED status
2. Message respects donor's communication preferences (optInUpdates)
3. Message can be customized per project (template system)
4. Message includes clear call-to-action (project link, donation history, etc.)
5. Message does NOT hard-code values (uses dynamic templating)

### 5.2 Notification Delivery & Tracking

**Delivery Tracking:**

Separate from payment status. Example states:

| Notification | Donation | Email     | SMS       |
| ------------ | -------- | --------- | --------- |
| Status       | VERIFIED | DELIVERED | FAILED    |
| Status       | VERIFIED | FAILED    | PENDING   |
| Status       | VERIFIED | DELIVERED | DELIVERED |

**Rules:**

1. Notification status is independent from payment status
2. Failed email does NOT mark donation as failed
3. Failed SMS does NOT mark donation as failed
4. Retry logic attempts delivery multiple times (e.g., 3 attempts over 24 hours)
5. Manual retry available for admin
6. Bounce/invalid email address is flagged for donor update

---

## 6. Refund & Reversal Domain

### 6.1 Refund/Reversal Lifecycle

A refund or reversal is a financial adjustment after donation is VERIFIED.

```
[REFUND_PENDING] → [REFUND_PROCESSING] → [REFUND_COMPLETED] → (final)
                        ↓
                   [REFUND_FAILED] → (no change)
```

### 6.2 Refund/Reversal Business Rules

**Critical Rule:** Original donation is NEVER deleted or modified.

**Rules:**

1. Refund/reversal is a separate transaction linked to original donation
2. Original donation record remains VERIFIED (immutable)
3. New RefundReversal record created with:
   - Reference to original donation ID
   - Amount refunded
   - Reason for refund
   - Who initiated refund
   - Refund status
4. Upon refund completion:
   - Donation.status remains VERIFIED (historical record)
   - Settlement amount for refund calculated
   - Financial aggregates adjusted (totals reduced)
   - Original settlement remains in audit trail
5. Audit trail preserved completely:
   - Original donation: VERIFIED, 12,950 KES received
   - Refund record: -12,950 KES refunded
   - Net impact: 0 KES (but both transactions visible)

---

## 7. Payment Infrastructure & Idempotency

### 7.1 Webhook Processing

**Principles:**

1. Webhooks are never trusted at face value (always verify with provider)
2. Webhook processing is idempotent (can safely replay)
3. Webhook processing is transactional (all-or-nothing)

**Workflow:**

1. Receive webhook from payment provider
2. Verify webhook authenticity (signature/HMAC verification)
3. Check if PaymentEvent.eventId exists (prevent duplicates)
4. If exists: Return 200 OK (idempotent, no re-processing)
5. If not exists: Process event (create/update donation, generate receipt, etc.)
6. Store PaymentEvent with full webhook payload (for audit trail)
7. Mark PaymentEvent.processed = true
8. Return 200 OK to provider

### 7.2 Settlement & Financial Integrity

**KES Settlement Rules:**

1. KES is Clinic 6's primary settlement/accounting currency
2. All donations converted to KES for accounting purposes
3. Preserve in records:
   - Original transaction amount
   - Original transaction currency
   - Settlement amount (KES)
   - Exchange rate applied
   - Exchange rate timestamp
   - Exchange rate provider
4. Never overwrite original transaction with settlement amount
5. Both values remain permanently available for audit
6. Refunds/reversals similarly recorded

---

## 8. Project Domain

### 8.1 Pledge Lifecycle

A pledge is a commitment to make multiple donations over time.

```
[ACTIVE] → [COMPLETED] → (final)
   ↓↓
[PAUSED] → [ACTIVE] → [COMPLETED]
   ↓
[CANCELLED] → (no further action)
   ↓
[DEFAULTED] → (remediation required)
```

| State         | Status    | Meaning                                         | Who Can Trigger                        | Next Allowed State                      |
| ------------- | --------- | ----------------------------------------------- | -------------------------------------- | --------------------------------------- |
| **Active**    | ACTIVE    | Pledge is current; payments expected            | Donor or admin creates                 | PAUSED, COMPLETED, CANCELLED, DEFAULTED |
| **Paused**    | PAUSED    | Donor temporarily paused; resume later          | Donor or admin                         | ACTIVE, CANCELLED                       |
| **Completed** | COMPLETED | All installments paid or pledge ended naturally | System (auto on last payment) or admin | (final)                                 |
| **Cancelled** | CANCELLED | Donor cancels pledge                            | Donor or admin                         | (final)                                 |
| **Defaulted** | DEFAULTED | Payment missed; intervention needed             | System (auto after threshold)          | ACTIVE (if remediated), CANCELLED       |

### 8.2 Pledge Business Rules

**Required Rules:**

1. `totalAmount > 0` and `installmentAmount > 0`
2. `numberOfInstallments >= 1`
3. `amountPaid >= 0` and `amountPaid <= totalAmount`
4. `remainingAmount = totalAmount - amountPaid` (auto-calculated)
5. Upon pledge creation:
   - `startDate` is set
   - `expectedEndDate` calculated based on frequency and number of installments
   - `nextPaymentDueDate` = first due date
   - `status = ACTIVE`
   - Donor's `totalPledged` is incremented by `totalAmount`
   - Project's `pledgedAmount` is incremented by `totalAmount`

### 8.3 Pledge Payment Rules

**When a donation is applied to a pledge:**

1. Donation's amount is credited toward pledge's `amountPaid`
2. `remainingAmount = totalAmount - amountPaid`
3. `lastPaymentDate = donation.createdAt`
4. `nextPaymentDueDate` is recalculated based on frequency

**Pledge Auto-Completion:**

- When `amountPaid >= totalAmount`, pledge auto-transitions to `COMPLETED`
- `actualEndDate` is set to completion date

### 8.4 Pledge Default Handling

**When a payment is missed:**

1. If `currentDate > nextPaymentDueDate` and `amountPaid < totalAmount`:
   - System flags pledge as at-risk
   - After 14 days overdue: `status = DEFAULTED`
   - Admin can send reminder notifications (configurable template)
   - `defaultNoticesSent` is incremented
2. If payment arrives after default:
   - Admin can manually restore `status = ACTIVE`
   - System recalculates next due date

---

### 8.5 Project Lifecycle

A project transitions through phases as it develops.

```
[PLANNING] → [ACTIVE] → [COMPLETED] → (final)
   ↓        ↓        ↓
   └─→ [PAUSED] ──→ (same)
                └─→ [ARCHIVED]
```

| State         | Status    | Meaning                               | Public Visibility    | Can Receive Donations |
| ------------- | --------- | ------------------------------------- | -------------------- | --------------------- |
| **Planning**  | PLANNING  | Project is being prepared             | Hidden or Limited    | No                    |
| **Active**    | ACTIVE    | Project is open for donations         | Visible              | Yes                   |
| **Paused**    | PAUSED    | Temporarily halted; may resume        | Visible (greyed out) | No                    |
| **Completed** | COMPLETED | Project finished; all funds committed | Visible (historical) | No                    |
| **Archived**  | ARCHIVED  | No longer public                      | Hidden (admin only)  | No                    |

### 8.6 Project Aggregate State

**Key Rules:**

- `raisedAmount` = SUM of all `Donation.amount` where `Donation.status = VERIFIED` and `Donation.projectId = project.id`
- `pledgedAmount` = SUM of all `Pledge.totalAmount` where `Pledge.status IN (ACTIVE, PAUSED)` and `Pledge.projectId = project.id`
- `Progress % = (raisedAmount + pledgedAmount) / targetAmount * 100`, capped at 100%
- These aggregates are recalculated whenever donations/pledges change status

### 8.7 Project Completion Rules

**When `status` transitions to `COMPLETED`:**

1. `actualEndDate` is set to current timestamp
2. No new donations are accepted (system rejects if `status != ACTIVE`)
3. All active pledges are either completed or cancelled (admin decision)
4. Budget is finalized (no new expenses)

---

## 9. Construction & Progress Domain

### 9.1 Construction Phase Lifecycle

A construction phase represents a logical stage of the project.

```
[PLANNED] → [IN_PROGRESS] → [COMPLETED] → (final)
   ↓           ↓              ↓
   └─→ [ON_HOLD] ──→ [IN_PROGRESS] (resumed)
        ↓
   [DELAYED] ←─┘
```

| State           | Status      | Meaning                        | Can Accept Work Orders |
| --------------- | ----------- | ------------------------------ | ---------------------- |
| **Planned**     | PLANNED     | Phase is scheduled             | No                     |
| **In Progress** | IN_PROGRESS | Phase is actively underway     | Yes                    |
| **Delayed**     | DELAYED     | Phase is behind schedule       | Yes (rescheduled)      |
| **On Hold**     | ON_HOLD     | Phase is temporarily suspended | No                     |
| **Completed**   | COMPLETED   | Phase finished                 | No                     |

### 9.2 Phase Completion Rules

**When `status` transitions to `COMPLETED`:**

1. `percentComplete = 100`
2. `actualEndDate` is set to current timestamp
3. All in-progress work orders are closed
4. Final budget reconciliation occurs

### 9.3 Progress Update Rules

**When a progress update is published:**

1. Update can only reference phases belonging to the project
2. `publishedAt` is set to publication timestamp
3. Update is visible to public donors (if project is `ACTIVE`)
4. Update can optionally update parent phase's `percentComplete`

---

## 12. Budget & Expenses Domain

### 12.1 Budget Lifecycle

A budget year/category tracks financial planning and actuals.

```
[PLANNED] → [ACTIVE] → [REVIEWED] → [CLOSED] → (final)
```

| State        | Status   | Meaning                           | Can Accept Expenses |
| ------------ | -------- | --------------------------------- | ------------------- |
| **Planned**  | PLANNED  | Budget approved; year not started | No                  |
| **Active**   | ACTIVE   | Fiscal year is active             | Yes                 |
| **Reviewed** | REVIEWED | Budget under review; may adjust   | Yes (with approval) |
| **Closed**   | CLOSED   | Year ended; no new expenses       | No                  |

### 12.2 Budget Rules

**Required Rules:**

1. `allocatedAmount > 0` (budgets must have positive amounts)
2. `spentAmount >= 0` and `spentAmount <= allocatedAmount`
3. `remainingAmount = allocatedAmount - spentAmount` (auto-calculated)
4. Budget requires approval before activation:
   - `approvedBy` and `approvedAt` are set
   - Only ADMIN+ can approve
5. If `spentAmount >= allocatedAmount`:
   - New expense submissions against this budget trigger alert
   - May require exemption approval

### 12.3 Expense Lifecycle

An expense is a proposed or actual spending against a budget.

```
[PENDING] → [APPROVED] → [PAID] → (final)
   ↓
[REJECTED] → (no further action)
```

| State        | Status   | Meaning                | Can Update | Can Delete |
| ------------ | -------- | ---------------------- | ---------- | ---------- |
| **Pending**  | PENDING  | Submitted for approval | Yes        | Yes        |
| **Approved** | APPROVED | Approved by admin      | No         | No         |
| **Paid**     | PAID     | Payment has been made  | No         | No         |
| **Rejected** | REJECTED | Rejected; no payment   | Yes        | Yes        |

### 12.4 Expense Business Rules

**Required Rules:**

1. `amount > 0`
2. Expense must reference a valid `budgetId` with `status = ACTIVE`
3. Upon submission:
   - `status = PENDING`
   - `submittedBy` = user who submitted
   - `approvedBy = null`
4. Admin approval:
   - `status` transitions to `APPROVED`
   - `approvedBy` and `approvedAt` are set
   - Budget's `spentAmount` is incremented
   - If `spentAmount > allocatedAmount`, alert is raised
5. Rejection:
   - `status = REJECTED`
   - `rejectionReason` explains why
   - Budget not affected
6. Payment:
   - `status = PAID`
   - `paidAt = current timestamp`
   - Budget's `spentAmount` is verified/finalized

---

## 13. Volunteer Domain

### 13.1 Volunteer Status Lifecycle

```
[ACTIVE] → [INACTIVE_REQUEST] → [INACTIVE] → (archived)
   ↓
   └───────────────────────────────→ (no more shifts)
```

| State                | Status           | Meaning                    | Can Schedule Shifts   |
| -------------------- | ---------------- | -------------------------- | --------------------- |
| **Active**           | ACTIVE           | Available to work          | Yes                   |
| **Inactive Request** | INACTIVE_REQUEST | Volunteer requested break  | No (pending decision) |
| **Inactive**         | INACTIVE         | Volunteer is not available | No                    |
| **Archived**         | (archivedAt set) | Volunteer account closed   | No                    |

### 13.2 Volunteer Aggregate State

**Key Rules:**

- `totalHoursWorked` = SUM of all `VolunteerShift.hoursWorked` where `Shift.status = COMPLETED`
- Updated whenever a shift is marked complete
- Used for volunteer recognition and reporting

### 13.3 Shift Scheduling Rules

**Rules:**

1. Shifts can only be scheduled for `ACTIVE` volunteers
2. Shift date must be in the future (or current day)
3. Overlapping shifts for same volunteer trigger warning (admin can override)
4. Volunteer can self-cancel shifts with 24-hour notice [CONFIRMED]

---

## 14. Seating Sponsorship Domain

### 14.1 Seat Status Lifecycle

```
[AVAILABLE] → [PLEDGED] → [SPONSORED] → (final)
   ↓
   └──→ [RESERVED]
```

| State         | Status    | Meaning                                  | Can Be Reassigned      |
| ------------- | --------- | ---------------------------------------- | ---------------------- |
| **Available** | AVAILABLE | Seat is open for sponsorship             | Yes (auto-release)     |
| **Pledged**   | PLEDGED   | Donor has committed; waiting for payment | Yes (if payment fails) |
| **Sponsored** | SPONSORED | Seat is claimed; sponsorship active      | No                     |
| **Reserved**  | RESERVED  | Seat held for special circumstance       | Yes (if released)      |

### 14.2 Sponsorship Workflow

**When a seat is sponsored:**

1. Donor initiates donation linked to seating campaign
2. Seat status transitions: `AVAILABLE` → `PLEDGED`
3. Donation is processed (see Donation Domain)
4. When donation `status = VERIFIED`:
   - Seat status transitions: `PLEDGED` → `SPONSORED`
   - `sponsorId` = Donor ID
   - `sponsorshipDate` = verification date
   - `donationId` = linked Donation ID
   - If requested, `dedicationPlaque` is recorded (e.g., "In Memory of John Doe")

### 14.3 Seat Availability Rules

**If sponsored seat becomes available (e.g., sponsorship cancelled):**

1. Admin can reassign seat to another donor
2. Or seat transitions back to `AVAILABLE` for new sponsorships
3. History is preserved (audit log tracks changes)

---

## 15. Media Domain

### 15.1 Media Lifecycle

```
[UPLOADED] → [PROCESSING] → [PUBLISHED] → (final)
                ↓
            (error)
            [UPLOADED] → (retry)

[PUBLISHED] → [ARCHIVED] → (final)
```

| State          | Status     | Meaning                            | Public Visible | Can Edit |
| -------------- | ---------- | ---------------------------------- | -------------- | -------- |
| **Uploaded**   | UPLOADED   | File received; awaiting processing | No             | Yes      |
| **Processing** | PROCESSING | File being optimized/transcoded    | No             | No       |
| **Published**  | PUBLISHED  | Ready for public viewing           | Yes            | No       |
| **Archived**   | ARCHIVED   | Removed from public view           | No             | No       |

### 15.2 Media Rules

**Rules:**

1. `fileSize` limits enforced: 50 MB maximum per file [CONFIRMED], configurable during implementation [IMPLEMENTATION DETAIL]
2. `fileType` must be supported (e.g., image/jpeg, image/png, video/mp4)
3. Processing:
   - Images: Generate thumbnail, optimize, store
   - Videos: Transcode to multiple bitrates, generate thumbnail
   - Other: Virus scan, store
4. `storageUrl` is permanent once published (immutable)
5. Media can only be deleted (archived) by admin who uploaded it or higher privilege

---

## 16. Notification Domain

### 16.1 Notification Delivery Lifecycle

```
[PENDING] → [SENT] → [DELIVERED] → [READ] (if in-app)
   ↓
[FAILED] → (no further action)
```

| State         | Status    | Meaning                              | Can Retry       |
| ------------- | --------- | ------------------------------------ | --------------- |
| **Pending**   | PENDING   | Queued for delivery                  | Yes             |
| **Sent**      | SENT      | Sent to delivery channel             | Yes (if failed) |
| **Failed**    | FAILED    | Delivery failed; may retry           | Yes             |
| **Delivered** | DELIVERED | Confirmed received by channel        | No              |
| **Read**      | READ      | User read notification (in-app only) | No              |

### 16.2 Notification Rules

**Sending Rules:**

1. Notification sent only if user's preference allows:
   - Check `NotificationPreferences` for the notification type
   - Respect `optInMarketing`, `optInUpdates` flags
2. Notifications are language-localized:
   - Use `NotificationPreferences.preferredLanguage`
   - Fallback to "en" if not set
3. Delivery channels:
   - EMAIL: Via email service (Mailgun, SendGrid, etc.)
   - SMS: Via SMS provider (Twilio, etc.)
   - PUSH: Via push notification service (Firebase, etc.)
   - IN_APP: Stored in database for web/app retrieval

**Retry Logic:**

- FAILED notifications auto-retry up to 3 times (configurable)
- After final failure, admin can manually retry or mark as abandoned

### 16.3 Notification Types

**Supported notification types:**

| Type                       | Trigger                       | Channel    | Required Preference    |
| -------------------------- | ----------------------------- | ---------- | ---------------------- |
| `DONATION_RECEIPT`         | Donation verified             | EMAIL      | emailOnDonationReceipt |
| `PROJECT_UPDATE`           | Progress update published     | EMAIL      | emailOnProjectUpdate   |
| `PLEDGE_REMINDER`          | Pledge payment due            | EMAIL, SMS | emailOnPledgeReminder  |
| `MILESTONE_ACHIEVED`       | Project hits 50%, 100% funded | EMAIL      | emailOnMilestone       |
| `PAYMENT_DUE_SOON`         | Pledge payment due in 3 days  | SMS        | smsOnPaymentDue        |
| `PAYMENT_OVERDUE`          | Pledge payment is past due    | EMAIL, SMS | emailOnPledgeReminder  |
| `VOLUNTEER_SHIFT_REMINDER` | Shift scheduled for tomorrow  | EMAIL, SMS | (system default)       |
| `BUDGET_ALERT`             | Expense exceeds budget        | EMAIL      | (admin notification)   |

---

## 17. Audit & Compliance Domain

### 17.1 Audit Log Rules

**What gets logged?**

- User login attempts (success/failure)
- Donation creation and status changes
- Pledge creation and status changes
- Receipt generation
- Budget approval and expense approval
- User account changes (email, role, status)
- Admin actions (manual overrides, corrections)
- Data exports/downloads (compliance)

**Immutability:**

- Audit logs are append-only (no updates or deletes)
- Timestamps are server-generated and immutable
- IP addresses and user agents are captured for forensics

### 17.2 Data Retention

**To be determined in Task 4:**

- Audit logs: 7 years (financial compliance)
- Soft-deleted records: 2 years (recovery window)
- Temporary records (notifications): 90 days

---

## 18. Business Constraint Summary

| Constraint             | Rule                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------- |
| **Financial Accuracy** | All monetary amounts use Decimal(12, 2); rounding follows standard accounting rules |
| **Uniqueness**         | Receipts and transactions have globally unique IDs; no duplicates allowed           |
| **Data Integrity**     | Foreign keys enforced; no orphaned records                                          |
| **Audit Trail**        | All sensitive operations logged; immutable history                                  |
| **Soft Deletes**       | Records archived, not deleted; recovery possible                                    |
| **Role-Based Access**  | Only appropriate roles can approve/modify records                                   |
| **Compliance**         | GDPR-compliant retention, data handling, and anonymization rules                    |
| **State Transitions**  | Only documented state transitions are allowed                                       |

---

## 19. Confirmed Business Rules & Design Decisions

The following business rules are now [CONFIRMED]:

1. **Pledge Default Threshold** — [CONFIRMED] 14 days overdue triggers `DEFAULTED` status (configurable during implementation)
2. **Default Reminder Frequency** — [CONFIRMED] Every 7 days for outstanding pledge obligations (configurable during implementation)
3. **Volunteer Shift Cancellation Notice** — [CONFIRMED] 24-hour minimum notice required for ordinary shifts. Authorized administrators may handle exceptional cases.
4. **Media File Size Limits** — [CONFIRMED] 50 MB maximum per uploaded file (configurable during implementation)
5. **Notification Retry Policy** — [CONFIRMED] 3 automatic retries for temporary notification-delivery failures. After retry exhaustion, notification status becomes FAILED.
6. **Audit Log Retention** — [CONFIRMED] 7 years as the initial audit-log retention requirement. Audit records must remain immutable.
7. **Tax Exemption Handling** — [CONFIRMED] Architecture rule: Do NOT assume automatic tax calculation/remittance. System should preserve ability to record tax/exemption metadata where required by jurisdiction. [IMPLEMENTATION DETAIL] Specific tax jurisdiction handling will be determined during implementation.
8. **Currency Support** — [CONFIRMED] Extensible global multi-currency catalog. NOT limited to fixed set (e.g., "USD + KES only"). Initial implementation may include common currencies, but catalog is configurable without code changes.
9. **Seating Capacity** — [CONFIRMED] Seating capacity is configurable per project. Do not hardcode a fixed seating capacity into business logic.
10. **Budget Exemption Approval** — [CONFIRMED] SUPER_ADMIN is the authority for exceptional budget approvals/exemptions.
11. **API Rate Limit** — [CONFIRMED] 100 requests/minute per client (configurable during implementation [IMPLEMENTATION DETAIL])
12. **Access Token Lifetime** — [CONFIRMED] 24-hour access-token lifetime (configurable during implementation)
13. **Refresh Token Lifetime** — [CONFIRMED] 30-day refresh-token lifetime (configurable during implementation)
14. **Pagination Default** — [CONFIRMED] 20 records per page (configurable maximum enforced during implementation)
15. **Administrative Export Formats** — [CONFIRMED] CSV and PDF as initial export formats

---

## 20. Summary

This domain model and business rules document:

- ✅ Defines lifecycle states for all key entities (donors, donations, pledges, projects, etc.)
- ✅ Specifies state transitions and who can trigger them
- ✅ Documents aggregate calculations (totals, counts)
- ✅ Lists constraints and validation rules
- ✅ Clarifies financial rules, audit logging, and compliance requirements
- ✅ Flags items requiring stakeholder confirmation

**Next Phase (Task 4):** Implement these business rules as database constraints, Prisma hooks/middleware, and backend API validation logic.
