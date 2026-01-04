<<<<<<< HEAD
<<<<<<< HEAD
import { verifyAccessToken } from "#lib/jwt";
=======
import { verifyToken } from "#lib/jwt";
>>>>>>> b9aac9d (ajout du middleware auth et changement de mot de passe sécurisé)
=======
import { verifyAccessToken } from "#lib/jwt";
>>>>>>> 0afa030 (login github user)
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
<<<<<<< HEAD
<<<<<<< HEAD
    const payload = await verifyAccessToken(token);
=======
    const payload = await verifyToken(token);
>>>>>>> b9aac9d (ajout du middleware auth et changement de mot de passe sécurisé)
=======
    const payload = await verifyAccessToken(token);
>>>>>>> 0afa030 (login github user)
    

    req.user = { id: payload.id };
    
    next();
  } catch (error) {
    next(new UnauthorizedException("Authentification échouée"));
  }
};