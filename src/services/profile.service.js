import prisma from "#lib/prisma"; // ton client Prisma
import { NotFoundException } from "#lib/exceptions";

export class ProfileService {
  /** Récupère les informations du profil */
  static async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        disabledAt: true,
      },
    });

    if (!user || user.disabledAt) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    return user;
  }

  /** Met à jour le profil */
  static async updateMe(userId, data) {
    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser || existingUser.disabledAt) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    // Mise à jour
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }

  /** Désactive le compte (soft delete) */
  static async deleteMe(userId) {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser || existingUser.disabledAt) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { disabledAt: new Date() },
    });

    return { success: true, message: "Compte désactivé avec succès" };
  }
}
