import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// .env file load karna na bhoole
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL not set. Ensure Neon DB is provisioned and .env file is configured");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
