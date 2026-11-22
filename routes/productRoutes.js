const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getCategorySummary,
  adjustStock
} = require('../controllers/productController');
const { validateProduct, validateStockAdjustment } = require('../middleware/validate');

// Root routes: GET all (filter/sort/paginate) and POST create
router.route('/')
  .get(getProducts)
  .post(validateProduct, createProduct);

// Report routes placed before :id to prevent route conflicts
router.get('/low-stock', getLowStockProducts);
router.get('/summary', getCategorySummary);

// Stock adjustment route
router.patch('/:id/stock', validateStockAdjustment, adjustStock);

// Specific product ID routes
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
