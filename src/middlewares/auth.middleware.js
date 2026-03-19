import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import User from "../modules/user/user.model.js";

/**
 * Verify JWT Token
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2️⃣ No token
    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    // 3️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new ApiError(401, "Token expired");
      } else if (err.name === "JsonWebTokenError") {
        throw new ApiError(401, "Invalid token");
      } else {
        throw new ApiError(401, "Unauthorized");
      }
    }

    // 4️⃣ Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    // 5️⃣ Attach user to request
    req.user = user;

    next();
  } catch (err) {
    next(err); // Pass to global error handler
  }
};

export default authMiddleware;

