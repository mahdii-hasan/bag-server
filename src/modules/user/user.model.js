import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },

    avatar_public_id: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
      index: true
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isDeleted:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

// Compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}


export default mongoose.model("User", userSchema);
