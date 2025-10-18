/**
 * Enhanced test script for LLM integration with debugging
 */

const axios = require('axios');

async function testLLM() {
  console.log('🤖 Testing LLM Integration...\n');

  try {
    console.log('1. Testing LLM Status...');
    const statusResponse = await axios.get(
      'http://localhost:5000/api/assistant/llm/status',
      { timeout: 10000 }
    );
    console.log('✅ Status:', statusResponse.data);

    console.log('\n2. Testing LLM Generation...');
    console.log('   Sending request to backend...');

    const generateResponse = await axios.post(
      'http://localhost:5000/api/assistant/llm/generate',
      {
        prompt: 'Hello, I need help with my order',
        intent: 'order_status',
      },
      {
        timeout: 300000, // 5 minute timeout for LLM generation (longer than backend)
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ Generation successful!');
    console.log('Response:', JSON.stringify(generateResponse.data, null, 2));

    console.log('\n🎉 LLM integration working perfectly!');
  } catch (error) {
    console.log('❌ Error details:');
    console.log('- Message:', error.message);
    if (error.response) {
      console.log('- Status:', error.response.status);
      console.log('- Headers:', error.response.headers);
      console.log('- Data:', error.response.data);
    }
    if (error.code) {
      console.log('- Code:', error.code);
    }
    console.log('- Full error:', error.toJSON ? error.toJSON() : error);
  }
}

testLLM();
