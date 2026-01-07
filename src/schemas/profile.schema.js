import {z} from "zod";
/**
 * Schema de validation pour la mise à jour du profil utilisateur
 * Tous les champs sont optionnels
 */
export const updateProfileSchema = z.object({
		name: z
		.string()
		.min(2, "Le nom doit contenir au moins 2 caractères")
		.optional(),

		email:z
		.string()
		.email("Email invalide")
		.optional(),
});