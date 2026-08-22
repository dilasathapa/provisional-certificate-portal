const multer = require("multer");
const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must not exceed 5MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message,
  });
};


module.exports = errorHandler;