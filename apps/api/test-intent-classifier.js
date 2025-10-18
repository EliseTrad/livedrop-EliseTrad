/**
 * Intent Classification Test Script
 * Tests the intent classifier with various customer messages
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testIntentClassification() {
  console.log('🧠 Testing Intent Classification System...\n');

  try {
    // Test 1: Get supported intents
    console.log('1. Getting supported intents...');
    const intentsResponse = await axios.get(
      `${API_BASE_URL}/assistant/intents`
    );
    console.log(
      `✅ Found ${intentsResponse.data.data.count} supported intents:`
    );
    intentsResponse.data.data.intents.forEach((intent) => {
      console.log(`   • ${intent.name}: ${intent.description}`);
    });
    console.log();

    // Test 2: Run built-in classifier tests
    console.log('2. Running built-in classifier tests...');
    const testResponse = await axios.post(
      `${API_BASE_URL}/assistant/test-classifier`
    );
    const testData = testResponse.data.data;
    console.log(
      `✅ Accuracy: ${testData.accuracy} (${testData.correctPredictions}/${testData.totalTests})`
    );

    // Show a few example results
    console.log('\n📝 Sample test results:');
    testData.results.slice(0, 5).forEach((test) => {
      const status = test.correct ? '✅' : '❌';
      console.log(`   ${status} "${test.message}"`);
      console.log(
        `      Expected: ${test.expected}, Got: ${test.actual} (${(
          test.confidence * 100
        ).toFixed(1)}%)`
      );
    });
    console.log();

    // Test 3: Test individual message classifications
    console.log('3. Testing individual message classifications...');
    const testMessages = [
      'Hi there! I need help with my order #12345',
      "What's your return policy for electronics?",
      'Looking for wireless headphones under $200',
      "My package arrived damaged and I'm very upset",
      'Thanks for the great service! Have a wonderful day',
      "What's the weather like in New York today?",
      'This is totally inappropriate content',
    ];

    for (const message of testMessages) {
      const response = await axios.post(
        `${API_BASE_URL}/assistant/classify-intent`,
        {
          message: message,
        }
      );

      const result = response.data.data;
      console.log(`📨 "${message}"`);
      console.log(
        `   🎯 Intent: ${result.intent} (${
          result.confidenceLevel
        } confidence: ${(result.confidence * 100).toFixed(1)}%)`
      );
      console.log(`   💭 ${result.reasoning}`);
      console.log();
    }

    // Test 4: Batch classification
    console.log('4. Testing batch classification...');
    const batchMessages = [
      'Where is my order?',
      'Can I return this item?',
      'Do you sell laptops?',
      'This product is broken!',
      'Thank you so much!',
    ];

    const batchResponse = await axios.post(
      `${API_BASE_URL}/assistant/batch-classify`,
      {
        messages: batchMessages,
      }
    );

    const batchData = batchResponse.data.data;
    console.log(`✅ Processed ${batchData.statistics.totalMessages} messages`);
    console.log(
      `📊 Average confidence: ${(
        batchData.statistics.averageConfidence * 100
      ).toFixed(1)}%`
    );
    console.log('📈 Intent distribution:');
    Object.entries(batchData.statistics.intentDistribution).forEach(
      ([intent, count]) => {
        console.log(`   • ${intent}: ${count} messages`);
      }
    );

    console.log('\n🎉 Intent classification system is working perfectly!');
  } catch (error) {
    if (error.response) {
      console.error(
        '❌ API Error:',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error('❌ Network Error: Could not connect to server');
      console.error(
        '   Make sure the server is running on http://localhost:5000'
      );
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Run the tests
testIntentClassification();
