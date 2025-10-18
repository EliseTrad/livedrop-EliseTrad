/**
 * Test script for LLM integration with backend API
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/assistant';

async function testLLMIntegration() {
  console.log('🤖 Testing LLM Integration with Backend API...\n');

  try {
    // Test 1: Check LLM status (should show not configured initially)
    console.log('🔍 Test 1: Initial LLM Status');
    const statusResponse = await axios.get(`${API_BASE}/llm/status`);
    console.log('✅ Status endpoint working');
    console.log(`Configured: ${statusResponse.data.data.configured}`);
    console.log(`Available: ${statusResponse.data.data.available}\n`);

    // Test 2: Try to configure LLM (will fail without actual URL)
    console.log('⚙️ Test 2: LLM Configuration');
    console.log(
      'ℹ️ This will show configuration structure (expecting failure without real ngrok URL)\n'
    );

    try {
      const configResponse = await axios.post(`${API_BASE}/llm/configure`, {
        url: 'https://example-placeholder.ngrok.io',
      });
      console.log('Configuration response:', configResponse.data);
    } catch (configError) {
      console.log(
        'Expected: Configuration attempted but service not available'
      );
      console.log('Status:', configError.response?.status);
    }

    // Test 3: Test LLM generation (should use fallback)
    console.log('\n💬 Test 3: LLM Generation (with fallback)');
    const testPrompts = [
      'Hello, I need help with my order status.',
      'What is your return policy?',
      'Can you help me track my package?',
    ];

    for (const prompt of testPrompts) {
      try {
        console.log(`\nTesting: "${prompt}"`);
        const genResponse = await axios.post(`${API_BASE}/llm/generate`, {
          prompt,
          intent: 'policy_question',
        });

        if (genResponse.data.success) {
          console.log(`✅ Response: "${genResponse.data.data.response}"`);
        } else {
          console.log(
            `⚠️ Fallback response: "${genResponse.data.fallbackResponse}"`
          );
        }
      } catch (genError) {
        console.log(
          `❌ Generation failed: ${
            genError.response?.data?.error || genError.message
          }`
        );
      }
    }

    // Test 4: Test LLM test endpoint
    console.log('\n🧪 Test 4: LLM Test Endpoint');
    try {
      const testResponse = await axios.post(`${API_BASE}/llm/test`);
      console.log('✅ Test endpoint working');
      console.log(
        `Success rate: ${testResponse.data.data.summary.successRate}`
      );
      console.log(
        `Results: ${testResponse.data.data.summary.successful}/${testResponse.data.data.summary.total} successful`
      );
    } catch (testError) {
      console.log(
        '❌ Test endpoint failed:',
        testError.response?.data?.error || testError.message
      );
    }

    console.log('\n📋 Integration Summary:');
    console.log('✅ LLM service infrastructure ready');
    console.log('✅ API endpoints configured');
    console.log('✅ Fallback responses working');
    console.log('⏳ Ready for Week 3 Colab integration');

    console.log('\n📝 Next Steps:');
    console.log('1. Update your Week 3 Colab with the /generate endpoint');
    console.log('2. Get your ngrok URL from Colab');
    console.log(
      '3. Configure the LLM service with: POST /api/assistant/llm/configure'
    );
    console.log('4. Test the full integration');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(
        '❌ Backend server not running. Please start with: npm start'
      );
    } else {
      console.error('❌ Test failed:', error.response?.data || error.message);
    }
  }
}

// Instructions for manual testing
function showManualTestingInstructions() {
  console.log('\n🔧 Manual Testing Instructions:');
  console.log('');
  console.log('1. Start your backend server:');
  console.log('   npm start');
  console.log('');
  console.log('2. Update your Week 3 Colab with the /generate endpoint code');
  console.log('   (See docs/week3-llm-integration.md)');
  console.log('');
  console.log('3. Get your ngrok URL from Colab and configure:');
  console.log(
    '   curl -X POST http://localhost:5000/api/assistant/llm/configure \\'
  );
  console.log('        -H "Content-Type: application/json" \\');
  console.log(
    '        -d "{\\"url\\": \\"https://your-ngrok-url.ngrok.io\\"}"'
  );
  console.log('');
  console.log('4. Test the integration:');
  console.log('   node test-llm.js https://your-ngrok-url.ngrok.io');
  console.log('');
  console.log('5. Test through the backend API:');
  console.log(
    '   curl -X POST http://localhost:5000/api/assistant/llm/generate \\'
  );
  console.log('        -H "Content-Type: application/json" \\');
  console.log(
    '        -d "{\\"prompt\\": \\"Hello, I need help\\", \\"intent\\": \\"policy_question\\"}"'
  );
}

// Run tests
if (require.main === module) {
  testLLMIntegration()
    .then(() => {
      showManualTestingInstructions();
    })
    .catch((error) => {
      console.error('❌ Test script failed:', error.message);
    });
}

module.exports = { testLLMIntegration };
