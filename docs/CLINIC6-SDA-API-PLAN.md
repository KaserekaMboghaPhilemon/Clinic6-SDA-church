# Clinic 6 SDA API Plan

## Overview

This document defines the planned API contract for the Clinic 6 SDA platform backend. It specifies endpoints, request/response shapes, authentication requirements, and authorization rules for both public site and admin portal.

**Status:** Design phase (no routes or controllers implemented yet)

**Alignment:** Based on CLINIC6-SDA-PRISMA-SCHEMA-DESIGN.md and CLINIC6-SDA-DOMAINS.md

---

## 1. API Architectural Principles

### 1.1 RESTful Design

- Resources are identified by URL paths (e.g., `/api/donors/{id}`)
- HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`) indicate operations
- Status codes follow HTTP standards (200, 201, 400, 401, 403, 404, 422, 500)
- No RPC-style endpoints (avoid `/api/sendReceipt`, use `POST /api/receipts` instead)

### 1.2 Response Format

All API responses follow a consistent structure:

**Success Response (2xx):**

```json
{
  "status": "success",
  "data": {
    "id": "uuid-string",
    "fieldName": "value",
    ...
  }
}
```

**Error Response (4xx, 5xx):**

```json
{
  "status": "error",
  "data": null,
  "error": {
    "message": "Human-readable error message"
  }
}
```

**Validation Error Response (422):**

```json
{
  "status": "error",
  "data": null,
  "error": {
    "message": "Validation Error",
    "details": {
      "fieldName": ["Error message for field"]
    }
  }
}
```

### 1.3 Versioning

- API version is in URL: `/api/v1/...`
- Major breaking changes increment version (v1 → v2)
- Non-breaking changes (new fields, new endpoints) don't increment version

### 1.4 Base URL

**Development:** `http://localhost:5000/api/v1`

**Production:** `https://api.clinic6sda.org/api/v1`

---

## 2. Authentication & Authorization

### 2.1 Authentication Method

**JWT (JSON Web Token) in HTTP Authorization header:**

```
Authorization: Bearer <token>
```

- Token is issued on login (`POST /api/v1/auth/login`)
- Token contains user ID, role, and permissions
- Token expiry: 24 hours (configuration item)
- Refresh token: 30 days (for obtaining new access token)

### 2.2 Public Endpoints (No Auth Required)

- Health check
- Project listing
- Progress updates (published only)
- Media viewing (published only)
- Public reporting/statistics

### 2.3 Authenticated Endpoints

**Required:** Valid JWT token in Authorization header

- Donation creation/viewing
- Pledge management
- Donor profile viewing/updating
- Volunteer shift booking
- Receipt requests

### 2.4 Role-Based Authorization

**Roles:**

| Role            | Purpose              | Permissions                                                        |
| --------------- | -------------------- | ------------------------------------------------------------------ |
| **DONOR**       | Individual donor     | View own donations/pledges, create donations, update own profile   |
| **VOLUNTEER**   | Volunteer            | View/book volunteer shifts, update own profile                     |
| **ADMIN**       | Staff member         | Manage projects, donors, budgets, approvals, moderate content      |
| **SUPER_ADMIN** | System administrator | All ADMIN permissions + user/role management, system configuration |

**Authorization Rules:**

- Each endpoint specifies required role (e.g., "ADMIN+")
- "ADMIN+" means ADMIN or SUPER_ADMIN
- A DONOR cannot view other donors' private data
- An ADMIN cannot view system configuration (SUPER_ADMIN only)

---

## 3. Public API Endpoints (Public Site)

### 3.1 Health Check

**Endpoint:** `GET /api/v1/health`

**Authentication:** No

**Response (200):**

```json
{
  "status": "ok",
  "message": "Clinic 6 SDA API is running"
}
```

---

### 3.2 Currencies - List All

**Endpoint:** `GET /api/v1/currencies`

**Authentication:** No

**Query Parameters:**

| Parameter | Type    | Required | Description                                         |
| --------- | ------- | -------- | --------------------------------------------------- |
| `active`  | Boolean | No       | Filter by active status (true/false; default: true) |
| `search`  | String  | No       | Search by code/name/country/symbol/aliases          |
| `limit`   | Int     | No       | Items per page (default: 100, max: 200)             |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "currency-uuid",
        "code": "KES",
        "name": "Kenyan Shilling",
        "symbol": "KSh",
        "decimalPlaces": 2,
        "active": true,
        "searchAliases": ["Kenya", "shilling", "ksh"],
        "displayOrder": 1,
        "countries": [
          {
            "code": "KE",
            "name": "Kenya",
            "isPrimary": true
          }
        ]
      },
      {
        "id": "currency-uuid",
        "code": "USD",
        "name": "United States Dollar",
        "symbol": "$",
        "decimalPlaces": 2,
        "active": true,
        "searchAliases": ["USA", "american", "dollar", "us"],
        "displayOrder": 2,
        "countries": [
          {
            "code": "US",
            "name": "United States",
            "isPrimary": true
          }
        ]
      }
    ],
    "pagination": {
      "totalItems": 2,
      "limit": 20,
      "offset": 0
    }
  }
}
```

**Status:** [CONFIRMED] This endpoint uses a backend-managed extensible currency catalog. The system is NOT limited to a fixed set of currencies; new currencies can be added to the catalog without requiring code changes.

**Notes:**

- `totalItems` shows current count of active currencies in the system (example shows 2, but the catalog is extensible)
- The example is illustrative; the actual count will depend on which currencies have been configured in the backend database
- [CONFIRMED] KES is always the settlement/accounting currency
- [CONFIRMED] Administrators can add new currencies to the catalog via admin endpoint (future implementation)

---

### 3.3 Currencies - Search

**Endpoint:** `GET /api/v1/currencies/search`

**Authentication:** No

**Query Parameters:**

| Parameter | Type   | Required | Description                                       |
| --------- | ------ | -------- | ------------------------------------------------- |
| `q`       | String | Yes      | Search query (case-insensitive, partial matching) |
| `limit`   | Int    | No       | Max results (default: 10, max: 50)                |

**Search Matches:**

- Currency code (e.g., "KES", "USD")
- Currency name (e.g., "Kenyan Shilling")
- Country name (e.g., "Kenya")
- Currency symbol (e.g., "$")
- Country code (e.g., "KE")
- Aliases (e.g., "shilling")

**Ranking Priority:**

1. Exact code match
2. Code prefix match
3. Exact name match
4. Name partial match
5. Country exact match
6. Country partial match
7. Symbol match
8. Aliases

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "query": "ken",
    "items": [
      {
        "id": "currency-uuid",
        "code": "KES",
        "name": "Kenyan Shilling",
        "symbol": "KSh",
        "decimalPlaces": 2,
        "countries": [
          {
            "code": "KE",
            "name": "Kenya",
            "isPrimary": true
          }
        ],
        "matchReason": "code_prefix_match"
      },
      {
        "id": "currency-uuid",
        "code": "KWD",
        "name": "Kuwaiti Dinar",
        "symbol": "د.ك",
        "decimalPlaces": 3,
        "countries": [
          {
            "code": "KW",
            "name": "Kuwait",
            "isPrimary": true
          }
        ],
        "matchReason": "code_prefix_match"
      }
    ]
  }
}
```

