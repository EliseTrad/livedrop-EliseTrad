// Comprehensive API test script for all endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPIComplete() {
  console.log('🧪 Testing Complete API functionality...\n');

  try {
    // Test 1: Health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health:', health.data.status);
    console.log('');

    // Test 2: Customer lookup
    console.log('2. Testing customer lookup...');
    const customer = await axios.get(
      `${BASE_URL}/api/customers?email=demo@example.com`
    );
    const customerId = customer.data._id;
    console.log('✅ Customer found:', customer.data.name, customer.data.email);
    console.log('');

    // Test 3: Products list
    console.log('3. Testing products list...');
    const products = await axios.get(`${BASE_URL}/api/products`);
    console.log(`✅ Found ${products.data.products.length} products`);
    const productId = products.data.products[0]._id;
    console.log('');

    // Test 4: Product search
    console.log('4. Testing product search...');
    const searchResults = await axios.get(
      `${BASE_URL}/api/products?search=headphones`
    );
    console.log(
      `✅ Search 'headphones' found ${searchResults.data.products.length} products`
    );
    console.log('');

    // Test 5: Product by category
    console.log('5. Testing product filter by category...');
    const electronicsProducts = await axios.get(
      `${BASE_URL}/api/products?category=Electronics`
    );
    console.log(
      `✅ Electronics category has ${electronicsProducts.data.products.length} products`
    );
    console.log('');

    // Test 6: Single product
    console.log('6. Testing single product endpoint...');
    const singleProduct = await axios.get(
      `${BASE_URL}/api/products/${productId}`
    );
    console.log('✅ Single product:', singleProduct.data.name);
    console.log('');

    // Test 7: Create new order
    console.log('7. Testing order creation...');
    const orderData = {
      customerId: customerId,
      items: [
        {
          productId: productId,
          name: singleProduct.data.name,
          price: singleProduct.data.price,
          quantity: 2,
        },
      ],
    };

    const newOrder = await axios.post(`${BASE_URL}/api/orders`, orderData);
    const orderId = newOrder.data.orderId;
    console.log('✅ Order created:', orderId);
    console.log('');

    // Test 8: Get order by ID
    console.log('8. Testing get order by ID...');
    const orderDetails = await axios.get(`${BASE_URL}/api/orders/${orderId}`);
    console.log(
      '✅ Order details:',
      orderDetails.data.status,
      '$' + orderDetails.data.total
    );
    console.log('');

    // Test 9: Get orders by customer
    console.log('9. Testing get orders by customer...');
    const customerOrders = await axios.get(
      `${BASE_URL}/api/orders?customerId=${customerId}`
    );
    console.log(`✅ Customer has ${customerOrders.data.length} orders`);
    console.log('');

    // Test 10: Analytics - Daily Revenue
    console.log('10. Testing analytics daily revenue...');
    const analytics = await axios.get(
      `${BASE_URL}/api/analytics/daily-revenue`
    );
    console.log(`✅ Analytics found ${analytics.data.length} days of data`);
    console.log('');

    // Test 11: Analytics - Business Summary
    console.log('11. Testing analytics summary...');
    const summary = await axios.get(`${BASE_URL}/api/analytics/summary`);
    console.log(
      `✅ Business summary: $${summary.data.totalRevenue} revenue, ${summary.data.totalOrders} orders`
    );
    console.log('');

    console.log('🎉 All API endpoints working perfectly!');

    // Summary
    console.log('\n📊 API Endpoint Summary:');
    console.log('  ✅ Health check');
    console.log('  ✅ Customer lookup by email');
    console.log('  ✅ Products list with pagination');
    console.log('  ✅ Product search functionality');
    console.log('  ✅ Product category filtering');
    console.log('  ✅ Single product details');
    console.log('  ✅ Order creation');
    console.log('  ✅ Order details by ID');
    console.log('  ✅ Customer order history');
    console.log('  ✅ Analytics daily revenue (MongoDB aggregation)');
    console.log('  ✅ Analytics business summary');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPIComplete();
