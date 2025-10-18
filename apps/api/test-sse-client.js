// Simple Node.js client to test Server-Sent Events
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testSSEClient() {
  console.log('📡 Testing SSE with Node.js client...\n');

  try {
    // Create a new order first
    console.log('1. Creating a new order for SSE testing...');

    const customer = await axios.get(
      `${BASE_URL}/api/customers?email=demo@example.com`
    );
    const products = await axios.get(`${BASE_URL}/api/products`);

    const orderData = {
      customerId: customer.data._id,
      items: [
        {
          productId: products.data.products[0]._id,
          name: products.data.products[0].name,
          price: products.data.products[0].price,
          quantity: 1,
        },
      ],
    };

    const order = await axios.post(`${BASE_URL}/api/orders`, orderData);
    const orderId = order.data.orderId;

    console.log(`✅ Created order ${orderId}`);
    console.log(`💰 Total: $${order.data.total}`);
    console.log(`📦 Initial status: ${order.data.status}`);
    console.log('');

    // Test SSE endpoint
    console.log('2. Connecting to SSE stream...');
    console.log(`📡 URL: ${BASE_URL}/api/orders/${orderId}/stream`);
    console.log('');

    const response = await axios.get(
      `${BASE_URL}/api/orders/${orderId}/stream`,
      {
        responseType: 'stream',
        timeout: 30000, // 30 seconds
        headers: {
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      }
    );

    console.log('🎯 Listening for order updates...');
    console.log(
      '📋 Expected progression: PENDING → PROCESSING → SHIPPED → DELIVERED'
    );
    console.log('⏱️  Updates every 3-7 seconds\n');

    let eventCount = 0;
    response.data.on('data', (chunk) => {
      const data = chunk.toString();

      // Parse SSE data
      if (data.startsWith('data: ')) {
        eventCount++;
        try {
          const jsonData = JSON.parse(data.substring(6));

          console.log(`📦 Event ${eventCount}: ${jsonData.status}`);
          console.log(`   Message: ${jsonData.message}`);
          console.log(
            `   Time: ${new Date(jsonData.timestamp).toLocaleTimeString()}`
          );

          if (jsonData.carrier) {
            console.log(`   Carrier: ${jsonData.carrier}`);
          }

          if (jsonData.estimatedDelivery) {
            console.log(
              `   Estimated Delivery: ${new Date(
                jsonData.estimatedDelivery
              ).toLocaleDateString()}`
            );
          }

          if (jsonData.final) {
            console.log('🎉 Order tracking completed!');
          }

          console.log('');
        } catch (parseError) {
          console.log(`📡 Raw event: ${data.trim()}`);
        }
      }
    });

    response.data.on('end', () => {
      console.log('✅ SSE stream ended');
    });

    response.data.on('error', (error) => {
      console.error('❌ SSE stream error:', error.message);
    });
  } catch (error) {
    console.error('❌ SSE client test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
  }
}

testSSEClient();
