# This file documents the database setup for Task 4

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `backend/` directory with the following variable:

```
DATABASE_URL="postgresql://user:password@localhost:5432/clinic6_sda_dev"
```

For local development, you can use:

- User: `postgres` (or your PostgreSQL user)
- Password: (your PostgreSQL password)
- Database: `clinic6_sda_dev` (create this database if it doesn't exist)

### 2. Running Migrations

After setting DATABASE_URL, run:

```bash
cd backend
npm run db:migrate
```

This will:

- Create the migration file from the Prisma schema
- Apply the migration to your database
- Generate Prisma Client

### 3. Seeding Data

After migrations are applied, seed the database with:

```bash
npm run db:seed
```

This will populate the centralized currency catalog and other seed data.

### 4. PostgreSQL Setup (Development)

If you don't have PostgreSQL installed, you can use Docker:

```bash
docker run --name clinic6-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=clinic6_sda_dev -p 5432:5432 -d postgres:15
```

Then use:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/clinic6_sda_dev"
```

### 5. Inspecting the Database

Use Prisma Studio to inspect the database:

```bash
npx prisma studio
```

This opens a web UI for viewing and editing data.

## Schema Overview

The database implements all entities from Task 3:

- **Users & Donors**: User accounts, donor profiles, currency preferences
- **Donations & Payments**: Multi-currency donations, payment transactions, payment events, settlements
- **Financial**: Currencies, exchange rates, refunds/reversals, receipts
- **Projects**: Fundraising projects, construction phases, progress updates
- **Budget & Expenses**: Budget allocations and expense tracking
- **Volunteers**: Volunteer profiles and shift management
- **Materials & Seating**: Materials inventory and seating sponsorship
- **Notifications**: Notification delivery tracking (independent from payment status)
- **Audit**: Immutable audit logs for all sensitive operations

## Key Architecture Points

- **Multi-Currency**: Extensible currency catalog supporting any ISO 4217 currency
- **Financial Immutability**: Original transaction amounts, settlement amounts, and exchange rates are never modified
- **Payment Verification**: Database structures support webhook-based payment verification (not frontend-based)
- **Idempotency**: PaymentEvent.eventId ensures duplicate payment webhooks are handled safely
- **Status Independence**: Notification delivery status is completely independent from payment/donation status
