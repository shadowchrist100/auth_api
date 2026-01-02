import "dotenv/config";
<<<<<<< HEAD
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";  
import { PrismaClient } from "@prisma/client";
=======
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// MODIFICATION : import par défaut car @prisma/client est en CommonJS
import pkg from "@prisma/client";
const { PrismaClient } = pkg; // MODIFICATION : extraction manuelle
>>>>>>> fe0e3ad (Gestion des sessions et LoginHistory)

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
