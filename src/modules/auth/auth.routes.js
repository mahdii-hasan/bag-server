import express from "express";
import { registerController, loginController, logoutController, refreshTokenController, changePasswordController, forgotPasswordController, resetPasswordController } from "./auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";


const router = express.Router();

// Public
router.post("/register", registerController);
router.post("/login", loginController);

router.post("/forgot-password", forgotPasswordController)
router.put("/reset-password/:token", resetPasswordController)

router.post("/refresh-token", refreshTokenController);      //
// Protected
router.post("/logout", authMiddleware, logoutController);
router.post("/change-password", authMiddleware, changePasswordController);

const authRouter = router;

export default authRouter;