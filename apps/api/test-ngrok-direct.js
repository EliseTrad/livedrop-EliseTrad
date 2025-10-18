/**
 * Direct test of ngrok URL
 */

const axios = require('axios');

async function testNgrokDirect() {
  const ngrokUrl = 'https://erik-unkindhearted-shonta.ngrok-free.dev';

  console.log('🌐 Testing ngrok URL directly...\n');

  try {
    console.log('1. Testing /health endpoint...');
    const healthResponse = await axios.get(`${ngrokUrl}/health`, {
      timeout: 30000,
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    console.log('✅ Health check:', healthResponse.data);

    console.log('\n2. Testing /generate endpoint directly...');
    const generateResponse = await axios.post(
      `${ngrokUrl}/generate`,
      {
        prompt: 'Hello, I need help with my order',
        intent: 'order_status',
      },
      {
        timeout: 150000, // 2.5 minute timeout
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
    console.log('✅ Direct generation successful!');
    console.log('Response:', JSON.stringify(generateResponse.data, null, 2));
  } catch (error) {
    console.log('❌ Direct ngrok test error:');
    console.log('- Message:', error.message);
    if (error.response) {
      console.log('- Status:', error.response.status);
      console.log('- Headers:', error.response.headers);
      console.log('- Data:', error.response.data);
    }
    if (error.code) {
      console.log('- Code:', error.code);
    }
  }
}

testNgrokDirect();
