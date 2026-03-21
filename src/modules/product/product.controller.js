import sendResponse from "../../utils/sendResponse.js";
import {
  deleteMultipleFromCloudinary,
  uploadMultipleFiles,
} from "../fileUpload/uploadMultipleFiles.js";
import Product from "./product.model.js";
import {
  createProductService,
  getProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
} from "./product.service.js";

// Create Product
export const createProductController = async (req, res, next) => {
  try {
    let uploadedImages;

    if (req.files && req.files.length > 0) {
      uploadedImages = await uploadMultipleFiles(req.files, "products");
    }

    const payload = {
      ...req.body,
      images: uploadedImages,
      thumbnail: uploadedImages[0]?.url || null,
    };

    // Discount validation
    if (payload.discountPrice && payload.discountPrice >= payload.price) {
      next("Discount price must be less than price");
    }

    const product = await createProductService(payload);

    sendResponse({
      res,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// Get Products
export const getProductsController = async (req, res, next) => {
  try {
    const result = await getProductsService(req.query);

    sendResponse({
      res,
      message: "Products retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get Single Product
export const getSingleProductController = async (req, res, next) => {
  try {
    const product = await getSingleProductService(req.params.id);

    sendResponse({
      res,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// Update Product
export const updateProductController = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    let uploadedImages = [];
    let payload;

    if (req.files && req.files.length > 0) {
      if (product && product.images) {
        await deleteMultipleFromCloudinary(product.images);
      }

      uploadedImages = await uploadMultipleFiles(req.files, "products");
    }
    if (uploadedImages.length > 0) {
      payload = {
        ...req.body,
        images: uploadedImages,
        thumbnail: uploadedImages[0]?.url || null,
      };
    } else {
      payload = {
        ...req.body,
      };
    }

    const data = await updateProductService(req.params.id, payload);

    sendResponse({ res, message: "Product updated successfully", data });
  } catch (err) {
    next(err);
  }
};

// Delete Product
export const deleteProductController = async (req, res, next) => {
  try {
    const product = await deleteProductService(req.params.id);

    sendResponse({
      res,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};
