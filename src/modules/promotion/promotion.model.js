import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    subTitle: {
      type: String,
      trim: true,
    },

    description: String,

    isTemplate: {
      type: Boolean,
      default: false,
    },

    display: {
      type: {
        type: String,
        enum: ["hero", "slider", "sidebar", "popup"],
        default: "slider"
      },
      place: {
        type: String,
        enum: ["homepage_start","homepage_middle", "homepage_end", "sidebar_left"],
        default: "homepage_start"
      },
    },

    image: {
      url: String,
      public_id: String,
    },

    mobileImage: {
      url: String,
      public_id: String,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    actionUrl: String,

    buttonText: {
      type: String,
      trim: true,
    },

    priority: {
      type: Number,
      default: 0,
    },

    startDate: Date,
    endDate: Date,

    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;
