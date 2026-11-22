// Middleware to validate request body for creating a product
const validateProduct = (req, res, next) => {
  const { name, sku, category, price, supplier } = req.body;

  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Product name is required');
  }

  if (!sku || typeof sku !== 'string' || !sku.trim()) {
    errors.push('SKU is required');
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    errors.push('Category is required');
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    errors.push('Price must be a positive number');
  }

  if (req.body.quantity !== undefined && (typeof req.body.quantity !== 'number' || req.body.quantity < 0)) {
    errors.push('Quantity must be a non-negative number');
  }

  if (req.body.reorderLevel !== undefined && (typeof req.body.reorderLevel !== 'number' || req.body.reorderLevel < 0)) {
    errors.push('Reorder level must be a non-negative number');
  }

  if (!supplier || typeof supplier !== 'string' || !supplier.trim()) {
    errors.push('Supplier is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Middleware to validate stock adjustment payload
const validateStockAdjustment = (req, res, next) => {
  const { change } = req.body;

  if (change === undefined || typeof change !== 'number' || isNaN(change)) {
    return res.status(400).json({
      message: 'A valid numeric "change" value is required'
    });
  }

  next();
};

module.exports = {
  validateProduct,
  validateStockAdjustment
};
