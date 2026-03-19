import e from 'express';
import express, { Router } from 'express';

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running!" });
});

export default router;