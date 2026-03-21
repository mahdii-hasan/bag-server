import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { createProductController, deleteProductController, getProductsController, getSingleProductController, updateProductController } from "./product.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = Router();

router.post("/",authMiddleware, roleMiddleware("admin", "seller"), upload.array("images", 5), createProductController);
router.get("/", getProductsController);
router.get("/:id", getSingleProductController);
router.put("/:id", authMiddleware, roleMiddleware("admin", "seller"), upload.array("images", 5), updateProductController);
router.delete("/:id", authMiddleware, roleMiddleware("admin", "seller"), deleteProductController);

const productRouter = router;

export default productRouter;