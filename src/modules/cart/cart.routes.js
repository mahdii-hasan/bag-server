import express, { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { addToCartController, clearCartController, getCartController, removeFromCartController, updateCartItemController } from "./cart.controller.js";

const router = Router();

router.use(authMiddleware); 

router.get("/", getCartController);

router.post("/", addToCartController);

router.put("/:productId", updateCartItemController);

router.delete("/:productId", removeFromCartController);

router.delete("/", clearCartController);

const cartRouter =  router;
export default cartRouter;