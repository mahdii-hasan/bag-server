import mongoose from "mongoose";

const { Schema, model } = mongoose;

const imageSchema = new Schema(
  {
    url: String,
    public_id: String
  },
  { _id: false } 
);

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
      index: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },

    description: {
      type: String,
      required: true
    },

    brand: {
      type: String,
      index: true
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discountPrice: {
      type: Number,
      min: 0
    },

    costPrice: {
      type: Number
    },

    currency: {
      type: String,
      default: "USD"
    },

    stock: {
      type: Number,
      default: 0,
      index: true
    },

    sold: {
      type: Number,
      default: 0
    },

    sku: {
      type: String,
      unique: true
    },

    images: [imageSchema],

    thumbnail: {
      type: String
    },

    variants: [
      {
        name: String,
        options: [String]
      }
    ],

    attributes: [
      {
        name: String,
        value: String
      }
    ],

    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    ratingCount: {
      type: Number,
      default: 0
    },

    tags: [String],

    isFeatured: {
      type: Boolean,
      default: false
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    metaTitle: String,
    metaDescription: String,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

// schema index
productSchema.index({ title: "text", description: "text" });
productSchema.index({ price: 1 });
productSchema.index({ ratingAverage: -1 });
productSchema.index({ createdAt: -1 });


// Instance Methods (Document Level)

// Check Discount
productSchema.methods.getDiscountPercentage = function () {
  if (!this.discountPrice) return 0;

  const discount =
    ((this.price - this.discountPrice) / this.price) * 100;

  return Math.round(discount);
};
// Check Stock
productSchema.methods.isInStock = function () {
  return this.stock > 0;
};


// Static Methods (Model Level)

// Get Featured Products
productSchema.statics.getFeatured = function () {
  return this.find({
    isFeatured: true,
    isPublished: true,
    isDeleted: false
  });
};

// Search Products
productSchema.statics.searchProducts = function (query) {
  return this.find({
    $text: { $search: query },
    isPublished: true,
    isDeleted: false
  });
};

// Get Available Products
productSchema.statics.getAvailable = function () {
  return this.find({
    stock: { $gt: 0 },
    isPublished: true
  });
};


const Product = model("Product", productSchema);

export default Product;