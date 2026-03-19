import ApiError from "../utils/apiError.js";

const handleCastError = (err) => {
  return new ApiError(400, `Invalid ${err.path}: ${err.value}`);
};

const handleDuplicateError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new ApiError(400, `${field} already exists`);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((val) => val.message);
  return new ApiError(400, "Validation Error", messages);
};

const handleJWTError = () => {
  return new ApiError(401, "Invalid token");
};

const handleJWTExpiredError = () => {
  return new ApiError(401, "Token expired");
};

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Trusted error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Unknown error (hide details)
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert known errors
  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(error, res);
  } else {
    return sendErrorProd(error, res);
  }
};

export default errorHandler;