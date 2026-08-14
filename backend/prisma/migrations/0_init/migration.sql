-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DONOR', 'VOLUNTEER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'PROCESSING', 'VERIFIED', 'FAILED', 'CANCELLED', 'REFUNDED', 'REVERSED');

-- CreateEnum
CREATE TYPE "PledgeStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'DEFAULTED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ConstructionPhaseStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DELAYED', 'ON_HOLD', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'REJECTED');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'INACTIVE_REQUEST');

-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RefundType" AS ENUM ('FULL_REFUND', 'PARTIAL_REFUND', 'REVERSAL');

-- CreateEnum
CREATE TYPE "RefundReversalStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "MaterialStatus" AS ENUM ('REQUESTED', 'APPROVED', 'RECEIVED', 'USED', 'RETURNED');

-- CreateEnum
CREATE TYPE "SeatingStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SPONSORED', 'COMPLETED');

-- CreateTable "User"
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "phoneNumber" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'DONOR',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Donor"
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "giverName" TEXT,
    "country" TEXT,
    "totalDonatedKES" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalDonatedOriginal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalPledgedKES" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalPledgedOriginal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "donationCount" INTEGER NOT NULL DEFAULT 0,
    "pledgeCount" INTEGER NOT NULL DEFAULT 0,
    "preferredDisplayCurrency" TEXT,
    "displayCurrencyAutoDetect" BOOLEAN NOT NULL DEFAULT true,
    "receiptEmailPreference" TEXT,
    "optInMarketing" BOOLEAN NOT NULL DEFAULT false,
    "optInUpdates" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Currency"
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimalPlaces" INTEGER NOT NULL DEFAULT 2,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "settlementMap" TEXT,
    "searchAliases" JSONB,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable "CurrencyCountry"
