import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "./category.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";


const router = Router();

router.post("/",authMiddleware,roleMiddleware("admin"),upload.single("image"),createCategoryController,);
router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);
router.put("/:id",authMiddleware,roleMiddleware("admin"),upload.single("image"),updateCategoryController,);
router.delete("/:id",authMiddleware,roleMiddleware("admin"),deleteCategoryController,);

const categoryRouter = router;
export default categoryRouter;