---

### 3.4 Currencies - Get Exchange Rate

**Endpoint:** `GET /api/v1/exchange-rates`

**Authentication:** No

**Status:** [CONFIRMED] Design specification. The exchange-rate provider uses a provider-neutral architecture. The specific provider will be selected during implementation [IMPLEMENTATION DETAIL].

**Query Parameters:**

| Parameter | Type   | Required | Description                           |
| --------- | ------ | -------- | ------------------------------------- |
| `from`    | String | Yes      | Source currency code (e.g., "USD")    |
| `to`      | String | Yes      | Target currency code (default: "KES") |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "from": "USD",
    "to": "KES",
    "rate": 129.5,
    "timestamp": "2026-08-13T14:30:00Z",
    "provider": "[IMPLEMENTATION DETAIL - e.g., CBK, Wise, Oanda, etc. - to be selected during implementation]",
    "reliable": true,
    "convertedAmounts": [
      {
        "amount": 100,
        "converted": 12950,
        "currency": "KES"
      }
    ]
  }
}
```

**Notes:**

- [CONFIRMED] The exchange-rate architecture is provider-neutral. The specific provider will be selected during implementation [IMPLEMENTATION DETAIL]
- The `provider` field indicates the authoritative source for the rate
- Exchange rates should be cached with an appropriate TTL to avoid excessive API calls to the provider

---

### 3.5 Donor Currency Preference - Get

**Endpoint:** `GET /api/v1/donors/{id}/currency-preference`

**Authentication:** Required (JWT)

**Authorization:** User can view own preference; admin can view any

**Status:** [CONFIRMED] This represents the donor's application-level display preference only. It does not change donation transaction currency, settlement currency, or historical receipt values.

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "displayCurrency": "USD",
    "autoDetect": false,
    "lastUpdated": "2026-08-10T10:00:00Z"
  }
}
```

**Notes:**

- The active display currency is a global website preference and should apply across relevant public pages [CONFIRMED]
- Manual override takes precedence over automatic detection [CONFIRMED]
- Historical financial records remain immutable even if the display currency changes later [CONFIRMED]

---

### 3.6 Donor Currency Preference - Update

**Endpoint:** `PATCH /api/v1/donors/{id}/currency-preference`

**Authentication:** Required (JWT)

**Authorization:** User can update own preference; admin can update any

**Request Body:**

```json
{
  "displayCurrency": "EUR",
  "autoDetect": false
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "displayCurrency": "EUR",
    "autoDetect": false,
    "lastUpdated": "2026-08-13T15:00:00Z"
  }
}
```

---

### 3.7 Projects - List

**Endpoint:** `GET /api/v1/projects`

**Authentication:** No

**Query Parameters:**

| Parameter  | Type   | Required | Description                                           |
| ---------- | ------ | -------- | ----------------------------------------------------- |
| `status`   | String | No       | Filter by status (ACTIVE, COMPLETED, etc.)            |
| `currency` | String | No       | Display currency (default: donor's preference or KES) |
| `page`     | Int    | No       | Page number (default: 1)                              |
| `limit`    | Int    | No       | Items per page (default: 20, max: 100)                |
| `sort`     | String | No       | Sort field (raisedAmount, createdAt, name)            |
| `order`    | String | No       | Sort order (asc, desc; default: desc)                 |

**Response (200) - Updated with Currency Metadata:**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "project-uuid",
        "slug": "sanctuary-renovation",
        "name": "Sanctuary Renovation",
        "description": "...",
        "category": "sanctuary",
        "targetAmount": 50000.0,
        "targetCurrency": "KES",
        "raisedAmount": 35000.0,
        "raisedCurrency": "KES",
        "raisedAmountUSD": 270.0,
        "raisedAmountOriginal": 35500.0,
        "pledgedAmount": 10000.0,
        "pledgedCurrency": "KES",
        "status": "ACTIVE",
        "percentComplete": 90,
        "heroImageUrl": "https://...",
        "startDate": "2026-01-15T00:00:00Z",
        "targetEndDate": "2026-12-31T00:00:00Z",
        "displayCurrency": "KES",
        "exchangeRateInfo": {
          "rate": 1.0,
          "timestamp": "2026-08-13T14:30:00Z"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalItems": 8,
      "totalPages": 1
    }
  }
}
```

---

### 3.8 Projects - Get Single

**Authentication:** No

**Query Parameters:**

| Parameter | Type   | Required | Description                                |
| --------- | ------ | -------- | ------------------------------------------ |
| `status`  | String | No       | Filter by status (ACTIVE, COMPLETED, etc.) |
| `page`    | Int    | No       | Page number (default: 1)                   |
| `limit`   | Int    | No       | Items per page (default: 20, max: 100)     |
| `sort`    | String | No       | Sort field (raisedAmount, createdAt, name) |
| `order`   | String | No       | Sort order (asc, desc; default: desc)      |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "project-uuid",
        "slug": "sanctuary-renovation",
        "name": "Sanctuary Renovation",
        "description": "...",
        "category": "sanctuary",
        "targetAmount": 50000.0,
        "raisedAmount": 35000.0,
        "pledgedAmount": 10000.0,
        "status": "ACTIVE",
        "percentComplete": 90,
        "heroImageUrl": "https://...",
        "startDate": "2026-01-15T00:00:00Z",
        "targetEndDate": "2026-12-31T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalItems": 8,
      "totalPages": 1
    }
  }
}
```

