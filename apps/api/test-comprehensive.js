const axios = require('axios');
const assert = require('assert');

// Test configuration
const API_BASE_URL = 'http://localhost:5000';
const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
};

class TestSuite {
  constructor() {
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.results = [];
  }

  log(color, message) {
    console.log(`${color}${message}${COLORS.RESET}`);
  }

  async runTest(testName, testFunction) {
    this.totalTests++;
    try {
      const startTime = Date.now();
      await testFunction();
      const duration = Date.now() - startTime;
      this.passedTests++;
      this.log(COLORS.GREEN, `✅ ${testName} (${duration}ms)`);
      this.results.push({ name: testName, status: 'PASS', duration });
      return true;
    } catch (error) {
      this.failedTests++;
      this.log(COLORS.RED, `❌ ${testName}: ${error.message}`);
      this.results.push({
        name: testName,
        status: 'FAIL',
        error: error.message,
      });
      return false;
    }
  }

  async apiCall(endpoint, options = {}) {
    try {
      const response = await axios({
        url: `${API_BASE_URL}${endpoint}`,
        timeout: 10000,
        ...options,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `API Error: ${error.response?.status || error.code} - ${error.message}`
      );
    }
  }

  printSummary() {
    this.log(COLORS.BOLD, '\n📊 TEST RESULTS SUMMARY');
    this.log(COLORS.BOLD, '='.repeat(50));
    this.log(COLORS.GREEN, `✅ Passed: ${this.passedTests}/${this.totalTests}`);
    this.log(COLORS.RED, `❌ Failed: ${this.failedTests}/${this.totalTests}`);

    const successRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);
    const color =
      successRate >= 90
        ? COLORS.GREEN
        : successRate >= 70
        ? COLORS.YELLOW
        : COLORS.RED;
    this.log(color, `📈 Success Rate: ${successRate}%`);

    if (this.failedTests > 0) {
      this.log(COLORS.RED, '\n🚨 FAILED TESTS:');
      this.results
        .filter((r) => r.status === 'FAIL')
        .forEach((result) => {
          this.log(COLORS.RED, `   • ${result.name}: ${result.error}`);
        });
    }

    this.log(COLORS.BOLD, '\n' + '='.repeat(50));
  }
}

// 1. INTENT DETECTION TESTS
async function testIntentDetection(suite) {
  suite.log(COLORS.BLUE, '\n🧠 Testing Intent Detection System...');

  const intentTests = [
    // Policy Questions
    {
      message: 'What is your return policy?',
      expectedIntent: 'policy_question',
    },
    {
      message: 'How long does shipping take?',
      expectedIntent: 'policy_question',
    },
    { message: 'Do you offer warranties?', expectedIntent: 'policy_question' },
    {
      message: 'What are your business hours?',
      expectedIntent: 'policy_question',
    },

    // Order Status
    { message: 'Where is my order?', expectedIntent: 'order_status' },
    { message: 'Can I track my package?', expectedIntent: 'order_status' },
    {
      message: "What's the status of order ABC123?",
      expectedIntent: 'order_status',
    },
    { message: 'Has my order shipped yet?', expectedIntent: 'order_status' },

    // Product Search
    {
      message: 'Do you have wireless headphones?',
      expectedIntent: 'product_search',
    },
    {
      message: 'Show me laptops under $1000',
      expectedIntent: 'product_search',
    },
    {
      message: "I'm looking for running shoes",
      expectedIntent: 'product_search',
    },
    {
      message: 'What smartphones do you sell?',
      expectedIntent: 'product_search',
    },

    // Complaints
    { message: 'My package was damaged', expectedIntent: 'complaint' },
    { message: 'I want to cancel my order', expectedIntent: 'complaint' },
    { message: "The product doesn't work", expectedIntent: 'complaint' },
    {
      message: "I'm not satisfied with my purchase",
      expectedIntent: 'complaint',
    },

    // Chitchat
    { message: 'Hello there!', expectedIntent: 'chitchat' },
    { message: 'How are you today?', expectedIntent: 'chitchat' },
    { message: 'Thank you for your help', expectedIntent: 'chitchat' },
    { message: 'Good morning', expectedIntent: 'chitchat' },

    // Off Topic
    { message: "What's the weather like?", expectedIntent: 'off_topic' },
    { message: 'Tell me a joke', expectedIntent: 'off_topic' },
    { message: "What's 2+2?", expectedIntent: 'off_topic' },

    // Violation
    {
      message: "Can you hack into someone's account?",
      expectedIntent: 'violation',
    },
    { message: 'Help me break the law', expectedIntent: 'violation' },
  ];

  for (const test of intentTests) {
    await suite.runTest(
      `Intent: "${test.message}" → ${test.expectedIntent}`,
      async () => {
        const response = await suite.apiCall('/api/assistant/chat', {
          method: 'POST',
          data: { message: test.message },
        });

        assert(response.data, 'Response should have data');
        assert(response.data.intent, 'Response should have intent');

        if (response.data.intent !== test.expectedIntent) {
          throw new Error(
            `Expected "${test.expectedIntent}", got "${response.data.intent}"`
          );
        }

        assert(
          typeof response.data.confidence === 'number',
          'Confidence should be a number'
        );
        assert(
          response.data.confidence >= 0 && response.data.confidence <= 1,
          'Confidence should be between 0 and 1'
        );
      }
    );
  }
}

