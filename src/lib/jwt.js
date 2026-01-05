import crypto from 'node:crypto'; 
import { SignJWT, jwtVerify } from "jose";
import prisma from "#lib/prisma";
import { config } from '#config/env';

const secret = new TextEncoder().encode(config.JWT_SECRET);
const alg = "HS256";

// Génère un token de courte durée (ex: 15m)
export async function generateAccessToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

// Crée un Refresh Token en base de données (valide 7 jours)
export async function createRefreshToken(userId) {
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

// Vérifie la validité d'un Access Token
export async function verifyAccessToken(token) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

// Vérifie si le Refresh Token existe, n'est pas expiré et n'est pas révoqué
export async function verifyRefreshToken(token) {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!storedToken) return null;

  const isExpired = new Date() > storedToken.expiresAt;
  const isRevoked = storedToken.revokedAt !== null;

  if (isExpired || isRevoked) return null;

  return storedToken;
}