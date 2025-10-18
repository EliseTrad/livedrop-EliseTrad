/**
 * Test script for the Intelligent Assistant Engine
 * Tests the new /chat endpoint that orchestrates all components
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/assistant';

// Test scenarios
const testScenarios = [
  {
    name: 'Order Status Query',
    message: "What's the status of my order?",
    userContext: { email: 'john.doe@email.com' },
    expectedIntent: 'order_status',
    expectFunctions: ['getOrderStatus'],
  },
  {
    name: 'Product Search',
    message: "I'm looking for wireless headphones",
    userContext: {},
    expectedIntent: 'product_search',
    expectFunctions: ['searchProducts'],
  },
  {
    name: 'Policy Question',
    message: 'What is your return policy?',
    userContext: {},
    expectedIntent: 'policy_question',
    expectFunctions: [],
    expectCitations: true,
  },
  {
    name: 'Complaint Handling',
    message: "I'm really unhappy with my recent purchase, it arrived damaged",
    userContext: {},
    expectedIntent: 'complaint',
    expectFunctions: [],
  },
  {
    name: 'Chitchat',
    message: 'How are you doing today?',
    userContext: {},
    expectedIntent: 'chitchat',
    expectFunctions: [],
  },
  {
    name: 'Off Topic',
    message: "What's the weather like?",
    userContext: {},
    expectedIntent: 'off_topic',
    expectFunctions: [],
  },
];

async function testAssistantEngine() {
  console.log('🧪 Testing Intelligent Assistant Engine...\n');

  const results = [];

  for (const scenario of testScenarios) {
    console.log(`📝 Testing: ${scenario.name}`);
    console.log(`   Message: "${scenario.message}"`);

    try {
      const response = await axios.post(`${BASE_URL}/chat`, {
        message: scenario.message,
        userContext: scenario.userContext,
      });

      if (response.data.success) {
        const data = response.data.data;

        // Analyze results
        const analysis = {
          scenario: scenario.name,
          message: scenario.message,
          intent: data.intent,
          confidence: data.confidence,
          functionsUsed: data.functionsUsed,
          hasCitations: data.citations && data.citations.length > 0,
          processingTime: data.processingTime,
          responseLength: data.message.length,
          success: true,
        };

        // Check expectations
        const intentMatch = data.intent === scenario.expectedIntent;
        const functionsMatch = scenario.expectFunctions.every((fn) =>
          data.functionsUsed.includes(fn)
        );
        const citationsMatch = scenario.expectCitations
          ? data.citations && data.citations.length > 0
          : true;

        analysis.expectations = {
          intentMatch,
          functionsMatch,
          citationsMatch,
          overall: intentMatch && functionsMatch && citationsMatch,
        };

        results.push(analysis);

        console.log(
          `   ✅ Intent: ${data.intent} (${data.confidence}% confidence)`
        );
        console.log(
          `   🔧 Functions: ${data.functionsUsed.join(', ') || 'None'}`
        );
        console.log(`   📚 Citations: ${data.citations?.length || 0}`);
        console.log(`   ⚡ Processing: ${data.processingTime}ms`);
        console.log(`   💬 Response: "${data.message.substring(0, 100)}..."`);
        console.log(
          `   ✅ Expectations: ${
            analysis.expectations.overall ? 'PASSED' : 'FAILED'
          }\n`
        );
      } else {
        console.log(`   ❌ Error: ${response.data.error}\n`);
        results.push({
          scenario: scenario.name,
          success: false,
          error: response.data.error,
        });
      }
    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}\n`);
      results.push({
        scenario: scenario.name,
        success: false,
        error: error.message,
      });
    }
  }

  // Summary
  console.log('📊 Test Summary:');
  console.log('================');

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const expectationsMet = successful.filter((r) => r.expectations?.overall);

  console.log(`Total Tests: ${results.length}`);
  console.log(`Successful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(
    `Expectations Met: ${expectationsMet.length}/${successful.length}`
  );

  if (successful.length > 0) {
    const avgProcessingTime =
      successful.reduce((sum, r) => sum + (r.processingTime || 0), 0) /
      successful.length;
    const avgResponseLength =
      successful.reduce((sum, r) => sum + (r.responseLength || 0), 0) /
      successful.length;

    console.log(`Average Processing Time: ${avgProcessingTime.toFixed(2)}ms`);
    console.log(
      `Average Response Length: ${avgResponseLength.toFixed(0)} characters`
    );
  }

  // Intent distribution
  console.log('\n🎯 Intent Distribution:');
  const intentCounts = {};
  successful.forEach((r) => {
    intentCounts[r.intent] = (intentCounts[r.intent] || 0) + 1;
  });
  Object.entries(intentCounts).forEach(([intent, count]) => {
    console.log(`   ${intent}: ${count}`);
  });

  // Function usage
  console.log('\n🔧 Function Usage:');
  const functionCounts = {};
  successful.forEach((r) => {
    r.functionsUsed?.forEach((fn) => {
      functionCounts[fn] = (functionCounts[fn] || 0) + 1;
    });
  });
  Object.entries(functionCounts).forEach(([fn, count]) => {
    console.log(`   ${fn}: ${count}`);
  });

  return results;
}

// Performance test
async function performanceTest() {
  console.log('\n🚀 Performance Test...');

  const message = 'I need help with my order';
  const iterations = 10;
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const start = Date.now();

    try {
      await axios.post(`${BASE_URL}/chat`, {
        message: message,
        userContext: { email: 'test@example.com' },
      });

      times.push(Date.now() - start);
    } catch (error) {
      console.log(`Iteration ${i + 1} failed: ${error.message}`);
    }
  }

  if (times.length > 0) {
    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    console.log(`Performance Results (${iterations} iterations):`);
    console.log(`   Average: ${avgTime.toFixed(2)}ms`);
    console.log(`   Min: ${minTime}ms`);
    console.log(`   Max: ${maxTime}ms`);
  }
}

// Run tests
async function runAllTests() {
  try {
    // First check if server is running
    console.log('🔍 Checking server status...');
    await axios.get('http://localhost:5000/health');
    console.log('✅ Server is running\n'); // Run main tests
    await testAssistantEngine();

    // Run performance test
    await performanceTest();

    console.log('\n🎉 All tests completed!');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start the server first:');
      console.log('   cd apps/api && npm start');
    } else {
      console.log('❌ Test failed:', error.message);
    }
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = { testAssistantEngine, performanceTest };
