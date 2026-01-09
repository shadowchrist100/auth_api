import { verifyToken } from "#lib/jwt";
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
    if (isBlacklisted) throw new UnauthorizedException("Token révoqué");
    const payload = await verifyAccessToken(token);
    
// Récupère l'utilisateur
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || user.disabledAt) throw new UnauthorizedException("Utilisateur invalide");

    req.user = { id: user.id, email: user.email, name: user.firstName + " " + user.lastName };
    next();
    //req.user = { id: payload.id };
    
    //next();
  } catch (error) {
    next(new UnauthorizedException("Token invalide"));
  }
};

// Middleware pour protection par SESSION
export const requireSession = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Accès refusé : utilisateur non connecté"
    });
  }

  next(); // utilisateur connecté → on continue
};
