import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max:5, // 5 tentatives par IP
	message: {
		success: false,
		error: "Trop de tentatives de connexion,réessayez après 15 minutes"
	},
	standardHeaders: true,// ajoute les en-têtes RateLimit dans la réponse
	legacyHeaders: false,
});