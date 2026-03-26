import sendResponse from "../../utils/sendResponse.js";
import { deleteFromCloudinary } from "../fileUpload/fileUpload.service.js";
import { uploadMultipleFiles } from "../fileUpload/uploadMultipleFiles.js";
import Promotion from "./promotion.model.js";
import {
  getPromotionsService,
  createPromotionService,
  updatePromotionService,
  deletePromotionService,
} from "./promotion.service.js";

// GET promotions
export const getPromotionsController = async (req, res, next) => {
  try {
    const result = await getPromotionsService(req.query);

    sendResponse({
      res,
      message: "Promotion fetch successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE
export const createPromotionController = async (req, res, next) => {
  try {
    
    let uploadedImages;

    if (req.files && req.files.length > 0) {
      uploadedImages = await uploadMultipleFiles(req.files, "promotions");
    }
    const payload = {
      ...req.body,
      image: uploadedImages[0],
      mobileImage: uploadedImages[1] || null,
    };
    const promotion = await createPromotionService(payload);

    sendResponse({
      res,
      message: "promotion create successfully",
      data: promotion,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updatePromotionController = async (req, res, next) => {
  try {
    const promotion = await Promotion.findOne({ _id: req.params.id });
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      if (promotion && promotion.image) {
        await deleteFromCloudinary(promotion.image.public_id);
      }
      if (promotion && promotion.mobileImage) {
        await deleteFromCloudinary(promotion.mobileImage.public_id);
      }
      uploadedImages = await uploadMultipleFiles(req.files, "promotions");
    }
    const payload = {
      ...req.body,
      image: uploadedImages[0],
      mobileImage: uploadedImages[1] || null,
    };
    const updated = await updatePromotionService(req.params.id, payload);

    sendResponse({
      res,
      message: "promotion update successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deletePromotionController = async (req, res, next) => {
  try {
    const promotion = await Promotion.findOne({ _id: req.params.id });
    if (promotion && promotion.image) {
      await deleteFromCloudinary(promotion.image.public_id);
    }
    if (promotion && promotion.mobileImage) {
      await deleteFromCloudinary(promotion.mobileImage.public_id);
    }
    await deletePromotionService(req.params.id);

    sendResponse({ res, message: "promotion deleted" });
  } catch (error) {
    next(error);
  }
};
