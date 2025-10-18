require('dotenv').config();
// Seed script to populate the database with realistic test data
const { connectDB, Customer, Product, Order } = require('./src/db');

// Realistic sample data
const sampleCustomers = [
  {
    name: 'Sarah Johnson',
    email: 'demo@example.com', // Test user for evaluation
    phone: '+1-555-0123',
    address: '123 Main St, New York, NY 10001, USA',
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1-555-0456',
    address: '456 Oak Avenue, Los Angeles, CA 90210, USA',
  },
  {
    name: 'Emma Williams',
    email: 'emma.williams@email.com',
    phone: '+1-555-0789',
    address: '789 Pine Road, Chicago, IL 60601, USA',
  },
  {
    name: 'David Rodriguez',
    email: 'david.rodriguez@email.com',
    phone: '+1-555-0321',
    address: '321 Elm Street, Houston, TX 77001, USA',
  },
  {
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '+1-555-0654',
    address: '654 Maple Drive, Phoenix, AZ 85001, USA',
  },
  {
    name: 'Ava Patel',
    email: 'ava.patel@email.com',
    phone: '+1-555-0987',
    address: '987 Cedar Lane, Miami, FL 33101, USA',
  },
  {
    name: 'Noah Kim',
    email: 'noah.kim@email.com',
    phone: '+1-555-0234',
    address: '234 Spruce St, Seattle, WA 98101, USA',
  },
  {
    name: 'Olivia Garcia',
    email: 'olivia.garcia@email.com',
    phone: '+1-555-0567',
    address: '567 Willow Ave, Austin, TX 73301, USA',
  },
  {
    name: 'William Brown',
    email: 'william.brown@email.com',
    phone: '+1-555-0890',
    address: '890 Aspen Blvd, Denver, CO 80201, USA',
  },
  {
    name: 'Sophia Lee',
    email: 'sophia.lee@email.com',
    phone: '+1-555-0112',
    address: '112 Birch Rd, Boston, MA 02101, USA',
  },
  {
    name: 'James Smith',
    email: 'james.smith@email.com',
    phone: '+1-555-0345',
    address: '345 Poplar St, San Francisco, CA 94101, USA',
  },
  {
    name: 'Mia Martinez',
    email: 'mia.martinez@email.com',
    phone: '+1-555-0678',
    address: '678 Redwood Dr, Portland, OR 97201, USA',
  },
  {
    name: 'Benjamin Clark',
    email: 'benjamin.clark@email.com',
    phone: '+1-555-0109',
    address: '109 Cypress Ln, Dallas, TX 75201, USA',
  },
];

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description:
      'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 299.99,
    category: 'Electronics',
    tags: ['audio', 'wireless', 'bluetooth', 'headphones'],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    stock: 45,
  },
  {
    name: 'Ergonomic Office Chair',
    description:
      'Comfortable mesh office chair with lumbar support and adjustable height',
    price: 399.99,
    category: 'Furniture',
    tags: ['office', 'chair', 'ergonomic', 'furniture'],
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    stock: 23,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description:
      'Insulated 32oz water bottle that keeps drinks cold for 24 hours',
    price: 34.99,
    category: 'Lifestyle',
    tags: ['water bottle', 'insulated', 'steel', 'eco-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504',
    stock: 87,
  },
  {
    name: 'Laptop Stand with Cooling',
    description: 'Adjustable aluminum laptop stand with built-in cooling fans',
    price: 89.99,
    category: 'Electronics',
    tags: ['laptop', 'stand', 'cooling', 'aluminum'],
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    stock: 34,
  },
  {
    name: 'Organic Cotton Bedsheet Set',
    description:
      'Luxurious 400-thread count organic cotton bedsheet set, queen size',
    price: 129.99,
    category: 'Home',
    tags: ['bedding', 'cotton', 'organic', 'sheets'],
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
    stock: 56,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitor and GPS',
    price: 249.99,
    category: 'Electronics',
    tags: ['fitness', 'watch', 'smart', 'health'],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    stock: 29,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 12-hour battery life',
    price: 59.99,
    category: 'Electronics',
    tags: ['audio', 'bluetooth', 'speaker', 'portable'],
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    stock: 40,
  },
  {
    name: 'Standing Desk Converter',
    description: 'Adjustable standing desk converter for ergonomic workspace',
    price: 179.99,
    category: 'Furniture',
    tags: ['desk', 'standing', 'ergonomic', 'office'],
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    stock: 18,
  },
  {
    name: 'Aromatherapy Essential Oil Diffuser',
    description: 'Ultrasonic diffuser with 7 LED colors and auto shut-off',
    price: 39.99,
    category: 'Lifestyle',
    tags: ['aromatherapy', 'diffuser', 'wellness', 'essential oil'],
    imageUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92',
    stock: 60,
  },
  {
    name: 'Memory Foam Pillow',
    description: 'Contoured memory foam pillow for neck and back support',
    price: 49.99,
    category: 'Home',
    tags: ['pillow', 'memory foam', 'sleep', 'comfort'],
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    stock: 70,
  },
  {
    name: 'LED Desk Lamp',
    description: 'Dimmable LED desk lamp with USB charging port',
    price: 32.99,
    category: 'Electronics',
    tags: ['lamp', 'LED', 'desk', 'lighting'],
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    stock: 50,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip eco-friendly yoga mat, 6mm thick',
    price: 27.99,
    category: 'Lifestyle',
    tags: ['yoga', 'mat', 'fitness', 'exercise'],
    imageUrl: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
    stock: 100,
  },
  {
    name: 'Cast Iron Skillet',
    description: 'Pre-seasoned cast iron skillet, 12-inch',
    price: 44.99,
    category: 'Home',
    tags: ['skillet', 'cast iron', 'kitchen', 'cookware'],
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    stock: 35,
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad for smartphones',
    price: 24.99,
    category: 'Electronics',
    tags: ['charging', 'wireless', 'smartphone', 'accessory'],
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    stock: 80,
  },
  {
    name: 'Electric Kettle',
    description: '1.7L stainless steel electric kettle with auto shut-off',
    price: 54.99,
    category: 'Home',
    tags: ['kettle', 'electric', 'kitchen', 'appliance'],
    imageUrl: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
    stock: 42,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight breathable running shoes for men and women',
    price: 89.99,
    category: 'Lifestyle',
    tags: ['shoes', 'running', 'fitness', 'footwear'],
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    stock: 65,
  },
  {
    name: 'Noise Cancelling Earbuds',
    description: 'True wireless earbuds with active noise cancellation',
    price: 149.99,
    category: 'Electronics',
    tags: ['earbuds', 'wireless', 'audio', 'noise cancelling'],
    imageUrl: 'https://images.unsplash.com/photo-1512499617640-c2f999098c01',
    stock: 38,
  },
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Pair of adjustable dumbbells, 5-52.5 lbs',
    price: 249.99,
    category: 'Lifestyle',
    tags: ['dumbbell', 'fitness', 'workout', 'adjustable'],
    imageUrl: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
    stock: 22,
  },
  {
    name: 'Bamboo Cutting Board Set',
    description: 'Set of 3 bamboo cutting boards, various sizes',
    price: 29.99,
    category: 'Home',
    tags: ['cutting board', 'bamboo', 'kitchen', 'eco-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc',
    stock: 55,
  },
  {
    name: 'Smart LED Light Bulb',
    description: 'WiFi-enabled color-changing LED light bulb',
    price: 19.99,
    category: 'Electronics',
    tags: ['light bulb', 'LED', 'smart', 'lighting'],
    imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    stock: 90,
  },
  {
    name: 'Stainless Steel Travel Mug',
    description: '16oz insulated travel mug, leak-proof lid',
    price: 22.99,
    category: 'Lifestyle',
    tags: ['mug', 'travel', 'insulated', 'steel'],
    imageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b43',
    stock: 77,
  },
  {
    name: 'Cordless Handheld Vacuum',
    description: 'Rechargeable handheld vacuum for home and car',
    price: 69.99,
    category: 'Home',
    tags: ['vacuum', 'cordless', 'cleaning', 'appliance'],
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    stock: 28,
  },
  {
    name: 'Magnetic Phone Mount',
    description: 'Universal magnetic phone mount for car dashboard',
    price: 14.99,
    category: 'Electronics',
    tags: ['phone', 'mount', 'magnetic', 'car'],
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    stock: 120,
  },
  {
    name: 'Weighted Blanket',
    description: '15lb weighted blanket for improved sleep',
    price: 99.99,
    category: 'Home',
    tags: ['blanket', 'weighted', 'sleep', 'comfort'],
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    stock: 32,
  },
  {
    name: 'Electric Toothbrush',
    description: 'Rechargeable electric toothbrush with 5 modes',
    price: 59.99,
    category: 'Lifestyle',
    tags: ['toothbrush', 'electric', 'oral care', 'rechargeable'],
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    stock: 44,
  },
  {
    name: 'Mini Projector',
    description: 'Portable mini projector for home theater',
    price: 199.99,
    category: 'Electronics',
    tags: ['projector', 'mini', 'portable', 'home theater'],
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    stock: 19,
  },
  {
    name: 'Ceramic Vase Set',
    description: 'Set of 3 modern ceramic vases for home decor',
    price: 34.99,
    category: 'Home',
    tags: ['vase', 'ceramic', 'decor', 'set'],
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    stock: 48,
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Insert customers
    console.log('👥 Inserting customers...');
    const customers = await Customer.insertMany(sampleCustomers);
    console.log(`✅ Inserted ${customers.length} customers`);

    // Insert products
    console.log('📦 Inserting products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);

    // Create sample orders
    console.log('🛍️ Creating sample orders...');
    const sampleOrders = [
      // Orders for demo@example.com (Sarah Johnson)
      {
        customerId: customers[0]._id,
        items: [
          {
            productId: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
          },
          {
            productId: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 2,
          },
        ],
        total: products[0].price + products[2].price * 2,
        status: 'SHIPPED',
        carrier: 'FedEx',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[0]._id,
        items: [
          {
            productId: products[5]._id,
            name: products[5].name,
            price: products[5].price,
            quantity: 1,
          },
        ],
        total: products[5].price,
        status: 'DELIVERED',
        carrier: 'UPS',
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[0]._id,
        items: [
          {
            productId: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 2,
          },
        ],
        total: products[1].price * 2,
        status: 'PENDING',
        carrier: null,
        estimatedDelivery: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      // Orders for other customers
      {
        customerId: customers[1]._id,
        items: [
          {
            productId: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
          },
        ],
        total: products[1].price,
        status: 'PROCESSING',
        carrier: null,
        estimatedDelivery: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[2]._id,
        items: [
          {
            productId: products[3]._id,
            name: products[3].name,
            price: products[3].price,
            quantity: 1,
          },
        ],
        total: products[3].price,
        status: 'PENDING',
        carrier: null,
        estimatedDelivery: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[3]._id,
        items: [
          {
            productId: products[4]._id,
            name: products[4].name,
            price: products[4].price,
            quantity: 2,
          },
        ],
        total: products[4].price * 2,
        status: 'DELIVERED',
        carrier: 'DHL',
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[4]._id,
        items: [
          {
            productId: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 3,
          },
        ],
        total: products[2].price * 3,
        status: 'SHIPPED',
        carrier: 'FedEx',
        estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[5]._id,
        items: [
          {
            productId: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
          },
        ],
        total: products[0].price,
        status: 'PROCESSING',
        carrier: null,
        estimatedDelivery: null,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[6]._id,
        items: [
          {
            productId: products[5]._id,
            name: products[5].name,
            price: products[5].price,
            quantity: 2,
          },
        ],
        total: products[5].price * 2,
        status: 'PENDING',
        carrier: null,
        estimatedDelivery: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[7]._id,
        items: [
          {
            productId: products[3]._id,
            name: products[3].name,
            price: products[3].price,
            quantity: 1,
          },
        ],
        total: products[3].price,
        status: 'DELIVERED',
        carrier: 'UPS',
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[8]._id,
        items: [
          {
            productId: products[4]._id,
            name: products[4].name,
            price: products[4].price,
            quantity: 1,
          },
        ],
        total: products[4].price,
        status: 'SHIPPED',
        carrier: 'FedEx',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[9]._id,
        items: [
          {
            productId: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 2,
          },
        ],
        total: products[1].price * 2,
        status: 'PROCESSING',
        carrier: null,
        estimatedDelivery: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[10]._id,
        items: [
          {
            productId: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 1,
          },
        ],
        total: products[2].price,
        status: 'DELIVERED',
        carrier: 'DHL',
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[11]._id,
        items: [
          {
            productId: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
          },
        ],
        total: products[0].price,
        status: 'PENDING',
        carrier: null,
        estimatedDelivery: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[8]._id,
        items: [
          {
            productId: products[5]._id,
            name: products[5].name,
            price: products[5].price,
            quantity: 1,
          },
        ],
        total: products[5].price,
        status: 'PROCESSING',
        carrier: null,
        estimatedDelivery: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[7]._id,
        items: [
          {
            productId: products[2]._id,
            name: products[2].name,
            price: products[2].price,
            quantity: 2,
          },
        ],
        total: products[2].price * 2,
        status: 'SHIPPED',
        carrier: 'UPS',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[6]._id,
        items: [
          {
            productId: products[4]._id,
            name: products[4].name,
            price: products[4].price,
            quantity: 1,
          },
        ],
        total: products[4].price,
        status: 'DELIVERED',
        carrier: 'FedEx',
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        customerId: customers[5]._id,
        items: [
          {
            productId: products[3]._id,
            name: products[3].name,
            price: products[3].price,
            quantity: 1,
          },
        ],
        total: products[3].price,
        status: 'PROCESSING',
        carrier: null,
        estimatedDelivery: null,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    const orders = await Order.insertMany(sampleOrders);
    console.log(`✅ Inserted ${orders.length} orders`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${customers.length} customers`);
    console.log(`   - ${products.length} products`);
    console.log(`   - ${orders.length} orders`);
    console.log(
      `   - Test user: demo@example.com (${
        orders.filter((o) => o.customerId.equals(customers[0]._id)).length
      } orders)`
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
