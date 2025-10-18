// MongoDB connection and models for customers, products, orders
const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || 'week5_ecommerce',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
};

const customerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  tags: [String],
  imageUrl: String,
  stock: Number,
});

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  status: String,
  carrier: String,
  estimatedDelivery: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model('Customer', customerSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
  connectDB,
  Customer,
  Product,
  Order,
};