---

### 3.3 Projects - Get Single

**Endpoint:** `GET /api/v1/projects/{id}`

**Authentication:** No

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "project-uuid",
    "slug": "sanctuary-renovation",
    "name": "Sanctuary Renovation",
    "description": "...",
    "category": "sanctuary",
    "targetAmount": 50000.0,
    "raisedAmount": 35000.0,
    "pledgedAmount": 10000.0,
    "status": "ACTIVE",
    "percentComplete": 90,
    "heroImageUrl": "https://...",
    "mediaUrls": ["https://...", "https://..."],
    "startDate": "2026-01-15T00:00:00Z",
    "targetEndDate": "2026-12-31T00:00:00Z",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 3.4 Projects - Progress Updates

**Endpoint:** `GET /api/v1/projects/{id}/progress`

**Authentication:** No

**Query Parameters:**

| Parameter | Type | Required | Description                  |
| --------- | ---- | -------- | ---------------------------- |
| `page`    | Int  | No       | Page number (default: 1)     |
| `limit`   | Int  | No       | Items per page (default: 10) |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "update-uuid",
        "title": "Foundation completed",
        "description": "The foundation for the sanctuary has been poured and is curing.",
        "mediaUrls": ["https://..."],
        "percentComplete": 30,
        "publishedAt": "2026-03-20T12:00:00Z",
        "createdAt": "2026-03-20T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 3.9 Donations - Create (Updated with Multi-Currency)

**Endpoint:** `POST /api/v1/donations`

**Authentication:** JWT (DONOR)

**Request Body:**

```json
{
  "projectId": "project-uuid",
  "amountOriginal": 100.0,
  "currencyOriginal": "USD",
  "paymentMethod": "M-Pesa",
  "anonymous": false,
  "publicRecognition": true,
  "message": "Great project! Keep up the good work."
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "donation-uuid",
    "donorId": "donor-uuid",
    "projectId": "project-uuid",
    "amountOriginal": 100.0,
    "currencyOriginal": "USD",
    "amountSettlement": 12950.0,
    "currencySettlement": "KES",
    "exchangeRateUsed": 129.5,
    "exchangeRateTimestamp": "2026-08-13T14:30:00Z",
    "paymentMethod": "M-Pesa",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "notificationStatus": "PENDING",
    "transactionReference": "MPESA-2026-ABC123",
    "anonymous": false,
    "publicRecognition": true,
    "message": "Great project! Keep up the good work.",
    "paymentVerifiedAt": null,
    "createdAt": "2026-08-13T14:30:00Z"
  }
}
```

**Validation Rules:**

- `projectId` must exist and be ACTIVE
- `amountOriginal > 0`
- `currencyOriginal` in list of supported currencies
- Exchange rate is fetched from reliable source at time of donation
- `anonymous` and `publicRecognition` logic applies as before

**Status Tracking:**

- [CONFIRMED] Donation initially created with `status: PENDING` and `paymentStatus: PENDING`
- [CONFIRMED] Payment verification happens ONLY via webhook from payment provider, NOT from frontend confirmation
- [CONFIRMED] Donation creation endpoint follows the confirmed payment verification workflow. The specific payment provider will be selected during implementation [IMPLEMENTATION DETAIL]
- [CONFIRMED] Frontend success redirect does NOT update donation status—the payment provider webhook is authoritative
- [CONFIRMED] The payment architecture is provider-neutral with webhook signature verification required

**Status Fields Explained:**

- `status`: Core donation lifecycle status (PENDING → PROCESSING → VERIFIED → final)
- `paymentStatus`: Alias for payment-related portion of `status` (PENDING, PROCESSING, VERIFIED, FAILED) used for clarity in API responses
- `notificationStatus`: Status of thank-you notification delivery (PENDING, SENT, FAILED, DELIVERED, READ) - independent from donation status
- Note: `notificationStatus` failure does NOT affect donation status or payment verification

---

### 3.10 Donations - Get My Donations (Updated with Multi-Currency)

**Endpoint:** `GET /api/v1/donations/me`

**Authentication:** JWT (DONOR)

**Query Parameters:**

