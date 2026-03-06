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
  
  const pool = new pg.Pool({ 
    connectionString,
    connectionTimeoutMillis: 10000, // 10s timeout
    max: 10, // Adjust based on your Neon tier
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
