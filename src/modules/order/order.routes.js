import express, { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { cancelOrderController, createOrderController, getMyOrdersController, getSingleOrderController } from "./order.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createOrderController);

router.get("/", getMyOrdersController);

router.get("/:id", getSingleOrderController);

router.put("/:id/cancel", cancelOrderController);

const orderRouter = router;
export default orderRouter;