import prisma from '#lib/prisma';
import { NotFoundException } from '#lib/exceptions';	
export class ProfileService {
	/** Récupère les informations du profil de l'utilisateur */
	static async getMe(userId) {
		const user= await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new NotFoundException("Utilisateur introuvable");
		}
		return user;
	}
	/** Met à jour les informations du profil de l'utilisateur */
	static async updateMe(userId, data) {
		const user = await prisma.user.update({
			where: { id: userId },
		});
		if (!user) {
			throw new NotFoundException("Utilisateur introuvable");
		}	
		return prisma.user.update({
			where: { id: userId },
			data,
		});
	}
	/** Désactive le compte de l'utilisateur */
	static async deleteMe(userId) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});	
		if (!user) {
			throw new NotFoundException("Utilisateur introuvable");
		}
		return prisma.user.delete({
			where: { id: userId },
			data:{
				disabledAt: new Date(),
			}
		});
	}
}