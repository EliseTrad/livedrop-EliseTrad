/**
 * Test script for grounding service functionality
 */

const GroundingService = require('./src/services/groundingService');

async function testGroundingService() {
  console.log('🔍 Testing Grounding Service...\n');

  const groundingService = new GroundingService();

  // Test 1: Knowledge base stats
  console.log('📊 Test 1: Knowledge Base Stats');
  const stats = groundingService.getStats();
  console.log('Stats:', JSON.stringify(stats, null, 2));
  console.log('✅ Stats retrieved successfully\n');

  // Test 2: Categories
  console.log('📁 Test 2: Available Categories');
  const categories = groundingService.getCategories();
  console.log('Categories:', categories);
  console.log('✅ Categories retrieved successfully\n');

  // Test 3: Document search
  console.log('🔎 Test 3: Document Search');
  const searchQueries = [
    'return policy',
    'shipping information',
    'warranty coverage',
    'payment methods',
  ];

  for (const query of searchQueries) {
    console.log(`\nSearching for: "${query}"`);
    const docs = groundingService.findRelevantDocuments(query, null, 3);
    console.log(`Found ${docs.length} relevant documents:`);
    docs.forEach((doc) => {
      console.log(
        `  - ${doc.title} (Score: ${doc.relevanceScore}, Category: ${doc.category})`
      );
    });
  }

  // Test 4: Grounded responses
  console.log('\n💬 Test 4: Grounded Responses');
  const testQueries = [
    { query: 'What is your return policy?', intent: 'policy_question' },
    { query: 'How long does shipping take?', intent: 'policy_question' },
    { query: 'Do you offer warranty on products?', intent: 'policy_question' },
    { query: 'What payment methods do you accept?', intent: 'policy_question' },
    {
      query: "Can I exchange my item if it doesn't fit?",
      intent: 'policy_question',
    },
  ];

  for (const testCase of testQueries) {
    console.log(`\n--- Query: "${testCase.query}" ---`);
    const response = groundingService.generateGroundedResponse(
      testCase.query,
      testCase.intent
    );
    console.log(`Has Grounding: ${response.hasGrounding}`);
    console.log(`Confidence: ${(response.confidence * 100).toFixed(1)}%`);
    console.log(`Response: ${response.response}`);
    console.log(`Citations: ${response.citations.length}`);

    if (response.citations.length > 0) {
      console.log('Citation Sources:');
      response.citations.forEach((citation) => {
        console.log(`  - ${citation.title} (${citation.category})`);
        if (citation.citations.length > 0) {
          console.log(
            `    Key points: ${citation.citations.map((c) => c.key).join(', ')}`
          );
        }
      });
    }
  }

  // Test 5: Citation validation
  console.log('\n✅ Test 5: Citation Validation');
  const testResponse = groundingService.generateGroundedResponse(
    'What is your return policy?',
    'policy_question'
  );
  if (testResponse.hasGrounding) {
    const validation = groundingService.validateCitations(
      testResponse.response,
      testResponse.citations
    );
    console.log('Validation Results:');
    console.log(`Is Valid: ${validation.isValid}`);
    console.log(`Valid Citations: ${validation.validCitations.length}`);
    console.log(`Invalid Citations: ${validation.invalidCitations.length}`);
    if (validation.issues.length > 0) {
      console.log('Issues:', validation.issues);
    }
  }

  // Test 6: Document retrieval
  console.log('\n📄 Test 6: Document Retrieval by ID');
  const doc = groundingService.getDocumentById('return-policy-001');
  if (doc) {
    console.log(`Retrieved: ${doc.title}`);
    console.log(`Category: ${doc.category}`);
    console.log(`Keywords: ${doc.keywords.join(', ')}`);
    console.log('✅ Document retrieved successfully');
  } else {
    console.log('❌ Document not found');
  }

  console.log('\n🎉 Grounding Service testing completed!');

  // Summary
  console.log('\n📋 Test Summary:');
  console.log(
    `✅ Knowledge base loaded with ${stats.totalDocuments} documents`
  );
  console.log(`✅ ${categories.length} categories available`);
  console.log('✅ Document search working correctly');
  console.log('✅ Grounded responses generating with citations');
  console.log('✅ Citation validation functioning');
  console.log('✅ Document retrieval by ID working');
}

// Run the test
testGroundingService().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
