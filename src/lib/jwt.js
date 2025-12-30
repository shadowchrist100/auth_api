import crypto from 'node:crypto'; 
import { SignJWT, jwtVerify } from "jose";
import prisma from "#lib/prisma";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const alg = "HS256";

export async function generateAccessToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function createRefreshToken(userId) {
  // Utilisation sécurisée de randomBytes
  const token = crypto.randomBytes(40).toString("hex");
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}