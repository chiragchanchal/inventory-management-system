const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, supplier, search, minPrice, maxPrice, sortBy, order, sort } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (supplier) {
      filter.supplier = supplier;
    }

    // Keyword search on name
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Price range filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortOptions = {};
    if (sortBy) {
      const sortDirection = order === 'asc' ? 1 : -1;
      sortOptions[sortBy] = sortDirection;
    } else if (sort) {
      // Support string sorting e.g. "price" or "-price"
      const isDesc = sort.startsWith('-');
      const field = isDesc ? sort.substring(1) : sort;
      sortOptions[field] = isDesc ? -1 : 1;
    } else {
      // Default sort by newest
      sortOptions = { createdAt: -1 };
    }

    // Pagination setup
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product deleted',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock items (quantity <= reorderLevel)
// @route   GET /api/products/low-stock
const getLowStockProducts = async (req, res, next) => {
  try {
    const lowStockItems = await Product.find({
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    });

    res.status(200).json({
      count: lowStockItems.length,
      lowStockItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Category-wise inventory summary using MongoDB Aggregation
// @route   GET /api/products/summary
const getCategorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $sort: { totalStockValue: -1 }
      }
    ]);

    res.status(200).json({
      categories: summary.length,
      summary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust product stock level (increment / decrement safely)
// @route   PATCH /api/products/:id/stock
const adjustStock = async (req, res, next) => {
  try {
    const { change } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Safety check to ensure stock never drops below 0
    if (product.quantity + change < 0) {
      return res.status(400).json({
        message: `Insufficient stock: current stock is ${product.quantity}, cannot reduce by ${Math.abs(change)}`
      });
    }

    product.quantity += change;
    await product.save();

    res.status(200).json({
      message: 'Stock updated',
      product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getCategorySummary,
  adjustStock
};
