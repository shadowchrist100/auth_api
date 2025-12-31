import { Router } from "express";
import { UserController } from "#controllers/user.controller";
import { asyncHandler } from "#lib/async-handler";
<<<<<<< HEAD
<<<<<<< HEAD
import { auth } from "#middlewares/auth.middleware";
=======
//import { auth } from "#middlewares/auth";
>>>>>>> 6764f0f (correction1)
=======
import { auth } from "#middlewares/auth.middleware";
>>>>>>> b9aac9d (ajout du middleware auth et changement de mot de passe sécurisé)

const router = Router();

// Consultation de la liste ou d'un utilisateur
router.get("/", asyncHandler(UserController.getAll));
router.get("/:id", asyncHandler(UserController.getById));

router.post("/change-password", auth, asyncHandler(UserController.changePassword));
export default router;
