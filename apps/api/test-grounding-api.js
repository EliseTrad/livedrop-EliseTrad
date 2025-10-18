/**
 * Test script for grounding API endpoints
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/assistant';

async function testGroundingAPI() {
  console.log('🌐 Testing Grounding API Endpoints...\n');

  try {
    // Test 1: Knowledge Base Stats
    console.log('📊 Test 1: Knowledge Base Stats');
    const statsResponse = await axios.get(`${BASE_URL}/knowledge-base/stats`);
    console.log('✅ Stats endpoint working');
    console.log(`Documents: ${statsResponse.data.data.stats.totalDocuments}`);
    console.log(`Categories: ${statsResponse.data.data.stats.categories}\n`);

    // Test 2: Categories
    console.log('📁 Test 2: Available Categories');
    const categoriesResponse = await axios.get(
      `${BASE_URL}/knowledge-base/categories`
    );
    console.log('✅ Categories endpoint working');
    console.log(`Found ${categoriesResponse.data.data.count} categories\n`);

    // Test 3: Ground Query
    console.log('🔍 Test 3: Ground Query');
    const groundResponse = await axios.post(`${BASE_URL}/ground-query`, {
      query: 'What is your return policy?',
      intent: 'policy_question',
    });
    console.log('✅ Grounding endpoint working');
    console.log(`Has Grounding: ${groundResponse.data.data.hasGrounding}`);
    console.log(`Citations: ${groundResponse.data.data.citations.length}`);
    console.log(
      `Confidence: ${(groundResponse.data.data.confidence * 100).toFixed(1)}%\n`
    );

    // Test 4: Search Documents
    console.log('🔎 Test 4: Search Documents');
    const searchResponse = await axios.post(`${BASE_URL}/search-documents`, {
      query: 'shipping information',
      maxResults: 3,
    });
    console.log('✅ Search endpoint working');
    console.log(`Found ${searchResponse.data.data.count} documents\n`);

    // Test 5: Get Specific Document
    console.log('📄 Test 5: Get Document by ID');
    const docResponse = await axios.get(
      `${BASE_URL}/knowledge-base/document/return-policy-001`
    );
    console.log('✅ Document retrieval working');
    console.log(`Retrieved: ${docResponse.data.data.document.title}\n`);

    console.log('🎉 All grounding API endpoints are working correctly!');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(
        '❌ Server not running. Please start the server with: npm start'
      );
    } else {
      console.error(
        '❌ API test failed:',
        error.response?.data || error.message
      );
    }
  }
}

// Run if server is available
testGroundingAPI();
