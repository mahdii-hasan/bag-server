import mongoose from "mongoose";
import Product from "./product.model.js";
import ApiError from "../../utils/apiError.js";

// Create Product
export const createProductService = async (payload) => {
  return Product.create(payload);
};

// Get All Products (Advanced Query)
export const getProductsService = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    minPrice,
    maxPrice,
    sort = "-createdAt",
    featured,
    inStock
  } = query;

  const filter = {
    isDeleted: false,
    isPublished: true
  };

  //  Search
  if (search) {
    filter.$text = { $search: search };
  }

  // Category
  if (category && mongoose.Types.ObjectId.isValid(category)) {
    filter.category = category;
  }

  // Price filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Featured
  if (featured === "true") {
    filter.isFeatured = true;
  }

  // Stock filter
  if (inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),

    Product.countDocuments(filter)
  ]);

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    },
    data: products
  };
};

// Get Single Product
export const getSingleProductService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  const product = await Product.findOne({
    _id: id,
    isDeleted: false
  }).populate("category", "name slug");

  if (!product) {
    throw new ApiError(400, "Product not found");
  }

  return product;
};

// Update Product
export const updateProductService = async (id, payload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  const product = await Product.findByIdAndUpdate(id, payload, {
    new: true
  });

  if (!product) {
    throw new ApiError(400, "Product not found");
  }

  return product;
};

// Soft Delete Product
export const deleteProductService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  const product = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!product) {
    throw new ApiError(400, "Product not found or already deleted");
  }

  return product;
};