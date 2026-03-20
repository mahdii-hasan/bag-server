import express, { Router } from "express";
import {
  getMeController,
  updateProfileController,
  deleteMeController,
  uploadAvatarController,
  deleteAvatarController,
} from "./user.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = Router();

// PRIVATE (LOGGED-IN USER)
router.get("/me", authMiddleware, getMeController);
router.put("/me", authMiddleware, updateProfileController);
router.delete("/me", authMiddleware, deleteMeController);

router.put(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatarController,
);
router.delete("/avatar", authMiddleware, deleteAvatarController);

const userRouter = router;
export default userRouter;
