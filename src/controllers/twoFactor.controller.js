import * as twoFactorService from '../services/twofactor.service.js';
import prisma from '../lib/prisma.js';

export const setup2FA = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { id: userId } 
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    
    const { secret, qrCodeDataURL } = await twoFactorService.generateTwoFactorSetup(user.email);

    
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret }
    });

    
    return res.status(200).json({
      success: true,
      qrCode: qrCodeDataURL,
      tempSecret: secret
    });

  } catch (error) {
    console.error("Erreur détaillée :", error);
    return res.status(500).json({ 
      message: "Erreur lors de la configuration 2FA",
      error: error.message 
    });
  }
};
export const verifyAndEnable2FA = async (req, res) => {
  try {
    const { token, tempSecret, userId } = req.body; 

    if (!token || !tempSecret || !userId) {
      return res.status(400).json({ message: "Données manquantes (token, secret ou userId)" });
    }

    const isValid = twoFactorService.verifyTwoFactorToken(token, tempSecret);

    if (!isValid) {
      return res.status(400).json({ message: "Code invalide ou expiré, réessayez." });
    }

    // Mise à jour de l'utilisateur dans SQLite
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: tempSecret, // On stocke le secret définitif
        twoFactorEnabledAt: new Date(), // On active officiellement le 2FA
      },
    });

    return res.status(200).json({ 
      success: true, 
      message: "2FA activée avec succès !" 
    });
  } catch (error) {
    console.error("Erreur vérification :", error);
    return res.status(500).json({ message: "Erreur lors de la validation" });
  }
};