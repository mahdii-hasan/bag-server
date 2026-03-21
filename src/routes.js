import express, { Router } from 'express';
import authRouter from './modules/auth/auth.routes.js';
import { apiDocsController } from './modules/doc/doc.controller.js';
import userRouter from './modules/user/user.routes.js';
import categoryRouter from './modules/category/category.routes.js';
import productRouter from './modules/product/product.routes.js';

const router = Router();

router.use("/auth", authRouter)
router.use("/user", userRouter)
router.use("/categories", categoryRouter)
router.use("/products", productRouter)

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running!" });
});
router.get("/docs", apiDocsController);

export default router;