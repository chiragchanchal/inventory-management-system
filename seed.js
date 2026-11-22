const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  // Furniture (2 items)
  {
    name: 'Study Table',
    sku: 'FURN-TB-812',
    category: 'Furniture',
    price: 3999,
    quantity: 2,
    reorderLevel: 4,
    supplier: 'IKEA India'
  },
  {
    name: 'Ergonomic Office Chair',
    sku: 'FURN-CH-104',
    category: 'Furniture',
    price: 6499,
    quantity: 14,
    reorderLevel: 5,
    supplier: 'Featherlite'
  },

  // Electronics (4 items)
  {
    name: 'Wireless Optical Mouse',
    sku: 'ELEC-MS-001',
    category: 'Electronics',
    price: 649,
    quantity: 4,
    reorderLevel: 10,
    supplier: 'Logitech India'
  },
  {
    name: 'Mechanical Gaming Keyboard',
    sku: 'ELEC-KB-205',
    category: 'Electronics',
    price: 2899,
    quantity: 32,
    reorderLevel: 8,
    supplier: 'Redragon'
  },
  {
    name: '24-Inch IPS Monitor',
    sku: 'ELEC-MN-440',
    category: 'Electronics',
    price: 10999,
    quantity: 18,
    reorderLevel: 5,
    supplier: 'LG Electronics'
  },
  {
    name: 'Noise Cancelling Headphones',
    sku: 'ELEC-HP-700',
    category: 'Electronics',
    price: 7999,
    quantity: 42,
    reorderLevel: 10,
    supplier: 'Sony India'
  },

  // Apparel (2 items)
  {
    name: 'Classic Cotton T-Shirt',
    sku: 'APPR-TS-012',
    category: 'Apparel',
    price: 799,
    quantity: 50,
    reorderLevel: 15,
    supplier: 'Raymond Apparels'
  },
  {
    name: 'Slim Fit Denim Jeans',
    sku: 'APPR-JN-088',
    category: 'Apparel',
    price: 1999,
    quantity: 28,
    reorderLevel: 10,
    supplier: 'Levi Strauss'
  },

  // Stationery (2 items)
  {
    name: 'Gel Pen Pack of 10',
    sku: 'STNY-PN-301',
    category: 'Stationery',
    price: 120,
    quantity: 80,
    reorderLevel: 25,
    supplier: 'Cello Pens'
  },
  {
    name: 'Hardcover Spiral Notebook',
    sku: 'STNY-NB-502',
    category: 'Stationery',
    price: 160,
    quantity: 3,
    reorderLevel: 15,
    supplier: 'Classmate'
  },

  // Groceries (2 items)
  {
    name: 'Organic Green Tea 100g',
    sku: 'GROC-TEA-091',
    category: 'Groceries',
    price: 249,
    quantity: 5,
    reorderLevel: 12,
    supplier: 'Organic India'
  },
  {
    name: 'Extra Virgin Olive Oil 1L',
    sku: 'GROC-OIL-330',
    category: 'Groceries',
    price: 899,
    quantity: 22,
    reorderLevel: 8,
    supplier: 'Borges Foods'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${inserted.length} products across 5 categories.`);

    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
