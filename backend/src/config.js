import dotenv from "dotenv";

// Load environment variables from a .env file in development
dotenv.config();

const env = process.env;

const config = {
  PORT: Number(env.PORT) || 5000,
  NODE_ENV: env.NODE_ENV || "development",
  // Future (non-required) placeholders
  DATABASE_URL: env.DATABASE_URL || "",
  JWT_SECRET: env.JWT_SECRET || "",
  FRONTEND_URL: env.FRONTEND_URL || "http://localhost:5173",
};

export default config;
