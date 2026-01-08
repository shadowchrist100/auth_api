import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .optional(),

  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .optional(),

  email: z
    .string()
    .email("Email invalide")
    .optional(),
});
