const sendResponse = ({
  res,
  statusCode = 200,
  success = true,
  message = "Success",
  data = null,
}) => {
  return res.status(statusCode).json({
    success,
    statusCode,
    message,
    ...(data !== null && { data }),
  });
};

export default sendResponse;