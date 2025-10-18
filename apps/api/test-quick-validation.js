const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function quickTest() {
  console.log('🧪 QUICK WEEK 5 VALIDATION TEST');
  console.log('='.repeat(40));

  let passed = 0;
  let total = 0;

  // Test 1: Intent Detection Sample
  total++;
  try {
    const response = await axios.post(`${API_BASE_URL}/api/assistant/chat`, {
      message: 'What is your return policy?',
    });

    if (
      response.data.success &&
      response.data.data.intent === 'policy_question'
    ) {
      console.log('✅ Intent Detection: policy_question');
      passed++;
    } else {
      console.log(
        `❌ Intent Detection: Expected policy_question, got ${response.data.data.intent}`
      );
    }
  } catch (error) {
    console.log('❌ Intent Detection: API Error');
  }

  // Test 2: Order Status Intent
  total++;
  try {
    const response = await axios.post(`${API_BASE_URL}/api/assistant/chat`, {
      message: 'Where is my order ORD123?',
    });

    if (response.data.success && response.data.data.intent === 'order_status') {
      console.log('✅ Order Status Intent: Detected correctly');
      passed++;
    } else {
      console.log(
        `❌ Order Status Intent: Expected order_status, got ${response.data.data.intent}`
      );
    }
  } catch (error) {
    console.log('❌ Order Status Intent: API Error');
  }

  // Test 3: Product Search Intent
  total++;
  try {
    const response = await axios.post(`${API_BASE_URL}/api/assistant/chat`, {
      message: 'Do you have wireless headphones?',
    });

    if (
      response.data.success &&
      response.data.data.intent === 'product_search'
    ) {
      console.log('✅ Product Search Intent: Detected correctly');
      passed++;
    } else {
      console.log(
        `❌ Product Search Intent: Expected product_search, got ${response.data.data.intent}`
      );
    }
  } catch (error) {
    console.log('❌ Product Search Intent: API Error');
  }

  // Test 4: Assistant Response Quality
  total++;
  try {
    const response = await axios.post(`${API_BASE_URL}/api/assistant/chat`, {
      message: 'Hello, how can you help me?',
    });

    if (
      response.data.success &&
      response.data.data.message &&
      response.data.data.message.length > 20
    ) {
      console.log('✅ Response Quality: Substantial response provided');
      passed++;
    } else {
      console.log('❌ Response Quality: Response too short or missing');
    }
  } catch (error) {
    console.log('❌ Response Quality: API Error');
  }

  // Test 5: Analytics Dashboard
  total++;
  try {
    const response = await axios.get(`${API_BASE_URL}/api/analytics/dashboard`);

    if (
      response.data.success &&
      response.data.data.totalRevenue &&
      response.data.data.totalOrders
    ) {
      console.log(
        `✅ Analytics Dashboard: $${response.data.data.totalRevenue}, ${response.data.data.totalOrders} orders`
      );
      passed++;
    } else {
      console.log('❌ Analytics Dashboard: Missing data');
    }
  } catch (error) {
    console.log('❌ Analytics Dashboard: API Error');
  }

  // Test 6: Products API
  total++;
  try {
    const response = await axios.get(`${API_BASE_URL}/api/products`);

    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      console.log(
        `✅ Products API: ${response.data.length} products available`
      );
      passed++;
    } else {
      console.log('❌ Products API: No products or wrong format');
    }
  } catch (error) {
    console.log('❌ Products API: API Error -', error.message);
  }

  // Test 7: Performance Check
  total++;
  try {
    const startTime = Date.now();
    const response = await axios.post(`${API_BASE_URL}/api/assistant/chat`, {
      message: 'Hello',
    });
    const duration = Date.now() - startTime;

    if (duration < 2000) {
      console.log(`✅ Performance: Response in ${duration}ms`);
      passed++;
    } else {
      console.log(`❌ Performance: Slow response ${duration}ms`);
    }
  } catch (error) {
    console.log('❌ Performance: API Error');
  }

  console.log('\n' + '='.repeat(40));
  console.log(
    `📊 RESULTS: ${passed}/${total} tests passed (${Math.round(
      (passed / total) * 100
    )}%)`
  );

  if (passed >= 6) {
    console.log('🎉 WEEK 5 IMPLEMENTATION IS WORKING GREAT!');
  } else if (passed >= 4) {
    console.log('⚠️  WEEK 5 IMPLEMENTATION IS MOSTLY WORKING');
  } else {
    console.log('🚨 WEEK 5 IMPLEMENTATION NEEDS ATTENTION');
  }

  console.log('='.repeat(40));
}

quickTest().catch(console.error);
