import sendResponse from "../../utils/response.js";
import {
  createOrderService,
  getMyOrdersService,
  getSingleOrderService,
  cancelOrderService
} from "./order.service.js";

// Create Order
export const createOrderController = async (req, res, next) => {
  try {
    const order = await createOrderService(
      req.user.id,
      req.body
    );

    sendResponse({res, message: "Order created successfully", data:order});
  } catch (err) {
    next(err);
  }
};

// Get My Orders
export const getMyOrdersController = async (req, res, next) => {
  try {
    const orders = await getMyOrdersService(req.user.id);

    sendResponse({res, message:"Orders fetched successfully", data:orders});
  } catch (err) {
    next(err);
  }
};

// Get Single Order
export const getSingleOrderController = async (req, res, next) => {
  try {
    const order = await getSingleOrderService(
      req.user.id,
      req.params.id
    );

    sendResponse({res, message:"Order fetched successfully", data:order});
  } catch (err) {
    next(err);
  }
};

// Cancel Order
export const cancelOrderController = async (req, res, next) => {
  try {
    const order = await cancelOrderService(
      req.user.id,
      req.params.id
    );

    sendResponse({res,message:"Order cancelled successfully", data:order});
  } catch (err) {
    next(err);
  }
};