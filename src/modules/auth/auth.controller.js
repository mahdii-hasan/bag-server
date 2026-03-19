import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../../utils/cookieOptions.js";
import sendResponse from "../../utils/sendResponse.js";
import {
  registerService,
  loginService,
  logoutService,
  refreshTokenService,
} from "./auth.service.js";

// Register
export const registerController = async (req, res, next) => {
  try {
    const user = await registerService(req.body);

    sendResponse({
      res,
      statusCode: 201,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

//  Login
export const loginController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginService(req.body);
    const isProduction = process.env.NODE_ENV === "production";
    //  Set cookies (secure)
    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    sendResponse({
      res,
      message: "Login successful",
      data: { user, accessToken },
    });
  } catch (err) {
    next(err);
  }
};

// Logout
export const logoutController = async (req, res, next) => {
  try {
    await logoutService(req.user._id);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    sendResponse({
      res,
      message: "Logout successful",
    });
  } catch (err) {
    next(err);
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const isProduction = process.env.NODE_ENV === "production";
    const { accessToken, refreshToken } =
      await refreshTokenService(oldRefreshToken);

    // 🍪 Set new cookies (ROTATION)
    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    sendResponse({
      res,
      message: "Token refreshed",
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const changePasswordController = async (req, res, next) => {
  try {
    await changePasswordService(req.user._id, req.body);

    sendResponse({
      res,
      message: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
};
