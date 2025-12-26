import { z } from "zod";

export const registerSchema = z.object({
<<<<<<< HEAD
  email: z.string().email("Format d'email invalide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Doit contenir une majuscule")
    .regex(/[0-9]/, "Doit contenir un chiffre"),
  firstName: z.string().min(2, "Prénom trop court").optional(),
  lastName: z.string().min(2, "Nom trop court").optional(),
=======
  email: z.email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
  name: z.string().min(2).optional(),
>>>>>>> 6764f0f (correction1)
});

export const loginSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

