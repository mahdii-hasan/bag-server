import ApiError from "../../utils/apiError.js";
import Category from "./category.model.js";

export const createCategoryServices = async (payload) => {
  try {
    const category = await Category.create(payload);
    return category;
  } catch (err) {
    throw new ApiError(400, "Data is not validate");
  }
};

export const getAllCategoriesServices = async () => {
  return Category.find({ isDeleted: false }).sort({ sortOrder: 1 });
};

export const getCategoryByIdServices = async (id) => {
  return Category.findById(id);
};

export const updateCategoryServices = async (id, payload) => {
  return Category.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

export const deleteCategoryServices = async (id) => {
  return Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};