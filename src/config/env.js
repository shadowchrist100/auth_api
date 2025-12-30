import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
<<<<<<< HEAD
<<<<<<< HEAD
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_STATE: process.env.GITHUB_STATE
=======
>>>>>>> 6764f0f (correction1)
=======
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_STATE: process.env.GITHUB_STATE
>>>>>>> 6c18f1b (OAuth authentication with github)
};
