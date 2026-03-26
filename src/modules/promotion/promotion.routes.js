import express, { Router } from "express";
import {
  getPromotionsController,
  createPromotionController,
  updatePromotionController,
  deletePromotionController,
} from "./promotion.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = Router();

// Public
router.get("/", getPromotionsController);

// Admin (you can add auth middleware here)
router.post("/",authMiddleware, roleMiddleware("admin"),upload.array("image", 2), createPromotionController);
router.put("/:id",authMiddleware, roleMiddleware("admin"),upload.array("image", 2), updatePromotionController);
router.delete("/:id",authMiddleware, roleMiddleware("admin"),deletePromotionController);

const promotionRouter =  router;
export default promotionRouter;