| Parameter   | Type   | Required | Description                                    |
| ----------- | ------ | -------- | ---------------------------------------------- |
| `page`      | Int    | No       | Page number                                    |
| `limit`     | Int    | No       | Items per page                                 |
| `status`    | String | No       | Filter by payment status                       |
| `projectId` | String | No       | Filter by project                              |
| `currency`  | String | No       | Display currency (default: donor's preference) |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "donation-uuid",
        "projectId": "project-uuid",
        "projectName": "Sanctuary Renovation",
        "amountOriginal": 100.00,
        "currencyOriginal": "USD",
        "amountSettlement": 12950.00,
        "currencySettlement": "KES",
        "exchangeRate": 129.50,
        "amountDisplay": 100.00,
        "currencyDisplay": "USD",
        "paymentStatus": "VERIFIED",
        "notificationStatus": "DELIVERED",
        "paymentVerifiedAt": "2026-08-13T14:35:00Z",
        "createdAt": "2026-08-13T14:30:00Z",
        "receipt": {
          "id": "receipt-uuid",
          "receiptNumber": "RCP-2026-001234",
          "downloadUrl": "https://api.clinic6sda.org/api/v1/receipts/receipt-uuid/download"
        }
      }
    ],
    "pagination": { ... },
    "summary": {
      "totalDonatedKES": 38850.0,
      "totalDonatedOriginal": 300.0,
      "donationCount": 3,
      "averageDonationKES": 12950.0
    }
  }
}
```

---

### 3.11 Donations - Get Payment Status

**Endpoint:** `GET /api/v1/donations/{id}/payment-status`

**Authentication:** Required (JWT); user can view own, admin can view any

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "donationId": "donation-uuid",
    "paymentStatus": "VERIFIED",
    "notificationStatus": "DELIVERED",
    "receipt": {
      "id": "receipt-uuid",
      "receiptNumber": "RCP-2026-001234",
      "downloadUrl": "https://api.clinic6sda.org/api/v1/receipts/receipt-uuid/download"
    },
    "updatedAt": "2026-08-13T14:35:00Z"
  }
}
```

---

### 3.12 Receipts - Get My Receipts (Updated)

**Endpoint:** `GET /api/v1/receipts/me`

**Authentication:** JWT (DONOR)

**Query Parameters:**

| Parameter    | Type   | Required | Description        |
| ------------ | ------ | -------- | ------------------ |
| `page`       | Int    | No       | Page number        |
| `limit`      | Int    | No       | Items per page     |
| `donationId` | String | No       | Filter by donation |
| `currency`   | String | No       | Display currency   |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "receipt-uuid",
        "receiptNumber": "RCP-2026-001234",
        "receiptDate": "2026-08-13T14:35:00Z",
        "amountOriginal": 100.00,
        "currencyOriginal": "USD",
        "amountSettlement": 12950.00,
        "currencySettlement": "KES",
        "exchangeRate": 129.50,
        "exchangeRateTimestamp": "2026-08-13T14:30:00Z",
        "donationId": "donation-uuid",
        "projectName": "Sanctuary Renovation",
        "downloadUrl": "https://api.clinic6sda.org/api/v1/receipts/receipt-uuid/download",
        "sentAt": "2026-08-13T14:40:00Z",
        "status": "DELIVERED"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 3.13 Receipts - Download Receipt

**Endpoint:** `GET /api/v1/receipts/{id}/download`

**Authentication:** Required (JWT); user can download own, admin can download any

**Accept Header:** `application/pdf`

**Response (200):**

File stream (PDF receipt document)

---

### 3.14 Payment Webhook - Verify (Admin)

**Endpoint:** `POST /api/v1/payments/webhooks/verify`

**Authentication:** API Key (payment provider verification, not JWT)

**Status:** [CONFIRMED] This is the authoritative payment verification endpoint. Webhook signature verification and idempotent processing are required. The specific provider implementation will be selected during implementation [IMPLEMENTATION DETAIL].

**Purpose:** [CONFIRMED] Receive and process payment confirmation events from the payment provider. This is the ONLY authoritative source for payment status updates.

**Request Body:**

```json
{
  "eventId": "PROVIDER-EVENT-ID-12345",
  "eventType": "payment.success",
  "eventTimestamp": "2026-08-13T14:33:00Z",
  "transactionId": "MPESA-2026-ABC123",
  "status": "SUCCESS",
  "amount": 100.0,
  "currency": "USD",
  "payload": { "full": "webhook payload from provider" }
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "eventId": "PROVIDER-EVENT-ID-12345",
    "processed": true,
    "donationId": "donation-uuid",
    "paymentStatus": "VERIFIED",
    "settlementAmount": 12950.0,
    "settlementCurrency": "KES"
  }
}
```

**Error Response (422):**

```json
{
  "status": "error",
  "data": null,
  "error": {
    "message": "Webhook verification failed",
    "details": {
      "reason": "Invalid signature",
      "eventId": "PROVIDER-EVENT-ID-12345"
    }
  }
}
```

**Critical Notes:**

- [CONFIRMED] Webhook signature must be cryptographically verified before processing
- [CONFIRMED] Frontend redirect/success screen does NOT trigger payment verification — this webhook is the sole authoritative source
- [CONFIRMED] Donation receipt is generated ONLY after webhook confirms payment
- [CONFIRMED] Donor notification is triggered ONLY after webhook confirms payment
- [CONFIRMED] API key authentication method is provider-neutral and will be implemented according to selected provider's requirements [IMPLEMENTATION DETAIL]

````

---

### 3.15 Money Display Contract (Conceptual)

**Status:** [CONFIRMED] Display-currency conversion API contract. Monetary responses must distinguish original financial values, settlement values, and display-converted values.

**Safe conceptual structure:**

```json
{
  "amountOriginal": 100,
  "currencyOriginal": "USD",
  "amountSettlement": 12950,
  "currencySettlement": "KES",
  "exchangeRate": "1 USD = 129.50 KES",
  "exchangeRateTimestamp": "2026-08-13T14:30:00Z",
  "display": {
    "amount": "92.50",
    "currency": "EUR"
  }
}
```

**Critical rules:**

- `amountOriginal` and `currencyOriginal` are the historical donation values [CONFIRMED]
- `amountSettlement` and `currencySettlement` reflect the accounting/settlement record [CONFIRMED]
- `display.amount` and `display.currency` are presentation-only values and must not overwrite accounting records [CONFIRMED]
- The exact shape of the display-conversion payload will be finalized during implementation to match frontend/backend contract requirements [IMPLEMENTATION DETAIL]

