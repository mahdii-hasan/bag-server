import sendResponse from "../../utils/sendResponse.js";
import { uploadToCloudinary } from "../fileUpload/fileUpload.service.js";
import {
  getMeService,
  updateProfileService,
  deleteMeService,
  uploadAvatarService,
  deleteAvatarService,
} from "./user.service.js";

// GET MY PROFILE
export const getMeController = async (req, res, next) => {
  try {
    const user = await getMeService(req.user.id);

    sendResponse({ res, data: user });
  } catch (err) {
    next("user not found");
  }
};

//  UPDATE PROFILE
export const updateProfileController = async (req, res, next) => {
  try {
    const user = await updateProfileService(req.user.id, req.body);

    sendResponse({ res, message: "profile update successfully", data: user });
  } catch (err) {
    next("Profile update failed");
  }
};

// DELETE ACCOUNT
export const deleteMeController = async (req, res, next) => {
  try {
    await deleteMeService(req.user.id);
    sendResponse({ res, message: "Account deleted" });
  } catch (err) {
    next("Failed to delete account");
  }
};

//  AVATAR UPLOAD
export const uploadAvatarController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      next("No file uploaded");
    }

    const uploadedData = await uploadToCloudinary(req.file, "users");

    const user = await uploadAvatarService(userId, uploadedData);

    sendResponse({
      res,
      data: user,
      message: "Avatar updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAvatarController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await deleteAvatarService(userId);

    sendResponse({
      res,
      data: user,
      message: "Avatar deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
