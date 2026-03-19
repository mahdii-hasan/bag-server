import ApiError from "../utils/apiError.js";

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    //Check if user exists
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized: User not authenticated"));
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Allowed roles: ${allowedRoles.join(", ")}`
        )
      );
    }

    //  User is authorized
    next();
  };
};

export default roleMiddleware;