CREATE TABLE "CurrencyCountry" (
    "id" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "countryCode" VARCHAR(2) NOT NULL,
    "countryName" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurrencyCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable "ExchangeRate"
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "sourceCode" VARCHAR(3) NOT NULL,
    "targetCode" VARCHAR(3) NOT NULL,
    "rate" DECIMAL(15,6) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "reliable" BOOLEAN NOT NULL DEFAULT true,
    "usedInTransaction" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable "DonorCurrencyPreference"
CREATE TABLE "DonorCurrencyPreference" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "currencyCode" VARCHAR(3) NOT NULL,
    "isManualSelection" BOOLEAN NOT NULL DEFAULT false,
    "detectionMethod" TEXT,
    "selectionReason" TEXT,
    "activeSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonorCurrencyPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Donation"
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "amountOriginal" DECIMAL(12,2) NOT NULL,
    "currencyOriginal" VARCHAR(3) NOT NULL,
    "amountSettlement" DECIMAL(12,2) NOT NULL,
    "currencySettlement" VARCHAR(3) NOT NULL DEFAULT 'KES',
    "exchangeRateUsed" DECIMAL(15,6) NOT NULL,
    "exchangeRateId" TEXT,
    "exchangeRateTimestamp" TIMESTAMP(3) NOT NULL,
    "paymentMethod" TEXT,
    "transactionReference" TEXT NOT NULL,
    "paymentEventId" TEXT,
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "paymentVerifiedAt" TIMESTAMP(3),
    "paymentFailedReason" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "publicRecognition" BOOLEAN NOT NULL DEFAULT true,
    "message" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable "PaymentTransaction"
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "providerCode" TEXT NOT NULL,
    "providerTransactionId" TEXT NOT NULL,
    "providerStatus" TEXT NOT NULL,
    "initiatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "phoneNumber" TEXT,
    "providerResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable "PaymentEvent"
CREATE TABLE "PaymentEvent" (
    "id" TEXT NOT NULL,
    "paymentTransactionId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventTimestamp" TIMESTAMP(3) NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "processingStatus" TEXT,
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Settlement"
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "amountKES" DECIMAL(12,2) NOT NULL,
    "exchangeRateUsed" DECIMAL(15,6) NOT NULL,
    "settlementDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable "RefundReversal"
CREATE TABLE "RefundReversal" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "refundType" "RefundType" NOT NULL,
    "amountRefunded" DECIMAL(12,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "initiatedBy" TEXT,
    "providerRefundId" TEXT,
    "status" "RefundReversalStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefundReversal_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Receipt"
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "amountOriginal" DECIMAL(12,2) NOT NULL,
    "currencyOriginal" VARCHAR(3) NOT NULL,
    "amountSettlement" DECIMAL(12,2) NOT NULL,
    "currencySettlement" VARCHAR(3) NOT NULL,
    "exchangeRate" DECIMAL(15,6) NOT NULL,
    "exchangeRateTimestamp" TIMESTAMP(3) NOT NULL,
    "paymentReference" TEXT NOT NULL,
    "verificationTimestamp" TIMESTAMP(3) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Notification"
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "donorId" TEXT,
    "notificationType" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "recipientAddress" TEXT,
    "subject" TEXT,
    "body" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Project"
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "targetAmount" DECIMAL(12,2) NOT NULL,
    "targetCurrency" VARCHAR(3) NOT NULL DEFAULT 'KES',
    "raisedAmountKES" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "raisedAmountOriginal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pledgedAmountKES" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pledgedAmountOriginal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "launchDate" TIMESTAMP(3),
    "targetEndDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Pledge"
CREATE TABLE "Pledge" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "pledgeCurrency" VARCHAR(3) NOT NULL,
    "totalAmountKES" DECIMAL(12,2) NOT NULL,
    "frequency" TEXT NOT NULL,
    "installmentAmount" DECIMAL(12,2) NOT NULL,
    "numberOfInstallments" INTEGER NOT NULL,
    "amountPaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "remainingAmount" DECIMAL(12,2) NOT NULL,
    "status" "PledgeStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedEndDate" TIMESTAMP(3) NOT NULL,
    "actualEndDate" TIMESTAMP(3),
    "nextPaymentDueDate" TIMESTAMP(3) NOT NULL,
    "lastPaymentDate" TIMESTAMP(3),
    "defaultNoticeSent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable "ConstructionPhase"
CREATE TABLE "ConstructionPhase" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ConstructionPhaseStatus" NOT NULL DEFAULT 'PLANNED',
    "plannedStartDate" TIMESTAMP(3) NOT NULL,
    "plannedEndDate" TIMESTAMP(3) NOT NULL,
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "percentComplete" INTEGER NOT NULL DEFAULT 0,
    "budget" DECIMAL(12,2) NOT NULL,
    "spentAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConstructionPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable "ProgressUpdate"
CREATE TABLE "ProgressUpdate" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "constructionPhaseId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "percentComplete" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Budget"
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "allocatedAmount" DECIMAL(12,2) NOT NULL,
    "spentAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "remainingAmount" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Expense"
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "vendor" TEXT,
    "receiptUrl" TEXT,
    "category" TEXT,
    "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
    "submittedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Volunteer"
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skills" JSONB,
    "availabilityNotes" TEXT,
    "totalHoursWorked" INTEGER NOT NULL DEFAULT 0,
    "status" "VolunteerStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable "VolunteerShift"
CREATE TABLE "VolunteerShift" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "projectId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "hoursWorked" DECIMAL(5,2),
    "status" "ShiftStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolunteerShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Material"
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "cost" DECIMAL(12,2) NOT NULL,
    "status" "MaterialStatus" NOT NULL DEFAULT 'REQUESTED',
    "supplier" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "expectedDelivery" TIMESTAMP(3),
    "deliveryDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable "SeatingSponsorship"
CREATE TABLE "SeatingSponsorship" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "status" "SeatingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "sponsorName" TEXT,
    "sponsorEmail" TEXT,
    "sponsorAmount" DECIMAL(12,2) NOT NULL,
    "sponsorCurrency" VARCHAR(3),
    "dedicationMessage" TEXT,
    "reservedAt" TIMESTAMP(3),
    "sponsorshipDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeatingSponsorship_pkey" PRIMARY KEY ("id")
);

-- CreateTable "AuditLog"
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actor" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "beforeData" JSONB,
    "afterData" JSONB,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_userId_key" ON "Donor"("userId");

-- CreateIndex
CREATE INDEX "Donor_userId_idx" ON "Donor"("userId");

-- CreateIndex
CREATE INDEX "Donor_totalDonatedKES_idx" ON "Donor"("totalDonatedKES");

-- CreateIndex
CREATE INDEX "Donor_donationCount_idx" ON "Donor"("donationCount");

-- CreateIndex
CREATE INDEX "Donor_createdAt_idx" ON "Donor"("createdAt");

-- CreateIndex
CREATE INDEX "Donor_archivedAt_idx" ON "Donor"("archivedAt");

-- CreateIndex
CREATE INDEX "Donor_preferredDisplayCurrency_idx" ON "Donor"("preferredDisplayCurrency");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_code_key" ON "Currency"("code");

-- CreateIndex
CREATE INDEX "Currency_code_idx" ON "Currency"("code");

-- CreateIndex
CREATE INDEX "Currency_active_idx" ON "Currency"("active");

-- CreateIndex
CREATE INDEX "Currency_displayOrder_idx" ON "Currency"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyCountry_currencyId_countryCode_key" ON "CurrencyCountry"("currencyId", "countryCode");

-- CreateIndex
CREATE INDEX "CurrencyCountry_currencyId_idx" ON "CurrencyCountry"("currencyId");

-- CreateIndex
CREATE INDEX "CurrencyCountry_countryCode_idx" ON "CurrencyCountry"("countryCode");

-- CreateIndex
CREATE INDEX "CurrencyCountry_isPrimary_idx" ON "CurrencyCountry"("isPrimary");

-- CreateIndex
CREATE INDEX "ExchangeRate_sourceCode_idx" ON "ExchangeRate"("sourceCode");

-- CreateIndex
CREATE INDEX "ExchangeRate_targetCode_idx" ON "ExchangeRate"("targetCode");

-- CreateIndex
CREATE INDEX "ExchangeRate_timestamp_idx" ON "ExchangeRate"("timestamp");

-- CreateIndex
CREATE INDEX "ExchangeRate_source_idx" ON "ExchangeRate"("source");

-- CreateIndex
CREATE INDEX "ExchangeRate_usedInTransaction_idx" ON "ExchangeRate"("usedInTransaction");

-- CreateIndex
CREATE INDEX "DonorCurrencyPreference_donorId_idx" ON "DonorCurrencyPreference"("donorId");

-- CreateIndex
CREATE INDEX "DonorCurrencyPreference_currencyCode_idx" ON "DonorCurrencyPreference"("currencyCode");

-- CreateIndex
CREATE INDEX "DonorCurrencyPreference_activeSince_idx" ON "DonorCurrencyPreference"("activeSince");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_transactionReference_key" ON "Donation"("transactionReference");

-- CreateIndex
CREATE INDEX "Donation_donorId_idx" ON "Donation"("donorId");

-- CreateIndex
CREATE INDEX "Donation_projectId_idx" ON "Donation"("projectId");

-- CreateIndex
CREATE INDEX "Donation_status_idx" ON "Donation"("status");

-- CreateIndex
CREATE INDEX "Donation_createdAt_idx" ON "Donation"("createdAt");

-- CreateIndex
CREATE INDEX "Donation_paymentVerifiedAt_idx" ON "Donation"("paymentVerifiedAt");

-- CreateIndex
CREATE INDEX "Donation_transactionReference_idx" ON "Donation"("transactionReference");

-- CreateIndex
CREATE INDEX "Donation_paymentEventId_idx" ON "Donation"("paymentEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_donationId_key" ON "PaymentTransaction"("donationId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_providerTransactionId_key" ON "PaymentTransaction"("providerTransactionId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_providerTransactionId_idx" ON "PaymentTransaction"("providerTransactionId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_donationId_idx" ON "PaymentTransaction"("donationId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_providerStatus_idx" ON "PaymentTransaction"("providerStatus");

-- CreateIndex
CREATE INDEX "PaymentTransaction_confirmedAt_idx" ON "PaymentTransaction"("confirmedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentEvent_eventId_key" ON "PaymentEvent"("eventId");

-- CreateIndex
CREATE INDEX "PaymentEvent_eventId_idx" ON "PaymentEvent"("eventId");

-- CreateIndex
CREATE INDEX "PaymentEvent_paymentTransactionId_idx" ON "PaymentEvent"("paymentTransactionId");

-- CreateIndex
CREATE INDEX "PaymentEvent_processed_idx" ON "PaymentEvent"("processed");

-- CreateIndex
CREATE INDEX "PaymentEvent_eventType_idx" ON "PaymentEvent"("eventType");

-- CreateIndex
CREATE INDEX "PaymentEvent_eventTimestamp_idx" ON "PaymentEvent"("eventTimestamp");

-- CreateIndex
CREATE INDEX "PaymentEvent_processingStatus_idx" ON "PaymentEvent"("processingStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_donationId_key" ON "Settlement"("donationId");

-- CreateIndex
CREATE INDEX "Settlement_donationId_idx" ON "Settlement"("donationId");

-- CreateIndex
CREATE INDEX "Settlement_status_idx" ON "Settlement"("status");

-- CreateIndex
CREATE INDEX "Settlement_settlementDate_idx" ON "Settlement"("settlementDate");

-- CreateIndex
CREATE INDEX "RefundReversal_donationId_idx" ON "RefundReversal"("donationId");

-- CreateIndex
CREATE INDEX "RefundReversal_refundType_idx" ON "RefundReversal"("refundType");

-- CreateIndex
CREATE INDEX "RefundReversal_status_idx" ON "RefundReversal"("status");

-- CreateIndex
CREATE INDEX "RefundReversal_processedAt_idx" ON "RefundReversal"("processedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_donationId_key" ON "Receipt"("donationId");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receiptNumber_key" ON "Receipt"("receiptNumber");

-- CreateIndex
CREATE INDEX "Receipt_donationId_idx" ON "Receipt"("donationId");

-- CreateIndex
CREATE INDEX "Receipt_donorId_idx" ON "Receipt"("donorId");

-- CreateIndex
CREATE INDEX "Receipt_receiptNumber_idx" ON "Receipt"("receiptNumber");

-- CreateIndex
CREATE INDEX "Receipt_issuedAt_idx" ON "Receipt"("issuedAt");

-- CreateIndex
CREATE INDEX "Notification_donationId_idx" ON "Notification"("donationId");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_channel_idx" ON "Notification"("channel");

-- CreateIndex
CREATE INDEX "Notification_sentAt_idx" ON "Notification"("sentAt");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_featured_idx" ON "Project"("featured");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "Pledge_donorId_idx" ON "Pledge"("donorId");

-- CreateIndex
CREATE INDEX "Pledge_projectId_idx" ON "Pledge"("projectId");

-- CreateIndex
CREATE INDEX "Pledge_status_idx" ON "Pledge"("status");

-- CreateIndex
CREATE INDEX "Pledge_nextPaymentDueDate_idx" ON "Pledge"("nextPaymentDueDate");

-- CreateIndex
CREATE INDEX "Pledge_createdAt_idx" ON "Pledge"("createdAt");

-- CreateIndex
CREATE INDEX "ConstructionPhase_projectId_idx" ON "ConstructionPhase"("projectId");

-- CreateIndex
CREATE INDEX "ConstructionPhase_status_idx" ON "ConstructionPhase"("status");

-- CreateIndex
CREATE INDEX "ConstructionPhase_createdAt_idx" ON "ConstructionPhase"("createdAt");

-- CreateIndex
CREATE INDEX "ProgressUpdate_projectId_idx" ON "ProgressUpdate"("projectId");

-- CreateIndex
CREATE INDEX "ProgressUpdate_publishedAt_idx" ON "ProgressUpdate"("publishedAt");

-- CreateIndex
CREATE INDEX "ProgressUpdate_createdAt_idx" ON "ProgressUpdate"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_projectId_year_category_key" ON "Budget"("projectId", "year", "category");

-- CreateIndex
CREATE INDEX "Budget_projectId_idx" ON "Budget"("projectId");

-- CreateIndex
CREATE INDEX "Budget_status_idx" ON "Budget"("status");

-- CreateIndex
CREATE INDEX "Budget_year_idx" ON "Budget"("year");

-- CreateIndex
CREATE INDEX "Expense_budgetId_idx" ON "Expense"("budgetId");

-- CreateIndex
CREATE INDEX "Expense_status_idx" ON "Expense"("status");

-- CreateIndex
CREATE INDEX "Expense_submittedBy_idx" ON "Expense"("submittedBy");

-- CreateIndex
CREATE INDEX "Expense_approvedBy_idx" ON "Expense"("approvedBy");

-- CreateIndex
CREATE INDEX "Expense_createdAt_idx" ON "Expense"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_userId_key" ON "Volunteer"("userId");

-- CreateIndex
CREATE INDEX "Volunteer_userId_idx" ON "Volunteer"("userId");

-- CreateIndex
CREATE INDEX "Volunteer_status_idx" ON "Volunteer"("status");

-- CreateIndex
CREATE INDEX "Volunteer_totalHoursWorked_idx" ON "Volunteer"("totalHoursWorked");

-- CreateIndex
CREATE INDEX "VolunteerShift_volunteerId_idx" ON "VolunteerShift"("volunteerId");

-- CreateIndex
CREATE INDEX "VolunteerShift_projectId_idx" ON "VolunteerShift"("projectId");

-- CreateIndex
CREATE INDEX "VolunteerShift_status_idx" ON "VolunteerShift"("status");

-- CreateIndex
CREATE INDEX "VolunteerShift_scheduledDate_idx" ON "VolunteerShift"("scheduledDate");

-- CreateIndex
CREATE INDEX "Material_projectId_idx" ON "Material"("projectId");

-- CreateIndex
CREATE INDEX "Material_status_idx" ON "Material"("status");

-- CreateIndex
CREATE INDEX "Material_category_idx" ON "Material"("category");

-- CreateIndex
CREATE UNIQUE INDEX "SeatingSponsorship_projectId_seatNumber_key" ON "SeatingSponsorship"("projectId", "seatNumber");

-- CreateIndex
CREATE INDEX "SeatingSponsorship_projectId_idx" ON "SeatingSponsorship"("projectId");

-- CreateIndex
CREATE INDEX "SeatingSponsorship_status_idx" ON "SeatingSponsorship"("status");

-- CreateIndex
CREATE INDEX "SeatingSponsorship_sponsorEmail_idx" ON "SeatingSponsorship"("sponsorEmail");

-- CreateIndex
CREATE INDEX "AuditLog_actor_idx" ON "AuditLog"("actor");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyCountry" ADD CONSTRAINT "CurrencyCountry_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonorCurrencyPreference" ADD CONSTRAINT "DonorCurrencyPreference_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonorCurrencyPreference" ADD CONSTRAINT "DonorCurrencyPreference_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_exchangeRateId_fkey" FOREIGN KEY ("exchangeRateId") REFERENCES "ExchangeRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_paymentEventId_fkey" FOREIGN KEY ("paymentEventId") REFERENCES "PaymentEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentEvent" ADD CONSTRAINT "PaymentEvent_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "PaymentTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundReversal" ADD CONSTRAINT "RefundReversal_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundReversal" ADD CONSTRAINT "RefundReversal_initiator_fkey" FOREIGN KEY ("initiatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_targetCurrency_fkey" FOREIGN KEY ("targetCurrency") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pledge" ADD CONSTRAINT "Pledge_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pledge" ADD CONSTRAINT "Pledge_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstructionPhase" ADD CONSTRAINT "ConstructionPhase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressUpdate" ADD CONSTRAINT "ProgressUpdate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressUpdate" ADD CONSTRAINT "ProgressUpdate_constructionPhaseId_fkey" FOREIGN KEY ("constructionPhaseId") REFERENCES "ConstructionPhase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerShift" ADD CONSTRAINT "VolunteerShift_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerShift" ADD CONSTRAINT "VolunteerShift_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatingSponsorship" ADD CONSTRAINT "SeatingSponsorship_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actor_fkey" FOREIGN KEY ("actor") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
