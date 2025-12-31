import { Router } from "express";
import { UserController } from "#controllers/user.controller";
import { asyncHandler } from "#lib/async-handler";

const router = Router();

// Inscription et Connexion
router.post("/register", asyncHandler(UserController.register));
router.post("/login", asyncHandler(UserController.login));

router.post("/refresh", asyncHandler(UserController.refresh));
router.post("/logout", asyncHandler(UserController.logout));

// src/routes/auth.routes.js
router.post("/forgot_password", asyncHandler(UserController.forgotPassword));
router.post("/reset_password", asyncHandler(UserController.resetPassword));
export default router;
