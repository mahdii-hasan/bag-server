// import { applyCouponService, validateCouponService } from "../coupon/coupon.service.js";
import ApiError from "../../utils/apiError.js";
import Cart from "../cart/cart.model.js";
import Product from "../product/product.model.js";
import Order from "./order.model.js";


//  Create Order (Checkout)
export const createOrderService = async (userId, payload) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  let orderItems = [];
  let totalPrice = 0;

  // Validate stock + snapshot
  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product || product.isDeleted) {
      throw new ApiError(400, `Product not found`);
    }

    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.title}`);
    }

    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.title,
      image: product.thumbnail,
      price: item.price,
      quantity: item.quantity
    });

    // reduce stock
    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

//   // 🎟️ APPLY COUPON (if exists)
//   let discount = 0;
//   let couponData = null;

//   if (payload.couponCode) {
//     const { coupon, discount: calculatedDiscount } =
//       await validateCouponService(
//         payload.couponCode,
//         userId,
//         { totalPrice }
//       );

//     discount = calculatedDiscount;
//     totalPrice -= discount;

//     couponData = {
//       code: coupon.code,
//       discount
//     };

    // 🔥 update usage
//     await applyCouponService(coupon._id, userId);
//   }

  // 🧾 Create Order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalItems: cart.totalItems,
    totalPrice,
    shippingAddress: payload.shippingAddress,
    paymentMethod: payload.paymentMethod || "COD",
    // coupon: couponData
  });

  // 🧹 Clear cart
  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  await cart.save();

  return order;
};

//  Get My Orders
export const getMyOrdersService = async (userId) => {
  return Order.find({ user: userId, isDeleted: false })
    .sort("-createdAt");
};

//  Get Single Order
export const getSingleOrderService = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId
  });

  if (!order) {
    throw new ApiError(400,"Order not found");
  }

  return order;
};

//  Cancel Order
export const cancelOrderService = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId
  });

  if (!order) throw new ApiError(400,"Order not found");

  if (order.orderStatus !== "pending") {
    throw new ApiError(400, "Order cannot be cancelled");
  }

  order.orderStatus = "cancelled";

  await order.save();

  return order;
};