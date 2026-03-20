import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
      unique: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
      default: null,
    },

    image_public_id: {
      type: String,
      default: null,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    level: {
      type: Number,
      default: 1,
    },

    productCount: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
    metaTitle: String,
    metaDescription: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// schema index
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ name: "text", description: "text" });
categorySchema.index({ sortOrder: 1 });

// Instance Methods

// Check if Category is Root
categorySchema.methods.isRoot = function () {
  return this.parent === null;
};

// Static Methods

// Get Root Categories
categorySchema.statics.getRootCategories = function () {
  return this.find({
    parent: null,
    isActive: true,
    isDeleted: false,
  });
};

// Get Subcategories
categorySchema.statics.getSubCategories = function (parentId) {
  return this.find({
    parent: parentId,
    isActive: true,
  });
};

const Category = model("Category", categorySchema);

export default Category;
