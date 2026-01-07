import { Router } from "express";
import { UserController } from "#controllers/user.controller";
import { asyncHandler } from "#lib/async-handler";
import { auth } from "#middlewares/auth.middleware";

const router = Router();

// Consultation de la liste ou d'un utilisateur
router.get("/", asyncHandler(UserController.getAll));
router.get("/:id", asyncHandler(UserController.getById));

router.post("/change-password", auth, asyncHandler(UserController.changePassword));
export default router;

