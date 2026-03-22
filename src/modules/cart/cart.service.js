import ApiError from "../../utils/apiError.js";
import Product from "../product/product.model.js";
import Cart from "./cart.model.js";

// Get Cart
export const getCartService = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

// Add to Cart
export const addToCartService = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new ApiError(400, "Product not found");
  }

  if (!product.isPublished) {
    throw new ApiError(400, "Product not available");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Not enough stock");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.discountPrice || product.price,
      name: product.title,
      image: product.thumbnail
    });
  }

  cart.calculateTotals();
  await cart.save();

  return cart;
};

// Update Cart Item
export const updateCartItemService = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new ApiError(400, "Cart not found");

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) throw new ApiError(400, "Item not found");

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );
  } else {
    item.quantity = quantity;
  }

  cart.calculateTotals();
  await cart.save();

  return cart;
};

// Remove Item
export const removeFromCartService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new ApiError(400,"Cart not found");

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.calculateTotals();
  await cart.save();

  return cart;
};

// Clear Cart
export const clearCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new ApiError(400, "Cart not found");

  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;

  await cart.save();

  return cart;
};