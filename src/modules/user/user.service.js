import ApiError from "../../utils/apiError.js";
import { deleteFromCloudinary } from "../fileUpload/fileUpload.service.js";
import User from "./user.model.js";

// GET MY PROFILE
export const getMeService = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
  }).select("-password");
  if (!user) throw new ApiError(400, "user not found");
  return user;
};

// UPDATE PROFILE
export const updateProfileService = async (userId, data) => {
  const allowedFields = ["name"]; // restrict update fields

  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field]) updateData[field] = data[field];
  });

  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");
};

// DELETE ACCOUNT (SOFT DELETE RECOMMENDED)
export const deleteMeService = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    isDeleted: true,
    refreshToken: null
  });
};

export const uploadAvatarService = async (userId, uploadedData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // 🧹 Delete old avatar if exists
  if (user.avatar_public_id) {
    await deleteFromCloudinary(user.avatar_public_id);
  }

  // 💾 Save new avatar
  user.avatar = uploadedData.url;
  user.avatar_public_id = uploadedData.public_id;

  await user.save();

  return user;
};

export const deleteAvatarService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // delete from cloudinary
  if (user.avatar_public_id) {
    await deleteFromCloudinary(user.avatar_public_id);
  }

  // remove from DB
  user.avatar = null;
  user.avatar_public_id = null;

  await user.save();

  return user;
};
