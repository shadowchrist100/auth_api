import crypto from 'node:crypto'; 
import { SignJWT, jwtVerify } from "jose";
import prisma from "#lib/prisma";
<<<<<<< HEAD
import { config } from '#config/env';
=======
>>>>>>> aa1ec1f (feat: implémentation de la connexion avec double token (Access et Refresh))

const secret = new TextEncoder().encode(config.JWT_SECRET);
const alg = "HS256";

<<<<<<< HEAD
<<<<<<< HEAD
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

export async function verifyAccessToken(token) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function verifyRefreshToken(token) {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!storedToken) return null;

  // Vérifier s'il est expiré ou révoqué
  const isExpired = new Date() > storedToken.expiresAt;
  const isRevoked = storedToken.revokedAt !== null;

  if (isExpired || isRevoked) return null;

  return storedToken;
=======
export async function signToken(payload, expiresIn = "7d") {
=======
export async function generateAccessToken(payload) {
>>>>>>> aa1ec1f (feat: implémentation de la connexion avec double token (Access et Refresh))
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
>>>>>>> 6764f0f (correction1)
}