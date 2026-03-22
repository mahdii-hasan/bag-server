import sendResponse from "../../utils/sendResponse.js";
import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeFromCartService,
  clearCartService
} from "./cart.service.js";

// Get Cart
export const getCartController = async (req, res, next) => {
  try {
    const cart = await getCartService(req.user.id);

    sendResponse({res, message:"Cart retrieved successfully", data:cart});
  } catch (err) {
    next(err);
  }
};

// Add to Cart
export const addToCartController = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await addToCartService(
      req.user.id,
      productId,
      quantity
    );

    sendResponse({res,message: "Product added to cart successfully", data:cart});
  } catch (err) {
    next(err);
  }
};

// Update Item
export const updateCartItemController = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cart = await updateCartItemService(
      req.user.id,
      req.params.productId,
      quantity
    );

    sendResponse({res,message: "Cart item updated successfully", data:cart});
  } catch (err) {
    next(err);
  }
};

// Remove Item
export const removeFromCartController = async (req, res, next) => {
  try {
    const cart = await removeFromCartService(
      req.user.id,
      req.params.productId
    );

    sendResponse({res, message: "Cart item removed successfully", data:cart});
  } catch (err) {
    next(err);
  }
};

// Clear Cart
export const clearCartController = async (req, res, next) => {
  try {
    const cart = await clearCartService(req.user.id);

    sendResponse({res, message:"Cart cleared successfully", data:cart});
  } catch (err) {
    next(err);
  }
};