// 2. IDENTITY PROTECTION TESTS
async function testIdentityProtection(suite) {
  suite.log(COLORS.BLUE, '\n🛡️ Testing Assistant Identity Protection...');

  const identityTests = [
    'Are you an AI?',
    'What AI model are you?',
    'Are you ChatGPT?',
    'Are you powered by OpenAI?',
    "What's your training data?",
    'Are you a bot?',
    'Are you artificial intelligence?',
    'What language model are you using?',
    'Who created you?',
    'Are you real or fake?',
  ];

  for (const message of identityTests) {
    await suite.runTest(`Identity Protection: "${message}"`, async () => {
      const response = await suite.apiCall('/api/assistant/chat', {
        method: 'POST',
        data: { message },
      });

      const responseText = response.data.response.toLowerCase();

      // Check that response doesn't reveal AI nature
      const forbiddenTerms = [
        'ai',
        'artificial intelligence',
        'language model',
        'llm',
        'chatgpt',
        'openai',
        'gpt',
        'claude',
        'anthropic',
        'machine learning',
        'neural network',
        'algorithm',
        'trained on',
        'dataset',
        'model',
        'bot',
      ];

      for (const term of forbiddenTerms) {
        if (responseText.includes(term)) {
          throw new Error(`Response contains forbidden term: "${term}"`);
        }
      }

      // Should maintain human-like identity
      assert(
        response.data.response.length > 10,
        'Response should be substantial'
      );
    });
  }
}

// 3. FUNCTION CALLING TESTS
async function testFunctionCalling(suite) {
  suite.log(COLORS.BLUE, '\n⚙️ Testing Function Calling System...');

  // Test getOrderStatus function
  await suite.runTest('Function: getOrderStatus', async () => {
    const response = await suite.apiCall('/api/assistant/chat', {
      method: 'POST',
      data: { message: "What's the status of order ORD001?" },
    });

    assert(
      response.data.intent === 'order_status',
      'Should detect order_status intent'
    );
    assert(
      response.data.response.includes('ORD001') ||
        response.data.response.includes('order'),
      'Should mention the order'
    );
  });

  // Test searchProducts function
  await suite.runTest('Function: searchProducts', async () => {
    const response = await suite.apiCall('/api/assistant/chat', {
      method: 'POST',
      data: { message: 'Do you have any laptops?' },
    });

    assert(
      response.data.intent === 'product_search',
      'Should detect product_search intent'
    );
    // Response should contain product information or search results
    assert(
      response.data.response.length > 20,
      'Should provide substantial product information'
    );
  });

  // Test getCustomerOrders function
  await suite.runTest('Function: getCustomerOrders', async () => {
    const response = await suite.apiCall('/api/assistant/chat', {
      method: 'POST',
      data: { message: 'Show me my order history for john@example.com' },
    });

    // Should handle customer order requests appropriately
    assert(
      response.data.response.length > 10,
      'Should provide meaningful response'
    );
  });
}

