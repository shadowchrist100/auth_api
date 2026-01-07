import crypto from 'node:crypto'; 
import { SignJWT, jwtVerify } from "jose";
import prisma from "#lib/prisma";
import { config } from '#config/env';

const accessSecret = new TextEncoder().encode(config.ACCESS_TOKEN_SECRET);
const refreshSecret = new TextEncoder().encode(config.REFRESH_TOKEN_SECRET);

const alg = "HS256";

const generatePadding = () => crypto.randomBytes(400).toString("hex");
// Génère un token de courte durée (ex: 15m)
export async function generateAccessToken(payload) {
  return new SignJWT({payload, padding: generatePadding()})
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(accessSecret);
}

// Crée un Refresh Token en base de données (valide 7 jours)
export async function createRefreshToken(userId) {
  const token = crypto.randomBytes(512).toString("hex");
  
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
  const { payload } = await jwtVerify(token, accessSecret);
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