---

### 3.16 Refunds - Create (Admin)

**Endpoint:** `POST /api/v1/donations/{id}/refunds`

**Authentication:** JWT (ADMIN+)

**Request Body:**

```json
{
  "refundType": "FULL_REFUND",
  "reason": "Donor requested refund",
  "amountRefunded": 100.0
}
````

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "refund-uuid",
    "donationId": "donation-uuid",
    "refundType": "FULL_REFUND",
    "amountRefunded": 100.0,
    "originalDonation": {
      "amountOriginal": 100.0,
      "currencyOriginal": "USD",
      "amountSettlement": 12950.0,
      "currencySettlement": "KES"
    },
    "reason": "Donor requested refund",
    "status": "PENDING",
    "createdAt": "2026-08-13T15:00:00Z"
  }
}
```

---

### 3.16 Pledges - Create

**Endpoint:** `POST /api/v1/pledges`

**Authentication:** JWT (DONOR)

**Request Body:**

```json
{
  "projectId": "project-uuid",
  "totalAmount": 1200.0,
  "installmentAmount": 100.0,
  "installmentFrequency": "MONTHLY",
  "numberOfInstallments": 12,
  "startDate": "2026-04-01T00:00:00Z"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "pledge-uuid",
    "donorId": "donor-uuid",
    "projectId": "project-uuid",
    "totalAmount": 1200.0,
    "installmentAmount": 100.0,
    "installmentFrequency": "MONTHLY",
    "numberOfInstallments": 12,
    "amountPaid": 0.0,
    "remainingAmount": 1200.0,
    "status": "ACTIVE",
    "startDate": "2026-04-01T00:00:00Z",
    "expectedEndDate": "2027-03-01T00:00:00Z",
    "nextPaymentDueDate": "2026-05-01T00:00:00Z",
    "createdAt": "2026-03-20T14:30:00Z"
  }
}
```

---

### 3.8 Pledges - Get My Pledges

**Endpoint:** `GET /api/v1/pledges/me`

**Authentication:** JWT (DONOR)

**Query Parameters:** Similar to donations list

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "pledge-uuid",
        "projectId": "project-uuid",
        "projectName": "Sanctuary Renovation",
        "totalAmount": 1200.00,
        "amountPaid": 200.00,
        "remainingAmount": 1000.00,
        "status": "ACTIVE",
        "installmentFrequency": "MONTHLY",
        "nextPaymentDueDate": "2026-05-01T00:00:00Z",
        "daysUntilDue": 10
      }
    ],
    "pagination": { ... },
    "summary": {
      "totalPledged": 2400.00,
      "pledgeCount": 2,
      "amountPaidOnPledges": 400.00
    }
  }
}
```

---

### 3.9 Receipts - Get My Receipts

**Endpoint:** `GET /api/v1/receipts/me`

**Authentication:** JWT (DONOR)

**Query Parameters:**

| Parameter | Type     | Required | Description                 |
| --------- | -------- | -------- | --------------------------- |
| `page`    | Int      | No       | Page number                 |
| `limit`   | Int      | No       | Items per page              |
| `from`    | DateTime | No       | Filter by date range (from) |
| `to`      | DateTime | No       | Filter by date range (to)   |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "receipt-uuid",
        "receiptNumber": "RCP-2026-001234",
        "amount": 100.00,
        "currency": "USD",
        "receiptDate": "2026-03-20T00:00:00Z",
        "sentAt": "2026-03-20T14:35:00Z",
        "format": "EMAIL",
        "locale": "en"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 3.10 Receipts - Download Receipt

**Endpoint:** `GET /api/v1/receipts/{id}/download`

**Authentication:** JWT (DONOR who owns receipt, or ADMIN+)

**Response:** `application/pdf` (binary file)

---

### 3.11 Donor Profile - Get My Profile

**Endpoint:** `GET /api/v1/donors/me`

**Authentication:** JWT (DONOR)

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "donor-uuid",
    "userId": "user-uuid",
    "giverName": "John Doe",
    "country": "US",
    "totalDonated": 450.0,
    "totalPledged": 1200.0,
    "donationCount": 3,
    "pledgeCount": 1,
    "preferredCurrency": "USD",
    "receiptEmailPreference": "john@example.com",
    "optInMarketing": true,
    "optInUpdates": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2026-03-20T14:30:00Z"
  }
}
```

---

### 3.12 Donor Profile - Update My Profile

**Endpoint:** `PATCH /api/v1/donors/me`

**Authentication:** JWT (DONOR)

**Request Body:**

```json
{
  "giverName": "Jane Doe",
  "receiptEmailPreference": "jane@example.com",
  "optInMarketing": false,
  "optInUpdates": true,
  "preferredCurrency": "KES"
}
```

**Response (200):** Updated donor object

---

### 3.13 Volunteer Shifts - List Available

**Endpoint:** `GET /api/v1/volunteer-shifts`

**Authentication:** No (public list) or JWT (for bookings)

**Query Parameters:**

| Parameter   | Type     | Required | Description                 |
| ----------- | -------- | -------- | --------------------------- |
| `projectId` | String   | No       | Filter by project           |
| `fromDate`  | DateTime | No       | Filter by date range (from) |
| `toDate`    | DateTime | No       | Filter by date range (to)   |
| `status`    | String   | No       | Filter by status            |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "shift-uuid",
        "projectId": "project-uuid",
        "title": "Concrete pouring - Foundation",
        "description": "...",
        "scheduledDate": "2026-04-15T08:00:00Z",
        "startTime": "2026-04-15T08:00:00Z",
        "endTime": "2026-04-15T16:00:00Z",
        "status": "SCHEDULED",
        "volunteersNeeded": 5,
        "volunteersConfirmed": 3
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 3.14 Volunteer Shifts - Book Shift

**Endpoint:** `POST /api/v1/volunteer-shifts/{id}/book`

