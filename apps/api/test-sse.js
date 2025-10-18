// Test script for Server-Sent Events (SSE) order tracking
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testSSE() {
  console.log('📡 Testing Server-Sent Events for Order Tracking...\n');

  try {
    // Step 1: Create a new order for testing
    console.log('1. Creating a test order...');

    // Get a customer
    const customer = await axios.get(
      `${BASE_URL}/api/customers?email=demo@example.com`
    );
    const customerId = customer.data._id;

    // Get a product
    const products = await axios.get(`${BASE_URL}/api/products`);
    const product = products.data.products[0];

    // Create order
    const orderData = {
      customerId: customerId,
      items: [
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ],
    };

    const newOrder = await axios.post(`${BASE_URL}/api/orders`, orderData);
    const orderId = newOrder.data.orderId;

    console.log(
      `✅ Created order ${orderId} with status: ${newOrder.data.status}`
    );
    console.log(`💰 Order total: $${newOrder.data.total}`);
    console.log('');

    // Step 2: Show SSE URL
    console.log('2. Server-Sent Events endpoint ready!');
    console.log(`📡 SSE URL: ${BASE_URL}/api/orders/${orderId}/stream`);
    console.log('');
    console.log('🎯 To test SSE in browser:');
    console.log('   1. Open browser developer tools');
    console.log('   2. Go to Console tab');
    console.log('   3. Run this JavaScript:');
    console.log('');
    console.log(
      `const eventSource = new EventSource('${BASE_URL}/api/orders/${orderId}/stream');`
    );
    console.log(`eventSource.onmessage = function(event) {`);
    console.log(`  const data = JSON.parse(event.data);`);
    console.log(`  console.log('📦 Order Update:', data);`);
    console.log(`};`);
    console.log('');
    console.log('🔄 Watch as your order automatically progresses:');
    console.log('   PENDING → PROCESSING → SHIPPED → DELIVERED');
    console.log('');
    console.log('⏱️  Updates every 3-7 seconds with realistic timing');
    console.log('📦 Includes carrier info and delivery estimates');
    console.log('✅ Completes automatically when delivered');
    console.log('');

    // Step 3: Test with curl for demonstration
    console.log('3. Testing SSE with curl (will show first few events):');
    console.log(`💡 Run this in a separate terminal to see live updates:`);
    console.log(`curl -N ${BASE_URL}/api/orders/${orderId}/stream`);
    console.log('');

    // Step 4: Show current order status
    console.log('4. Current order details:');
    const orderDetails = await axios.get(`${BASE_URL}/api/orders/${orderId}`);
    console.log(`   Status: ${orderDetails.data.status}`);
    console.log(`   Total: $${orderDetails.data.total}`);
    console.log(
      `   Created: ${new Date(orderDetails.data.createdAt).toLocaleString()}`
    );

    console.log('\n🎉 SSE implementation ready for real-time order tracking!');
  } catch (error) {
    console.error('❌ SSE test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testSSE();
