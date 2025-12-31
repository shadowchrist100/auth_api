import { Router } from "express";
import { UserController } from "#controllers/user.controller";
import { asyncHandler } from "#lib/async-handler";

const router = Router();

// Inscription et Connexion
router.post("/register", asyncHandler(UserController.register));
router.post("/login", asyncHandler(UserController.login));

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
router.post("/refresh", asyncHandler(UserController.refresh));
router.post("/logout", asyncHandler(UserController.logout));

// src/routes/auth.routes.js
router.post("/forgot_password", asyncHandler(UserController.forgotPassword));
router.post("/reset_password", asyncHandler(UserController.resetPassword));

=======
>>>>>>> 6c18f1b (OAuth authentication with github)
=======
>>>>>>> 72d6a2d (Rafraîchissement de jeton et gestion de la déconnexion)
// authentification via github
router.get("/auth/github", asyncHandler(UserController.githubAuth));
router.get("/auth/githubCallback", asyncHandler(UserController.githubCallback));
=======
router.post("/refresh", asyncHandler(UserController.refresh));
router.post("/logout", asyncHandler(UserController.logout));
>>>>>>> 3727738 (Rafraîchissement de jeton et gestion de la déconnexion)

<<<<<<< HEAD
=======
>>>>>>> 6764f0f (correction1)
=======
>>>>>>> 6c18f1b (OAuth authentication with github)
export default router;
