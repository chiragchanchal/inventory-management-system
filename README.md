# Assignment 3: Inventory and Data Management System

**Course:** Web Dev III  
**Unit:** Unit 3  
**Tech Stack:** Node.js, Express.js, MongoDB, Mongoose, dotenv  

---

## Project Overview
A RESTful backend service for managing warehouse/store inventory catalogues. Supports CRUD operations, query-string based filtering, sorting, pagination, safe stock adjustments, and analytical inventory reports using MongoDB Aggregation pipelines.

---

## Project Structure
```
inventory-management-system/
├── config/
│   └── db.js                 # MongoDB connection using Mongoose
├── controllers/
│   └── productController.js  # CRUD and reporting controller logic
├── middleware/
│   ├── errorHandler.js       # Centralized error handling
│   └── validate.js           # Input validation middleware
├── models/
│   └── Product.js            # Mongoose schema, validation & virtuals
├── routes/
│   └── productRoutes.js      # Express API route declarations
├── .env                      # Environment variables
├── .env.example              # Sample environment template
├── package.json              # Project scripts and dependencies
├── seed.js                   # Database seed script with sample data
└── server.js                 # Express application entry point
```

---

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Verify `.env` has the correct port and MongoDB connection URI:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/inventory_db
   ```

3. **Seed sample data (optional but recommended):**
   ```bash
   npm run seed
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   Or for auto-reloading during development:
   ```bash
   npm run dev
   ```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/products` | Create a new product |
| `GET` | `/api/products` | Get all products (with pagination, filtering, sorting) |
| `GET` | `/api/products/low-stock` | Get low stock items (`quantity <= reorderLevel`) |
| `GET` | `/api/products/summary` | Category-wise inventory aggregation summary |
| `GET` | `/api/products/:id` | Get single product by MongoDB ID |
| `PUT` | `/api/products/:id` | Update product details |
| `PATCH` | `/api/products/:id/stock` | Adjust stock level safely (`change: +n` or `-n`) |
| `DELETE` | `/api/products/:id` | Delete a product |

---

## Query Parameters for `GET /api/products`

- `page` (default: `1`) - Page number
- `limit` (default: `10`) - Number of products per page
- `category` - Filter by exact category (e.g., `Electronics`)
- `supplier` - Filter by supplier name
- `search` - Case-insensitive keyword search matching product name
- `minPrice` / `maxPrice` - Filter within price ranges
- `sortBy` & `order` - Sort by any field (e.g., `sortBy=price&order=asc`)
- `sort` - Standard sorting syntax (e.g., `sort=price` or `sort=-price`)

---

## Sample Request Payloads

### 1. Create Product (`POST /api/products`)
```json
{
  "name": "Gel Pen Pack of 15",
  "sku": "STNY-PN-713",
  "category": "Stationery",
  "price": 120,
  "quantity": 40,
  "reorderLevel": 20,
  "supplier": "Cello Pens"
}
```

### 2. Update Product (`PUT /api/products/:id`)
```json
{
  "name": "Gel Pen Pack of 15",
  "sku": "STNY-PN-713",
  "category": "Stationery",
  "price": 140,
  "quantity": 60
}
```

### 3. Adjust Stock (`PATCH /api/products/:id/stock`)
```json
{
  "change": 10
}
```
*(Prevents quantity from dropping below zero; returns 400 Bad Request if stock is insufficient).*
