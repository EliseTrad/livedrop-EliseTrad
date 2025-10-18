# Week 5 API

Backend API for the Week 5 e-commerce assignment with MongoDB, SSE, and LLM
Integration.

## Test User for Evaluation

You can use the following test user for login and evaluation:

**Email:** `demo@example.com` **Name:** Sarah Johnson **Orders:** 3 sample
orders (various statuses)

Use this email in the storefront login to test customer lookup, order history,
and assistant features.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your MongoDB connection string

# Start development server
npm run dev

# Run tests
npm test

# Seed database
npm run seed
```

## Environment Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=week5_ecommerce
PORT=5000
NODE_ENV=development
LLM_ENDPOINT=your_ngrok_url/generate
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Health Check

- `GET /health` - Server and database health status

### Customers

- `GET /api/customers?email=user@example.com` - Look up customer by email
- `GET /api/customers/:id` - Get customer profile by ID

### Products

- `GET /api/products?search=&tag=&sort=&page=&limit=` - List products with
  filtering
- `GET /api/products/:id` - Get product details with related items
- `POST /api/products` - Create new product

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders?customerId=:id` - Get customer orders
- `GET /api/orders/:id/stream` - SSE endpoint for live order tracking

### Analytics

- `GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD` - Daily
  revenue data

### Dashboard

- `GET /api/dashboard/business-metrics` - Business KPIs
- `GET /api/dashboard/performance` - System performance metrics
- `GET /api/dashboard/assistant-stats` - AI assistant analytics

## Test User

For testing, use:

- Email: `demo@example.com`
- This user will have sample orders and data after seeding

## Database Schema

### Customers Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  address: Object,
  createdAt: Date
}
```

### Products Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  tags: Array,
  imageUrl: String,
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection

```javascript
{
  _id: ObjectId,
  customerId: ObjectId,
  items: Array,
  total: Number,
  status: String, // PENDING, PROCESSING, SHIPPED, DELIVERED
  carrier: String,
  estimatedDelivery: Date,
  createdAt: Date,
  updatedAt: Date
}
```
