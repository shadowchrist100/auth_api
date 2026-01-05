import { verifyAccessToken } from "#lib/jwt";
import prisma from "#lib/prisma";
import { UnauthorizedException } from "#lib/exceptions";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("Token manquant");
    }

    // blacklist
    const isBlacklisted = await prisma.blacklistedAccessToken.findUnique({
      where: { token },
    });
    if (isBlacklisted) {
      throw new UnauthorizedException("Token révoqué");
    }


    const payload = await verifyAccessToken(token);

    if (!payload.userId) {
      throw new UnauthorizedException("Token invalide");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.disabledAt) {
      throw new UnauthorizedException("Utilisateur invalide");
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    next(new UnauthorizedException("Authentification échouée"));
  }
};
