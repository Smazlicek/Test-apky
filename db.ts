import { PrismaClient } from "@prisma/client";

// Standardní vzor pro Next.js: v dev módu se stránky často znovu načítají
// (hot reload), takže bez tohohle triku by se pořád vytvářely nová
// připojení k databázi. V produkci se vytvoří jen jedna instance.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
