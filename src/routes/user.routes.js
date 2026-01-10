import { Router } from "express";
import { UserController } from "#controllers/user.controller";
import { asyncHandler } from "#lib/async-handler";
import { auth } from "#middlewares/auth.middleware";
import { requireSession } from "#middlewares/auth.middleware";


const router = Router();


router.post("/change-password", auth, asyncHandler(UserController.changePassword));
router.post("/logout",auth, asyncHandler(UserController.logout));
// vérifier son email
router.get("/verify_email", auth, asyncHandler(UserController.verifyEmail));d

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
router.get("/revoque_session/:id", auth, asyncHandler(UserController.revokeSessionById))
router.get("/revoqueAll", auth, asyncHandler(UserController.revokeOthers));

export default router;

