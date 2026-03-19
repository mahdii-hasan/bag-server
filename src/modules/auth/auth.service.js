import jwt from "jsonwebtoken";
import ApiError from "../../utils/apiError.js";
import bcrypt from "bcryptjs";
import User from "../user/user.model.js";
import crypto from "crypto";

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
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });

  return user;
};

// Login
export const loginService = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select("+password");

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