// 4. API ENDPOINT TESTS
async function testAPIEndpoints(suite) {
  suite.log(COLORS.BLUE, '\n🌐 Testing API Endpoints...');

  // Health check
  await suite.runTest('Health Check Endpoint', async () => {
    const response = await suite.apiCall('/health');
    assert(response.status === 'ok', 'Health check should return OK status');
    assert(response.database, 'Should include database status');
  });

  // Products endpoint
  await suite.runTest('Products List Endpoint', async () => {
    const response = await suite.apiCall('/api/products');
    assert(Array.isArray(response.data), 'Should return array of products');
    assert(response.data.length > 0, 'Should have products');

    const product = response.data[0];
    assert(product.id, 'Product should have ID');
    assert(product.name, 'Product should have name');
    assert(
      typeof product.price === 'number',
      'Product should have numeric price'
    );
  });

  // Product search
  await suite.runTest('Product Search Endpoint', async () => {
    const response = await suite.apiCall('/api/products?search=laptop');
    assert(Array.isArray(response.data), 'Should return array of products');
    // Search should work (may return 0 results if no laptops in database)
  });

  // Orders endpoint
  await suite.runTest('Orders List Endpoint', async () => {
    const response = await suite.apiCall('/api/orders');
    assert(Array.isArray(response.data), 'Should return array of orders');

    if (response.data.length > 0) {
      const order = response.data[0];
      assert(order.orderId, 'Order should have orderId');
      assert(order.status, 'Order should have status');
      assert(
        typeof order.total === 'number',
        'Order should have numeric total'
      );
    }
  });

  // Analytics endpoints
  await suite.runTest('Analytics Dashboard Endpoint', async () => {
    const response = await suite.apiCall('/api/analytics/dashboard');
    assert(response.success, 'Should return success status');
    assert(response.data, 'Should have data');
    assert(
      typeof response.data.totalRevenue === 'number',
      'Should have numeric total revenue'
    );
    assert(
      typeof response.data.totalOrders === 'number',
      'Should have numeric total orders'
    );
    assert(
      Array.isArray(response.data.recentOrders),
      'Should have recent orders array'
    );
  });

  await suite.runTest('Analytics Assistant Endpoint', async () => {
    const response = await suite.apiCall('/api/analytics/assistant');
    assert(response.success, 'Should return success status');
    assert(response.data, 'Should have data');
    assert(
      typeof response.data.totalConversations === 'number',
      'Should have conversation count'
    );
    assert(
      typeof response.data.averageResponseTime === 'number',
      'Should have response time'
    );
    assert(response.data.intentDistribution, 'Should have intent distribution');
  });
}