**Authentication:** JWT (VOLUNTEER)

**Request Body:**

```json
{
  "notes": "I'll be there!"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "shiftId": "shift-uuid",
    "volunteerId": "volunteer-uuid",
    "volunteerName": "Jane Doe",
    "status": "SCHEDULED",
    "bookedAt": "2026-03-20T14:30:00Z"
  }
}
```

---

### 3.15 Media - List Published

**Endpoint:** `GET /api/v1/media`

**Authentication:** No

**Query Parameters:**

| Parameter  | Type   | Required | Description        |
| ---------- | ------ | -------- | ------------------ |
| `category` | String | No       | Filter by category |
| `page`     | Int    | No       | Page number        |
| `limit`    | Int    | No       | Items per page     |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "media-uuid",
        "fileName": "progress-photo-001.jpg",
        "fileType": "image/jpeg",
        "storageUrl": "https://storage.example.com/media/...",
        "thumbnailUrl": "https://storage.example.com/media/...-thumb.jpg",
        "caption": "Foundation pouring in progress",
        "altText": "Workers pouring concrete foundation",
        "category": "project-update",
        "publishedAt": "2026-03-20T12:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## 4. Admin & Authenticated Endpoints

### 4.1 Authentication - Login

**Endpoint:** `POST /api/v1/auth/login`

**Authentication:** No (public endpoint)

**Request Body:**

```json
{
  "email": "admin@clinic6sda.org",
  "password": "securepassword"
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "id": "user-uuid",
      "email": "admin@clinic6sda.org",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    }
  }
}
```

**Error Response (401):**

```json
{
  "status": "error",
  "data": null,
  "error": {
    "message": "Invalid email or password"
  }
}
```

---

### 4.2 Authentication - Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Authentication:** No (uses refresh token in body)

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

---

### 4.3 Users - Create

**Endpoint:** `POST /api/v1/users`

**Authentication:** JWT (SUPER_ADMIN)

**Request Body:**

```json
{
  "email": "newuser@clinic6sda.org",
  "firstName": "New",
  "lastName": "User",
  "password": "temporaryPassword123",
  "role": "ADMIN"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "user-uuid",
    "email": "newuser@clinic6sda.org",
    "firstName": "New",
    "lastName": "User",
    "role": "ADMIN",
    "status": "ACTIVE",
    "createdAt": "2026-03-20T14:30:00Z"
  }
}
```

---

### 4.4 Donations - Verify Payment (Admin)

**Endpoint:** `PATCH /api/v1/donations/{id}/verify`

**Authentication:** JWT (ADMIN+)

**Request Body:**

```json
{
  "status": "VERIFIED",
  "transactionReference": "MPESA-2026-ABC123"
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "donation-uuid",
    "status": "VERIFIED",
    "paymentVerifiedAt": "2026-03-20T14:35:00Z"
  }
}
```

---

### 4.5 Pledges - Update Status (Admin)

**Endpoint:** `PATCH /api/v1/pledges/{id}/status`

**Authentication:** JWT (ADMIN+)

**Request Body:**

```json
{
  "status": "COMPLETED",
  "notes": "All payments received and processed"
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "pledge-uuid",
    "status": "COMPLETED",
    "actualEndDate": "2026-03-20T14:30:00Z"
  }
}
```

---

### 4.6 Projects - Create/Update (Admin)

**Endpoint:** `POST /api/v1/projects` (create) or `PATCH /api/v1/projects/{id}` (update)

**Authentication:** JWT (ADMIN+)

**Request Body (Create):**

```json
{
  "slug": "new-project",
  "name": "New Project",
  "description": "Project description",
  "category": "sanctuary",
  "targetAmount": 50000.0,
  "status": "PLANNING",
  "startDate": "2026-04-01T00:00:00Z",
  "targetEndDate": "2026-12-31T00:00:00Z"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "project-uuid",
    "slug": "new-project",
    "name": "New Project",
    ...
    "createdAt": "2026-03-20T14:30:00Z"
  }
}
```

---

### 4.7 Projects - Publish Progress Update (Admin)

**Endpoint:** `POST /api/v1/projects/{id}/progress`

**Authentication:** JWT (ADMIN+)

**Request Body:**

```json
{
  "title": "Foundation completed",
  "description": "The foundation has been successfully poured.",
  "mediaUrls": ["https://storage.example.com/..."],
  "percentComplete": 30
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "update-uuid",
    "projectId": "project-uuid",
    "title": "Foundation completed",
    "description": "...",
    "publishedAt": "2026-03-20T14:30:00Z",
    "createdAt": "2026-03-20T14:30:00Z"
  }
}
```

---

### 4.8 Budgets - Create/Update (Admin)

**Endpoint:** `POST /api/v1/budgets` or `PATCH /api/v1/budgets/{id}`

**Authentication:** JWT (ADMIN+)

**Request Body (Create):**

```json
{
  "projectId": "project-uuid",
  "year": 2026,
  "category": "Labor",
  "allocatedAmount": 25000.0
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "budget-uuid",
    "projectId": "project-uuid",
    "year": 2026,
    "category": "Labor",
    "allocatedAmount": 25000.0,
    "spentAmount": 0.0,
    "remainingAmount": 25000.0,
    "status": "PLANNED",
    "createdAt": "2026-03-20T14:30:00Z"
  }
}
```

---

### 4.9 Budgets - Approve (Admin)

**Endpoint:** `PATCH /api/v1/budgets/{id}/approve`

**Authentication:** JWT (ADMIN+)

**Request Body:**

```json
{}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "budget-uuid",
    "status": "ACTIVE",
    "approvedBy": "admin-uuid",
    "approvedAt": "2026-03-20T14:35:00Z"
  }
}
```

---

### 4.10 Expenses - Submit (Admin)

**Endpoint:** `POST /api/v1/expenses`

