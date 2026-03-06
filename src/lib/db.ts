import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Prisma Client with Neon Serverless Adapter
 * Optimized for development and production connection stability.
 */

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL is not defined in environment variables.");
}

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error("❌ DATABASE_URL is missing! Prisma will likely fail.");
  } else {
    // Masked log for security
    const host = connectionString.split('@')[1]?.split('/')[0] || "unknown";
    console.log(`🐘 Prisma: Connection String found. Host: ${host}`);
  }

  const pool = new pg.Pool({ 
    connectionString,
    connectionTimeoutMillis: 10000, 
    max: 10,
  });

  const adapter = new PrismaPg(pool);
  
  console.log("🐘 Prisma: Initializing with Neon Adapter");
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
