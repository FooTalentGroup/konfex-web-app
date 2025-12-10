import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "../../generated/prisma/client";

const adapter = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "Missing required environment variable: DATABASE_URL. Please check your .env file.",
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const prismaAdapter = new PrismaPg(pool);

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    adapter: prismaAdapter,
    errorFormat: "pretty",
  });
};

declare global {
   
  var prismaGlobal: undefined | ReturnType<typeof adapter>;
}

const prisma = globalThis.prismaGlobal ?? adapter();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
