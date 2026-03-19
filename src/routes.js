import e from 'express';
import express, { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';

const router = Router();

router.use("/auth", authRoutes)

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running!" });
});

export default router;