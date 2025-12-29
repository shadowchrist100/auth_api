import { Router} from "express";
import { ProfileController } from "#controllers/profile.controller";
import {validate} from "#middlewares/validate";
import { updateProfileSchema } from "#schemas/profile.schema";
import { auth } from "#middlewares/auth";
import { asyncHandler } from "#lib/async-handler";

const router = Router();

// GET /me
router.get("/me", auth, asyncHandler(ProfileController.getMe));

// PUT /me
router.put("/me", auth, validate(updateProfileSchema), asyncHandler(ProfileController.updateMe));

// DELETE /me
router.delete("/me", auth, asyncHandler(ProfileController.deleteMe));
export default router;