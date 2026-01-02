import "dotenv/config";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";  
import { PrismaClient } from "@prisma/client";
=======
=======
>>>>>>> 6764f0f (correction1)
=======
>>>>>>> d162d7b (register github user)
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// MODIFICATION : import par défaut car @prisma/client est en CommonJS
import pkg from "@prisma/client";
const { PrismaClient } = pkg; // MODIFICATION : extraction manuelle
<<<<<<< HEAD
>>>>>>> fe0e3ad (Gestion des sessions et LoginHistory)
=======
=======
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";  // ✅ Correct
=======
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";  
>>>>>>> c88580b (register github user)
import { PrismaClient } from "@prisma/client";
>>>>>>> 871047c (correction1)
>>>>>>> 6764f0f (correction1)

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
