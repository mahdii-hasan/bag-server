import cloudinary from "../../config/cloudinary.config.js";
import ApiError from "../../utils/apiError.js";

export const uploadToCloudinary = async (file, folder = "general") => {
  try {
    const base64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `bag/${folder}`,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new ApiError(400, "Cloudinary upload failed");
  }
};

export const deleteFromCloudinary = async (public_id) => {
  try {
    if (!public_id) return;

    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new ApiError(400, "Failed to delete image from Cloudinary");
  }
};