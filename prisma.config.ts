import { config } from "dotenv"
import { defineConfig } from "prisma/config"

// Prisma CLI reads .env by default, not .env.local — load it explicitly
config({ path: ".env.local" })

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use direct connection for migrations (bypasses PgBouncer pooler)
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
})