**Authentication:** JWT (ADMIN+)

**Request Body:**

```json
{
  "budgetId": "budget-uuid",
  "description": "Lumber for foundation framing",
  "amount": 1500.0,
  "vendor": "Local Hardware Store",
  "category": "Materials"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "expense-uuid",
    "budgetId": "budget-uuid",
    "description": "...",
    "amount": 1500.0,
    "status": "PENDING",
    "submittedBy": "admin-uuid",
    "submittedAt": "2026-03-20T14:30:00Z"
  }
}
```

---

### 4.11 Expenses - Approve (Admin)

**Endpoint:** `PATCH /api/v1/expenses/{id}/approve`

**Authentication:** JWT (ADMIN+)

**Request Body:**

```json
{}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "expense-uuid",
    "status": "APPROVED",
    "approvedBy": "admin-uuid",
    "approvedAt": "2026-03-20T14:35:00Z"
  }
}
```

---

### 4.12 Expenses - Reject (Admin)

**Endpoint:** `PATCH /api/v1/expenses/{id}/reject`

**Authentication:** JWT (ADMIN+)

**Request Body:**

```json
{
  "reason": "Receipt not provided"
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "expense-uuid",
    "status": "REJECTED",
    "rejectionReason": "Receipt not provided"
  }
}
```

---

### 4.13 Volunteers - List (Admin)

**Endpoint:** `GET /api/v1/volunteers`

**Authentication:** JWT (ADMIN+)

**Query Parameters:**

| Parameter | Type   | Required | Description      |
| --------- | ------ | -------- | ---------------- |
| `status`  | String | No       | Filter by status |
| `page`    | Int    | No       | Page number      |
| `limit`   | Int    | No       | Items per page   |

**Response (200):** List of volunteer profiles with contact info, skills, hours, etc.

---

### 4.14 Volunteers - Create (Admin)

**Endpoint:** `POST /api/v1/volunteers`

**Authentication:** JWT (ADMIN+)

**Request Body:**

```json
{
  "userId": "user-uuid",
  "skills": ["carpentry", "plumbing"],
  "availabilityNotes": "Weekends only"
}
```

**Response (201):** Created volunteer profile

---

### 4.15 Seating - List Seats (Admin)

**Endpoint:** `GET /api/v1/seating`

**Authentication:** JWT (ADMIN+)

**Query Parameters:**

| Parameter   | Type   | Required | Description           |
| ----------- | ------ | -------- | --------------------- |
| `projectId` | String | Yes      | Project ID            |
| `status`    | String | No       | Filter by seat status |

**Response (200):** List of seating sponsorships with status, sponsor, etc.

---

### 4.16 Media - Upload (Admin)

**Endpoint:** `POST /api/v1/media`

**Authentication:** JWT (ADMIN+)

**Request:** Multipart form data with file

```
Content-Type: multipart/form-data
{
  "file": <binary>,
  "projectId": "project-uuid",
  "caption": "Progress photo from site visit",
  "category": "project-update"
}
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": "media-uuid",
    "fileName": "progress-001.jpg",
    "storageUrl": "https://...",
    "status": "PROCESSING",
    "createdAt": "2026-03-20T14:30:00Z"
  }
}
```

---

### 4.17 Media - Publish (Admin)

**Endpoint:** `PATCH /api/v1/media/{id}/publish`

**Authentication:** JWT (ADMIN+)

**Request Body:**

```json
{}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "media-uuid",
    "status": "PUBLISHED",
    "publishedAt": "2026-03-20T14:35:00Z"
  }
}
```

---

## 5. Query Patterns

### 5.1 Pagination

All list endpoints support pagination:

```
GET /api/v1/projects?page=2&limit=20
```

Response includes:

```json
{
  "items": [...],
  "pagination": {
    "currentPage": 2,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

**Defaults:**

- `page`: 1
- `limit`: 20
- Max limit: 100

---

### 5.2 Filtering

List endpoints support filter query parameters:

```
GET /api/v1/donations?status=VERIFIED&projectId=project-uuid
```

Filters are combined with AND logic.

---

### 5.3 Sorting

List endpoints support sort query parameters:

```
GET /api/v1/projects?sort=raisedAmount&order=desc
```

Allowed sort fields are documented per endpoint. Default sort: `createdAt` descending.

---

### 5.4 Searching

**Text Search Endpoints:**

```
GET /api/v1/projects/search?q=sanctuary
```

Searches across name, description, category. Returns paginated results.

---

## 6. Error Handling

### 6.1 Error Status Codes

| Code | Meaning               | Example                     |
| ---- | --------------------- | --------------------------- |
| 400  | Bad Request           | Missing required field      |
| 401  | Unauthorized          | No token or invalid token   |
| 403  | Forbidden             | User lacks permission       |
| 404  | Not Found             | Resource doesn't exist      |
| 422  | Unprocessable Entity  | Validation error            |
| 500  | Internal Server Error | Unexpected error (see logs) |

### 6.2 Error Response Format

All errors follow the format:

```json
{
  "status": "error",
  "data": null,
  "error": {
    "message": "Human-readable message"
  }
}
```

**Validation Errors (422):**

```json
{
  "status": "error",
  "data": null,
  "error": {
    "message": "Validation Error",
    "details": {
      "amount": ["Amount must be greater than 0"],
      "projectId": ["Project must be ACTIVE"]
    }
  }
}
```

---

## 7. Security Considerations

### 7.1 HTTPS

- All endpoints require HTTPS in production
- HTTP is allowed in development only (localhost)

### 7.2 CORS

- Frontend origin (`http://localhost:5173` in dev, production URL in prod) is allowed
- Other origins are rejected

### 7.3 Rate Limiting

**To be determined in Task 4:**

- API rate limits (e.g., 100 requests/minute per user)
- Login attempt limits (e.g., 5 attempts per 15 minutes)
- File upload limits (e.g., 50MB per file)

