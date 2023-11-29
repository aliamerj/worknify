import type { Config } from "drizzle-kit";
import { env } from "process";

export default {
  schema: "./db/schemes/*.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL as string,
  },
} satisfies Config;
