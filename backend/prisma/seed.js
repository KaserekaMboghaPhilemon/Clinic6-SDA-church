/**
 * Database Seed Script
 * Populates the currency catalog with ISO 4217 currencies and country mappings
 * This script is idempotent - it can be run multiple times safely
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const nodeProcess =
  typeof globalThis.process !== "undefined"
    ? globalThis.process
    : {
        exit: (code = 0) => {
          if (code !== 0) {
            throw new Error(`Seed process exited with code ${code}`);
          }
        },
      };

const connectionString = nodeProcess.env?.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seed...");

  // Currency data: extensible global catalog per Task 3 spec
  const currencies = [
    // African currencies (priority)
    {
      code: "KES",
      name: "Kenyan Shilling",
      symbol: "KSh",
      decimalPlaces: 2,
      displayOrder: 1,
      searchAliases: ["Kenya", "shilling", "KES", "Ksh"],
      countries: [{ countryCode: "KE", countryName: "Kenya", isPrimary: true }],
    },
    {
      code: "UGX",
      name: "Ugandan Shilling",
      symbol: "USh",
      decimalPlaces: 0,
      displayOrder: 2,
      searchAliases: ["Uganda", "shilling", "UGX", "Ush"],
      countries: [
        { countryCode: "UG", countryName: "Uganda", isPrimary: true },
      ],
    },
    {
      code: "TZS",
      name: "Tanzanian Shilling",
      symbol: "TSh",
      decimalPlaces: 2,
      displayOrder: 3,
      searchAliases: ["Tanzania", "shilling", "TZS", "Tsh"],
      countries: [
        { countryCode: "TZ", countryName: "Tanzania", isPrimary: true },
      ],
    },
    {
      code: "RWF",
      name: "Rwandan Franc",
      symbol: "FRw",
      decimalPlaces: 0,
      displayOrder: 4,
      searchAliases: ["Rwanda", "franc", "RWF", "Frw"],
      countries: [
        { countryCode: "RW", countryName: "Rwanda", isPrimary: true },
      ],
    },
    {
      code: "ZAR",
      name: "South African Rand",
      symbol: "R",
      decimalPlaces: 2,
      displayOrder: 5,
      searchAliases: ["South Africa", "rand", "ZAR"],
      countries: [
        { countryCode: "ZA", countryName: "South Africa", isPrimary: true },
      ],
    },
    {
      code: "NGN",
      name: "Nigerian Naira",
      symbol: "₦",
      decimalPlaces: 2,
      displayOrder: 6,
      searchAliases: ["Nigeria", "naira", "NGN"],
      countries: [
        { countryCode: "NG", countryName: "Nigeria", isPrimary: true },
      ],
    },

    // Global currencies (common for donations)
    {
      code: "USD",
      name: "United States Dollar",
      symbol: "$",
      decimalPlaces: 2,
      displayOrder: 7,
      searchAliases: ["United States", "dollar", "USD", "$"],
      countries: [
        { countryCode: "US", countryName: "United States", isPrimary: true },
        { countryCode: "EC", countryName: "Ecuador", isPrimary: false },
        { countryCode: "PA", countryName: "Panama", isPrimary: false },
        { countryCode: "SV", countryName: "El Salvador", isPrimary: false },
      ],
    },
    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
      decimalPlaces: 2,
      displayOrder: 8,
      searchAliases: ["Europe", "euro", "EUR", "€"],
      countries: [
        { countryCode: "DE", countryName: "Germany", isPrimary: false },
        { countryCode: "FR", countryName: "France", isPrimary: false },
        { countryCode: "IT", countryName: "Italy", isPrimary: false },
        { countryCode: "ES", countryName: "Spain", isPrimary: false },
        { countryCode: "NL", countryName: "Netherlands", isPrimary: false },
        { countryCode: "AT", countryName: "Austria", isPrimary: false },
        { countryCode: "BE", countryName: "Belgium", isPrimary: false },
        { countryCode: "CY", countryName: "Cyprus", isPrimary: false },
        { countryCode: "EE", countryName: "Estonia", isPrimary: false },
        { countryCode: "FI", countryName: "Finland", isPrimary: false },
        { countryCode: "GR", countryName: "Greece", isPrimary: false },
        { countryCode: "IE", countryName: "Ireland", isPrimary: false },
        { countryCode: "LV", countryName: "Latvia", isPrimary: false },
        { countryCode: "LT", countryName: "Lithuania", isPrimary: false },
        { countryCode: "LU", countryName: "Luxembourg", isPrimary: false },
        { countryCode: "MT", countryName: "Malta", isPrimary: false },
        { countryCode: "PT", countryName: "Portugal", isPrimary: false },
        { countryCode: "SK", countryName: "Slovakia", isPrimary: false },
        { countryCode: "SI", countryName: "Slovenia", isPrimary: false },
      ],
    },
    {
      code: "GBP",
      name: "British Pound Sterling",
      symbol: "£",
      decimalPlaces: 2,
      displayOrder: 9,
      searchAliases: ["United Kingdom", "pound", "GBP", "£"],
      countries: [
        { countryCode: "GB", countryName: "United Kingdom", isPrimary: true },
        { countryCode: "GI", countryName: "Gibraltar", isPrimary: false },
        {
          countryCode: "FK",
          countryName: "Falkland Islands",
          isPrimary: false,
        },
        { countryCode: "GS", countryName: "South Georgia", isPrimary: false },
      ],
    },
    {
      code: "CAD",
      name: "Canadian Dollar",
      symbol: "C$",
      decimalPlaces: 2,
      displayOrder: 10,
      searchAliases: ["Canada", "dollar", "CAD", "C$"],
      countries: [
        { countryCode: "CA", countryName: "Canada", isPrimary: true },
      ],
    },
    {
      code: "AUD",
      name: "Australian Dollar",
      symbol: "A$",
      decimalPlaces: 2,
      displayOrder: 11,
      searchAliases: ["Australia", "dollar", "AUD", "A$"],
      countries: [
        { countryCode: "AU", countryName: "Australia", isPrimary: true },
        { countryCode: "CC", countryName: "Cocos Islands", isPrimary: false },
        {
          countryCode: "CX",
          countryName: "Christmas Island",
          isPrimary: false,
        },
        { countryCode: "HM", countryName: "Heard Island", isPrimary: false },
        { countryCode: "KI", countryName: "Kiribati", isPrimary: false },
        { countryCode: "NR", countryName: "Nauru", isPrimary: false },
        { countryCode: "TV", countryName: "Tuvalu", isPrimary: false },
      ],
    },
    {
      code: "CHF",
      name: "Swiss Franc",
      symbol: "CHF",
      decimalPlaces: 2,
      displayOrder: 12,
      searchAliases: ["Switzerland", "franc", "CHF"],
      countries: [
        { countryCode: "CH", countryName: "Switzerland", isPrimary: true },
        { countryCode: "LI", countryName: "Liechtenstein", isPrimary: false },
      ],
    },
    {
      code: "JPY",
      name: "Japanese Yen",
      symbol: "¥",
      decimalPlaces: 0,
      displayOrder: 13,
      searchAliases: ["Japan", "yen", "JPY", "¥"],
      countries: [{ countryCode: "JP", countryName: "Japan", isPrimary: true }],
    },
    {
      code: "CNY",
      name: "Chinese Yuan",
      symbol: "¥",
      decimalPlaces: 2,
      displayOrder: 14,
      searchAliases: ["China", "yuan", "CNY"],
      countries: [{ countryCode: "CN", countryName: "China", isPrimary: true }],
    },

    // Middle Eastern currencies
    {
      code: "AED",
      name: "United Arab Emirates Dirham",
      symbol: "د.إ",
      decimalPlaces: 2,
      displayOrder: 15,
      searchAliases: ["United Arab Emirates", "dirham", "AED"],
      countries: [
        {
          countryCode: "AE",
          countryName: "United Arab Emirates",
          isPrimary: true,
        },
      ],
    },
    {
      code: "SAR",
      name: "Saudi Arabian Riyal",
      symbol: "﷼",
      decimalPlaces: 2,
      displayOrder: 16,
      searchAliases: ["Saudi Arabia", "riyal", "SAR"],
      countries: [
        { countryCode: "SA", countryName: "Saudi Arabia", isPrimary: true },
      ],
    },

    // Additional regional currencies for expansion
    {
      code: "INR",
      name: "Indian Rupee",
      symbol: "₹",
      decimalPlaces: 2,
      displayOrder: 17,
      searchAliases: ["India", "rupee", "INR", "₹"],
      countries: [{ countryCode: "IN", countryName: "India", isPrimary: true }],
    },
    {
      code: "BRL",
      name: "Brazilian Real",
      symbol: "R$",
      decimalPlaces: 2,
      displayOrder: 18,
      searchAliases: ["Brazil", "real", "BRL", "R$"],
      countries: [
        { countryCode: "BR", countryName: "Brazil", isPrimary: true },
      ],
    },
    {
      code: "MXN",
      name: "Mexican Peso",
      symbol: "$",
      decimalPlaces: 2,
      displayOrder: 19,
      searchAliases: ["Mexico", "peso", "MXN"],
      countries: [
        { countryCode: "MX", countryName: "Mexico", isPrimary: true },
      ],
    },
    {
      code: "ZWL",
      name: "Zimbabwean Dollar",
      symbol: "Z$",
      decimalPlaces: 2,
      displayOrder: 20,
      searchAliases: ["Zimbabwe", "dollar", "ZWL"],
      countries: [
        { countryCode: "ZW", countryName: "Zimbabwe", isPrimary: true },
      ],
    },
  ];

  console.log(
    `Seeding ${currencies.length} currencies with country mappings...`,
  );

  for (const currencyData of currencies) {
    const {
      code,
      name,
      symbol,
      decimalPlaces,
      displayOrder,
      searchAliases,
      countries,
    } = currencyData;

    // Upsert currency (idempotent)
    const currency = await prisma.currency.upsert({
      where: { code },
      update: {
        name,
        symbol,
        decimalPlaces,
        displayOrder,
        searchAliases,
        active: true,
      },
      create: {
        code,
        name,
        symbol,
        decimalPlaces,
        displayOrder,
        searchAliases,
        active: true,
      },
    });

    console.log(`✓ Currency: ${code} (${name})`);

    // Upsert country mappings (idempotent)
    for (const country of countries) {
      await prisma.currencyCountry.upsert({
        where: {
          currencyId_countryCode: {
            currencyId: currency.id,
            countryCode: country.countryCode,
          },
        },
        update: {
          countryName: country.countryName,
          isPrimary: country.isPrimary,
        },
        create: {
          currencyId: currency.id,
          countryCode: country.countryCode,
          countryName: country.countryName,
          isPrimary: country.isPrimary,
        },
      });
    }

    console.log(`  → Mapped to ${countries.length} country/ies`);
  }

  console.log("\n✅ Database seed completed successfully!");
  console.log(`Total currencies seeded: ${currencies.length}`);
  console.log(
    `Total country mappings: ${currencies.reduce((sum, c) => sum + c.countries.length, 0)}`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    nodeProcess.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
