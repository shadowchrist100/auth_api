import { Router } from "express";
import { UserController } from "#controllers/user.controller";
import { asyncHandler } from "#lib/async-handler";
import { auth } from "#middlewares/auth.middleware";
import { requireSession } from "#middlewares/auth.middleware";


const router = Router();


router.post("/change-password", auth, asyncHandler(UserController.changePassword));
router.post("/logout",auth, asyncHandler(UserController.logout));


// SESSION : vérifier si elle existe
router.get(
  "/me/session",
  requireSession,
  asyncHandler(UserController.checkSession)
);

// LOGIN HISTORY : historique connexions
router.get(
  "/me/login-history",
  requireSession,
  asyncHandler(UserController.getLoginHistory)
);

router.get("/sessions", auth, asyncHandler(UserController.getSessions));

export default router;