### 7.4 Input Validation

All inputs are validated server-side:

- Email format
- Numeric ranges (amount > 0, percentages 0-100)
- Enum values (status IN list of allowed values)
- String lengths and character sets
- Date formats and logical ordering

### 7.5 Data Access Control

- Users can only view their own donations, pledges, receipts
- Donors cannot view other donors' data
- Admins can view all data
- Admin actions are logged for audit trail

### 7.6 Secrets Protection

- JWT secrets stored in environment variables only
- Database credentials never logged or exposed
- Payment provider credentials never sent to frontend
- Error messages don't expose internal details

---

## 8. Financial Integrity & Multi-Currency API Guidelines

### 8.1 Immutable Historical Values

**Critical Rule:** Once a donation is VERIFIED, certain fields must never change:

**Immutable Fields:**

- `amountOriginal` — Original transaction amount
- `currencyOriginal` — Original transaction currency
- `amountSettlement` — Settlement amount (KES)
- `currencySettlement` — Settlement currency (always KES)
- `exchangeRateUsed` — Exchange rate at time of transaction
- `exchangeRateTimestamp` — When the rate was captured

**API Implication:** Never update these fields after VERIFIED status. If correction needed, create audit record and contact admin.

### 8.2 Multi-Currency Response Metadata

**All monetary responses must include:**

```json
{
  "amountOriginal": 100.0,
  "currencyOriginal": "USD",
  "amountSettlement": 12950.0,
  "currencySettlement": "KES",
  "exchangeRate": 129.5,
  "exchangeRateTimestamp": "2026-08-13T14:30:00Z",
  "amountDisplay": 100.0,
  "currencyDisplay": "USD"
}
```

**Never:** Return only a single amount without currency context.

### 8.3 Payment Status Independence

**Important Distinction:**

- `paymentStatus` — Whether payment was confirmed (PENDING, PROCESSING, VERIFIED, FAILED, REFUNDED, REVERSED)
- `notificationStatus` — Whether thank-you was sent (PENDING, SENT, FAILED, DELIVERED, READ)

These are independent. Errors in notification do NOT affect payment status.

**API Implication:** Include both statuses in every donation response.

### 8.4 Receipt Data Immutability

**Never modify receipt values after generation:**

- Receipt amounts are historical snapshots
- Exchange rates in receipt are what was used at that time
- Downloading a receipt twice must return identical content
- Regenerating a receipt for same donation uses same receipt number

### 8.5 Settlement Currency (KES)

**All API responses with financial aggregates must show both:**

1. **KES amounts** — For Clinic 6 accounting/settlement
2. **Original amounts** — For historical audit trail

**Example Donor Summary:**

```json
{
  "totalDonatedKES": 38850.0,
  "totalDonatedOriginal": 300.0,
  "donationCount": 3,
  "avgDonationKES": 12950.0,
  "avgDonationOriginal": 100.0
}
```

---

## 9. Future API Considerations

**To be determined in later phases:**

1. **WebSocket Support** — Real-time updates for progress, donations, notifications
2. **Batch Operations** — Bulk updates for admin operations
3. **Export Endpoints** — CSV/Excel exports for reporting
4. **Webhooks** — Outbound webhooks to external systems (payment provider, email)
5. **GraphQL Alternative** — Possible GraphQL API alongside REST
6. **Public API Keys** — Third-party integrations
7. **Caching Headers** — ETags, Cache-Control for performance
8. **API Documentation** — OpenAPI/Swagger spec generation

---

## 10. Confirmed API Design Decisions

The following API design aspects are now [CONFIRMED]:

1. **Rate Limit Values** — [CONFIRMED] 100 requests/minute per client (configurable during implementation)
2. **Access Token Expiry** — [CONFIRMED] 24-hour access-token lifetime (configurable during implementation)
3. **Refresh Token Expiry** — [CONFIRMED] 30-day refresh-token lifetime (configurable during implementation)
4. **Maximum File Size** — [CONFIRMED] 50 MB maximum per file (configurable during implementation)
5. **Pagination Default Page Size** — [CONFIRMED] 20 records per page default (configurable maximum enforced)
6. **Currency Support Architecture** — [CONFIRMED] Extensible global multi-currency catalog (NOT limited to "USD, KES only")
7. **Notification Delivery** — [CONFIRMED] Email/SMS for notifications. Real-time WebSocket support is [IMPLEMENTATION DETAIL] for future phases.
8. **Payment Provider Architecture** — [CONFIRMED] Provider-neutral design. Specific provider selected during implementation.
9. **Exchange-Rate Provider Architecture** — [CONFIRMED] Provider-neutral design. Specific provider selected during implementation.
10. **Notification Provider Architecture** — [CONFIRMED] Provider-neutral design supporting multiple channels (email, SMS, in-app). Specific providers selected during implementation.
11. **Export Formats** — [CONFIRMED] CSV and PDF for administrative exports (future implementation detail)
12. **Authentication Mechanism** — [CONFIRMED] JWT-based with provider-neutral API key authentication for external integrations
13. **Reporting Endpoints** — Which reports needed and how frequently? (TBD)
14. **Admin Dashboard Endpoints** — What analytics/KPIs needed? (TBD)
15. **Export Formats** — CSV only or other formats? (Proposed: CSV, PDF)

---

## 11. Summary

This API plan provides:

- ✅ Comprehensive endpoint catalog for public site features
- ✅ Authenticated endpoints for donors and admins
- ✅ Consistent request/response format
- ✅ Role-based authorization rules
- ✅ Pagination, filtering, and sorting patterns
- ✅ Error handling and status codes
- ✅ Security considerations and best practices
- ✅ Clear field names and data types
- ✅ Examples for all major endpoints

**Next Phase (Task 4):** Implement backend controllers, services, and routes based on this API contract.
