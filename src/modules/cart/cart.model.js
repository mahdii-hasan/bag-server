import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number, // snapshot price
      required: true
    },

    name: String,
    image: String
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    items: [cartItemSchema],

    totalItems: {
      type: Number,
      default: 0
    },

    totalPrice: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// 🔁 Recalculate totals
cartSchema.methods.calculateTotals = function () {
  let totalItems = 0;
  let totalPrice = 0;

  this.items.forEach((item) => {
    totalItems += item.quantity;
    totalPrice += item.quantity * item.price;
  });

  this.totalItems = totalItems;
  this.totalPrice = totalPrice;
};

const Cart = model("Cart", cartSchema);

export default Cart;