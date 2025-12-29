import { NotFoundException } from "#lib/exceptions";

let mockUser = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
  createdAt: new Date(),
  disabledAt: null,
};

export class ProfileService {
  /** Récupère les informations du profil */
  static async getMe(userId) {
    if (!mockUser || mockUser.id !== userId) {
      throw new NotFoundException("Utilisateur introuvable");
    }
    return mockUser;
  }

  /** Met à jour le profil */
  static async updateMe(userId, data) {
    if (!mockUser || mockUser.id !== userId) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    mockUser = { ...mockUser, ...data };
    return mockUser;
  }

  /** Désactive le compte (soft delete) */
  static async deleteMe(userId) {
    if (!mockUser || mockUser.id !== userId) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    mockUser.disabledAt = new Date();
  }
}
