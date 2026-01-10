import { verifyToken } from "#lib/jwt";
import { verifyAccessToken } from "#lib/jwt";
import prisma from "#lib/prisma";
import { UnauthorizedException } from "#lib/exceptions";

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  let payload;

  if (!token) {
    throw new UnauthorizedException("Access Token manquant");
  }

  // On vérifie si le token est dans la blacklist (déconnexion)
  const isBlacklisted = await prisma.blacklistedAccessToken.findUnique({
    where: { token }
  });
  if (isBlacklisted) throw new UnauthorizedException("Access Token révoqué");

  try {
    payload = await verifyAccessToken(token);

  } catch (error) {
    throw new UnauthorizedException("Access token invalide ou expiré")
  }



  // Récupère l'utilisateur
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user || user.disabledAt) throw new UnauthorizedException("Utilisateur invalide");

  req.user = { id: user.id, email: user.email, name: user.firstName + " " + user.lastName };
  next();
  //req.user = { id: payload.id };

  //next();
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
