import { generateTwoFactorSetup } from "#services/twofactor.service";
import { verifyTwoFactorToken } from "#services/twofactor.service";
import prisma from "#lib/prisma";

export const setup2FA = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }


    const { secret, qrCodeDataURL } = await generateTwoFactorSetup(user.email);


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
    const { token } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true }
    });

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: "Aucune configuration 2FA trouvée pour cet utilisateur." });
    }


    const isValid = verifyTwoFactorToken(token, user.twoFactorSecret);

    if (!isValid) {
      return res.status(400).json({ message: "Code invalide ou expiré." });
    }


    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabledAt: new Date() }
    });

    return res.status(200).json({ success: true, message: "2FA activée !" });

  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la validation." });
  }
};

export const disable2FA = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur manquant" });
    }


    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: null,
        twoFactorEnabledAt: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "La double authentification a été désactivée."
    });
  } catch (error) {
    console.error("Erreur désactivation :", error);
    return res.status(500).json({ message: "Erreur lors de la désactivation" });
  }
};