import cloudinary from "../../config/cloudinary.config.js";
import { uploadToCloudinary } from "./fileUpload.service.js";


export const uploadMultipleFiles = async (files, folder) => {
  return Promise.all(
    files.map((file) => uploadToCloudinary(file, folder))
  );
};


export const deleteMultipleFromCloudinary = async (images = []) => {
  try {
    if (!images.length) return;

    // extract public_ids
    const publicIds = images.map((file) => file.public_id);

    // bulk delete
    const result = await cloudinary.api.delete_resources(publicIds);

    return result;
  } catch (error) {
    throw new Error("Failed to delete multiple files from Cloudinary");
  }
};