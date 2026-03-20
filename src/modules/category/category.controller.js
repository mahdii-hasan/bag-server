import sendResponse from "../../utils/sendResponse.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../fileUpload/fileUpload.service.js";
import {
  createCategoryServices,
  deleteCategoryServices,
  getAllCategoriesServices,
  getCategoryByIdServices,
  updateCategoryServices,
} from "./category.services.js";
import Category from "./category.model.js";

export const createCategoryController = async (req, res, next) => {
  try {
    let uploadedData = null;

    if (req.file) {
      uploadedData = await uploadToCloudinary(req.file, "categories");
    }

    const category = await createCategoryServices({
      ...req.body,
      image: uploadedData.url,
      image_public_id: uploadedData.public_id,
    });

    sendResponse({
      res,
      message: "category added successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategoriesController = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesServices();

    sendResponse({ res, message: "fetch all categories", data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryByIdController = async (req, res, next) => {
  try {
    const category = await getCategoryByIdServices(req.params.id);

    sendResponse({ res, message: "category found", data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    let uploadedData = null;

    if (req.file) {
      const category = await Category.findById(req.params.id);
      if (category && category.image_public_id) {
        await deleteFromCloudinary(category.image_public_id);
      }
      uploadedData =  await uploadToCloudinary(req.file, "categories");
    }

    const payload = {
      ...req.body,
    };

    if (uploadedData) {
      payload.image = uploadedData.url;
      payload.image_public_id = uploadedData.public_id;
    }

    const category = await updateCategoryServices(req.params.id, payload);

    sendResponse({
      res,
      message: "Category update successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (req, res, next) => {
  try {
    const category = await deleteCategoryServices(req.params.id);

    sendResponse({ res, message: "category deleted", data: category });
  } catch (error) {
    next(error);
  }
};
