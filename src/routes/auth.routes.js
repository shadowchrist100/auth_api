import { Router } from "express";
import { UserController } from "#controllers/user.controller";
import { asyncHandler } from "#lib/async-handler";
import { loginLimiter } from "#middlewares/rateLimiter";

const router = Router();

// Inscription et Connexion
router.post("/register", asyncHandler(UserController.register));
router.post("/login", loginLimiter, asyncHandler(UserController.login));
//connexion si 2fa activé
router.post("/2faVerifyAndlogin", asyncHandler(UserController.verify2FALogin));

router.get("/auth/emailVerification", asyncHandler(UserController.emialVerification));

router.post("/refresh", asyncHandler(UserController.refresh));
router.post("/logout", asyncHandler(UserController.logout));

// src/routes/auth.routes.js
router.post("/forgot_password", asyncHandler(UserController.forgotPassword));
router.post("/reset_password", asyncHandler(UserController.resetPassword));

// authentification via github
router.get("/auth/github", asyncHandler(UserController.githubAuth));
router.get("/auth/githubCallback", asyncHandler(UserController.githubCallback));

export default router;