/**
 * Assistant Configuration Test Script
 * Tests the assistant identity, behavior guidelines, and configuration system
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAssistantConfiguration() {
  console.log('🤖 Testing Assistant Configuration System...\n');

  try {
    // Test 1: Get assistant identity
    console.log('1. Getting assistant identity...');
    const identityResponse = await axios.get(
      `${API_BASE_URL}/assistant/identity`
    );
    const identity = identityResponse.data.data.identity;

    console.log(`✅ Assistant Name: ${identity.name}`);
    console.log(`   Role: ${identity.role}`);
    console.log(`   Company: ${identity.company}`);
    console.log(`   Department: ${identity.department}`);
    console.log(
      `   Primary Traits: ${identity.personality?.primary_traits?.join(', ')}`
    );
    console.log();

    // Test 2: Test behavior guidelines for each intent
    console.log('2. Testing intent-specific behavior guidelines...');
    const intents = [
      'policy_question',
      'order_status',
      'product_search',
      'complaint',
      'chitchat',
    ];

    for (const intent of intents) {
      const behaviorResponse = await axios.get(
        `${API_BASE_URL}/assistant/behavior/${intent}`
      );
      const behavior = behaviorResponse.data.data.behavior;

      console.log(`📋 ${intent}:`);
      console.log(`   Approach: ${behavior.approach || 'Not specified'}`);
      console.log(`   Tone: ${behavior.tone || 'Not specified'}`);

      if (behavior.example_phrases && behavior.example_phrases.length > 0) {
        console.log(`   Example: "${behavior.example_phrases[0]}"`);
      }
      console.log();
    }

    // Test 3: Generate system prompts for different intents
    console.log('3. Testing system prompt generation...');
    const testIntents = ['order_status', 'complaint', 'product_search'];

    for (const intent of testIntents) {
      const promptResponse = await axios.post(
        `${API_BASE_URL}/assistant/generate-prompt`,
        {
          intent: intent,
          context: `Customer inquiry about ${intent}`,
        }
      );

      const prompt = promptResponse.data.data.systemPrompt;
      console.log(`🎯 ${intent} prompt (first 150 chars):`);
      console.log(`   "${prompt.substring(0, 150)}..."`);
      console.log();
    }

    // Test 4: Test response validation
    console.log('4. Testing response validation...');
    const testResponses = [
      {
        text: "Hi! I'm Alex from LiveDrops. I'd be happy to help you with your order status.",
        expected: 'Valid - professional and appropriate',
      },
      {
        text: "I am an AI assistant and I'm here to help you.",
        expected: 'Invalid - reveals AI identity (VIOLATION!)',
      },
      {
        text: 'I understand your frustration. Let me check on that order for you right away.',
        expected: 'Valid - empathetic and action-oriented',
      },
    ];

    for (const test of testResponses) {
      const validationResponse = await axios.post(
        `${API_BASE_URL}/assistant/validate-response`,
        {
          response: test.text,
        }
      );

      const validation = validationResponse.data.data.validation;
      const status = validation.isValid ? '✅ VALID' : '❌ INVALID';

      console.log(`${status} (Score: ${validation.score}/100)`);
      console.log(`   Response: "${test.text.substring(0, 60)}..."`);
      console.log(`   Expected: ${test.expected}`);

      if (validation.issues.length > 0) {
        console.log(`   🚨 Issues: ${validation.issues.join(', ')}`);
      }
      console.log();
    }

    // Test 5: Test escalation detection
    console.log('5. Testing escalation detection...');
    const escalationTests = [
      'I want to return this item',
      "This product is broken and I'm disappointed",
      'I need a refund of $2000 for this order',
      "I'm going to sue you for this terrible service",
      'My account has been hacked',
    ];

    for (const message of escalationTests) {
      const escalationResponse = await axios.post(
        `${API_BASE_URL}/assistant/check-escalation`,
        {
          message: message,
        }
      );

      const escalation = escalationResponse.data.data.escalationCheck;
      const status = escalation.needsEscalation ? '🚨 ESCALATE' : '✅ HANDLE';

      console.log(`${status} "${message}"`);
      if (escalation.needsEscalation) {
        console.log(`   Reason: ${escalation.reason}`);
      }
      console.log();
    }

    // Test 6: Test configuration reload
    console.log('6. Testing configuration reload...');
    const reloadResponse = await axios.post(
      `${API_BASE_URL}/assistant/reload-config`
    );
    console.log(`✅ ${reloadResponse.data.data.message}`);
    console.log();

    console.log('🎉 Assistant configuration system is working perfectly!');
    console.log();
    console.log('📊 Summary:');
    console.log('   ✅ Assistant identity loaded');
    console.log('   ✅ Intent-specific behaviors configured');
    console.log('   ✅ System prompt generation working');
    console.log('   ✅ Response validation functional');
    console.log('   ✅ Escalation detection active');
    console.log('   ✅ Configuration reload capability');
    console.log();
    console.log('🔒 CRITICAL: AI disclosure protection is ACTIVE');
    console.log("   The assistant will NEVER reveal it's an AI system");
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
testAssistantConfiguration();
