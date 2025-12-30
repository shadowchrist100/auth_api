import { Router } from "express";
import { UserController } from "#controllers/user.controller";
import { asyncHandler } from "#lib/async-handler";

const router = Router();

// Inscription et Connexion
router.post("/register", asyncHandler(UserController.register));
router.post("/login", asyncHandler(UserController.login));

// authentification via github
router.get("/auth/github", asyncHandler(UserController.githubAuth));
router.get("/auth/githubCallback", asyncHandler(UserController.githubCallback));

export default router;
