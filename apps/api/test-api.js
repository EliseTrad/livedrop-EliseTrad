// Quick API test script to verify all endpoints work
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health:', health.data);
    console.log('');

    // Test customers endpoint (should return 404 since no data yet)
    console.log('2. Testing customers endpoint...');
    try {
      const customer = await axios.get(
        `${BASE_URL}/api/customers?email=demo@example.com`
      );
      console.log('✅ Customer found:', customer.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(
          '✅ Customer endpoint working (404 expected - no data yet)'
        );
      } else {
        console.log('❌ Customer error:', error.message);
      }
    }
    console.log('');

    // Test products endpoint
    console.log('3. Testing products endpoint...');
    try {
      const products = await axios.get(`${BASE_URL}/api/products`);
      console.log('✅ Products:', products.data);
    } catch (error) {
      console.log('⚠️ Products error:', error.message);
    }
    console.log('');

    console.log('🎉 API testing completed!');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('Make sure the server is running on port 5000');
  }
}

testAPI();
