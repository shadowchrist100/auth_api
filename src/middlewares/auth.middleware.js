import { verifyAccessToken } from "#lib/jwt";
import prisma from "#lib/prisma";
import { UnauthorizedException } from "#lib/exceptions";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException("Token manquant");
    }

    // On vérifie si le token est dans la blacklist (déconnexion)
    const isBlacklisted = await prisma.blacklistedAccessToken.findUnique({
      where: { token }
    });
    
    if (isBlacklisted) {
      throw new UnauthorizedException("Token révoqué");
    }

    // On vérifie la validité du JWT (Access Token)
    const payload = await verifyAccessToken(token);

    // On attache l'ID de l'utilisateur à la requête pour les routes suivantes
    req.user = { id: payload.id };
    
    next();
  } catch (error) {
    // Si verifyAccessToken expire ou est invalide, on renvoie une erreur 401
    next(new UnauthorizedException("Authentification échouée"));
  }
};