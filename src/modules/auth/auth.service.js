import jwt from "jsonwebtoken";
import ApiError from "../../utils/apiError.js";
import bcrypt from "bcryptjs";
import User from "../user/user.model.js";
import crypto from "crypto";
import { forgotPasswordTemplate } from "../../utils/forgotPasswordTemjplate.js";
import sendMail from "../../utils/sendEmail.js";

// Generate Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.EXPIRES_IN },
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.EXPIRES_IN_REFRESH },
  );

  return { accessToken, refreshToken };
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Register
export const registerService = async (payload) => {
  const { name, email, password } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser && !existingUser.isDeleted) {
    throw new ApiError(400, "Email already exists");
  }
  if(existingUser && existingUser.isDeleted){
    existingUser.isDeleted = false;
    existingUser.password = await bcrypt.hash(password, 10);
    await existingUser.save()
    return existingUser
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });

  return user;
};

// Login
export const loginService = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select("+password");

  if(user && user.isDeleted){
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  // 🔐 Store HASHED refresh token
  user.refreshToken = hashToken(refreshToken);
  await user.save();

  return { user, accessToken, refreshToken };
};

// Logout
export const logoutService = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const refreshTokenService = async (oldToken) => {
  if (!oldToken) {
    throw new ApiError(401, "No refresh token");
  }

  let decoded;
  try {
    decoded = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // 🔥 Compare HASH
  const hashedToken = hashToken(oldToken);

  if (user.refreshToken !== hashedToken) {
    // 🚨 TOKEN REUSE DETECTED
    user.refreshToken = null;
    await user.save();

    throw new ApiError(403, "Token reuse detected. Please login again.");
  }

  // 🔁 Generate new tokens
  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = hashToken(refreshToken);
  await user.save();

  return { accessToken, refreshToken };
};

export const changePasswordService = async (userId, payload) => {
  const { oldPassword, newPassword } = payload;

  const user = await User.findById(userId).select("+password");

  if (!(await user.comparePassword(oldPassword))) {
    throw new ApiError(400, "Old password incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return true;
};

/**======================
 * send mail for password reset
 * ======================
 */

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "Email not exists");

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendMail({
    to: user.email,
    subject: "Password Reset Request",
    html: forgotPasswordTemplate(resetURL, user.name)
  })
}

/**======================
 * user reset password 
 * ======================
 */

export const resetPasswordService = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })
  if (!user) throw new ApiError(400, "Token is invalid or has expired");
  
  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
}