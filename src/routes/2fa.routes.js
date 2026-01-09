import { Router } from 'express';
import * as twoFactorController from '../controllers/twoFactor.controller.js';
import { auth } from '../middlewares/auth.middleware.js'; 
const router = Router();


router.post('/setup',auth, twoFactorController.setup2FA);
router.post('/disable',auth, twoFactorController.disable2FA);
router.post('/verifyAndEnable',auth,  twoFactorController.verifyAndEnable2FA);

export default router;