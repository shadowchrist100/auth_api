import { verifyToken } from "#lib/jwt";
import prisma from "#lib/prisma";
import { UnauthorizedException } from "#lib/exceptions";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) throw new UnauthorizedException("Token manquant");

    //on vérifie si le token est dans la blacklist
    const isBlacklisted = await prisma.blacklistedAccessToken.findUnique({
      where: { token }
    });
    if (isBlacklisted) throw new UnauthorizedException("Token révoqué");

    //on vérifie la validité du JWT
    const payload = await verifyToken(token);
    

    req.user = { id: payload.id };
    
    next();
  } catch (error) {
    next(new UnauthorizedException("Authentification échouée"));
  }
};