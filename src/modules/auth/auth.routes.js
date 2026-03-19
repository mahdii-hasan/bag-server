import express from "express";
import { registerController, loginController, logoutController, refreshTokenController, changePasswordController } from "./auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";


const router = express.Router();

// Public
router.post("/register", registerController);
router.post("/login", loginController);

router.post("/refresh-token", refreshTokenController);      //
// Protected
router.post("/logout", authMiddleware, logoutController);
router.post("/change-password", authMiddleware, changePasswordController);

const authRoutes = router;

export default authRoutes;