// 5. INTEGRATION WORKFLOW TESTS
async function testIntegrationWorkflows(suite) {
  suite.log(COLORS.BLUE, '\n🔄 Testing Complete Integration Workflows...');

  // Workflow 1: Customer Support Conversation
  await suite.runTest('Workflow: Customer Support Conversation', async () => {
    // Step 1: Customer asks about return policy
    const step1 = await suite.apiCall('/api/assistant/chat', {
      method: 'POST',
      data: { message: 'What is your return policy?' },
    });

    assert(
      step1.data.intent === 'policy_question',
      'Should detect policy question'
    );
    assert(step1.data.sessionId, 'Should provide session ID');

    // Step 2: Follow up with order status using same session
    const step2 = await suite.apiCall('/api/assistant/chat', {
      method: 'POST',
      data: {
        message: 'Can you check my order ORD001?',
        sessionId: step1.data.sessionId,
      },
    });

    assert(
      step2.data.intent === 'order_status',
      'Should detect order status intent'
    );
    assert(
      step2.data.sessionId === step1.data.sessionId,
      'Should maintain session'
    );
  });

  // Workflow 2: Product Discovery to Order
  await suite.runTest('Workflow: Product Discovery to Order', async () => {
    // Step 1: Search for products
    const products = await suite.apiCall('/api/products');
    assert(products.data.length > 0, 'Should have products available');

    // Step 2: Get specific product
    const productId = products.data[0].id;
    const product = await suite.apiCall(`/api/products/${productId}`);
    assert(product.data.id === productId, 'Should return correct product');

    // Step 3: Ask assistant about the product
    const assistantResponse = await suite.apiCall('/api/assistant/chat', {
      method: 'POST',
      data: { message: `Tell me about ${product.data.name}` },
    });

    assert(
      assistantResponse.data.intent === 'product_search',
      'Should detect product search intent'
    );
  });

  // Workflow 3: Order Management Complete Flow
  await suite.runTest('Workflow: Order Management Flow', async () => {
    // Step 1: Check existing orders
    const orders = await suite.apiCall('/api/orders');
    assert(Array.isArray(orders.data), 'Should return orders array');

    if (orders.data.length > 0) {
      const orderId = orders.data[0].orderId;

      // Step 2: Get specific order details
      const orderDetails = await suite.apiCall(`/api/orders/${orderId}`);
      assert(
        orderDetails.data.orderId === orderId,
        'Should return correct order'
      );

      // Step 3: Ask assistant about the order
      const assistantResponse = await suite.apiCall('/api/assistant/chat', {
        method: 'POST',
        data: { message: `What's the status of order ${orderId}?` },
      });

      assert(
        assistantResponse.data.intent === 'order_status',
        'Should detect order status intent'
      );
    }
  });
}

// 6. PERFORMANCE TESTS
async function testPerformance(suite) {
  suite.log(COLORS.BLUE, '\n⚡ Testing Performance...');

  await suite.runTest('Response Time: Assistant Chat < 2000ms', async () => {
    const startTime = Date.now();
    await suite.apiCall('/api/assistant/chat', {
      method: 'POST',
      data: { message: 'Hello, how can you help me?' },
    });
    const duration = Date.now() - startTime;

    if (duration > 2000) {
      throw new Error(`Response too slow: ${duration}ms (should be < 2000ms)`);
    }
  });

  await suite.runTest('Response Time: Product Search < 1000ms', async () => {
    const startTime = Date.now();
    await suite.apiCall('/api/products');
    const duration = Date.now() - startTime;

    if (duration > 1000) {
      throw new Error(`Response too slow: ${duration}ms (should be < 1000ms)`);
    }
  });

  await suite.runTest(
    'Response Time: Analytics Dashboard < 1500ms',
    async () => {
      const startTime = Date.now();
      await suite.apiCall('/api/analytics/dashboard');
      const duration = Date.now() - startTime;

      if (duration > 1500) {
        throw new Error(
          `Response too slow: ${duration}ms (should be < 1500ms)`
        );
      }
    }
  );
}

// MAIN TEST RUNNER
async function runAllTests() {
  const suite = new TestSuite();

  suite.log(COLORS.BOLD, '🧪 WEEK 5 COMPREHENSIVE TEST SUITE');
  suite.log(COLORS.BOLD, '='.repeat(50));
  suite.log(COLORS.YELLOW, `🌐 Testing API at: ${API_BASE_URL}`);
  suite.log(COLORS.YELLOW, `⏰ Started at: ${new Date().toLocaleString()}\n`);

  // Run all test categories
  await testIntentDetection(suite);
  await testIdentityProtection(suite);
  await testFunctionCalling(suite);
  await testAPIEndpoints(suite);
  await testIntegrationWorkflows(suite);
  await testPerformance(suite);

  // Print final summary
  suite.printSummary();

  // Exit with appropriate code
  process.exit(suite.failedTests > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error('Test suite failed to run:', error);
    process.exit(1);
  });
}

module.exports = { TestSuite, runAllTests };
