// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose duplicate key error (e.g. duplicate SKU)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value: product with this ${field} already exists`;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((item) => item.message);
    return res.status(statusCode).json({
      message: 'Validation failed',
      errors
    });
  }

  // Handle invalid MongoDB ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Product not found (invalid ID format)';
  }

  res.status(statusCode).json({
    message: message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
