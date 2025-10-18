/**
 * Test client for Week 3 LLM integration
 * Tests the new /generate endpoint for Week 5 backend integration
 */

const axios = require('axios');

class LLMClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Test the health endpoint
   */
  async testHealth() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Generate text completion
   */
  async generate(prompt, options = {}) {
    try {
      const payload = {
        prompt,
        max_tokens: options.maxTokens || 150,
        temperature: options.temperature || 0.7,
      };

      const response = await axios.post(`${this.baseUrl}/generate`, payload);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Test multiple prompts to verify assistant behavior
   */
  async runTests() {
    console.log('🤖 Testing Week 3 LLM Integration...\n');

    // Test 1: Health Check
    console.log('🏥 Test 1: Health Check');
    const healthResult = await this.testHealth();
    if (healthResult.success) {
      console.log('✅ Health check passed');
      console.log(`Service: ${healthResult.data.service}`);
      console.log(
        `Available endpoints: ${Object.keys(healthResult.data.endpoints).join(
          ', '
        )}\n`
      );
    } else {
      console.log('❌ Health check failed:', healthResult.error);
      return;
    }

    // Test 2: Basic Generation
    console.log('💬 Test 2: Basic Text Generation');
    const testPrompts = [
      'Hello, I need help with my order.',
      'What are your return policies?',
      'Can you help me track my package?',
      "I want to exchange an item that doesn't fit.",
      'Thank you for your help!',
    ];

    for (let i = 0; i < testPrompts.length; i++) {
      const prompt = testPrompts[i];
      console.log(`\nPrompt ${i + 1}: "${prompt}"`);

      const result = await this.generate(prompt);
      if (result.success) {
        console.log(`✅ Response: "${result.data.response}"`);
        console.log(`Model: ${result.data.metadata.model}`);
        console.log(`Temperature: ${result.data.metadata.temperature}`);
      } else {
        console.log(`❌ Generation failed:`, result.error);
      }
    }

    // Test 3: Parameter Validation
    console.log('\n🔧 Test 3: Parameter Validation');

    // Test invalid prompt
    console.log('\nTesting empty prompt...');
    const emptyResult = await this.generate('');
    if (!emptyResult.success) {
      console.log('✅ Empty prompt validation working');
    } else {
      console.log('❌ Empty prompt validation failed');
    }

    // Test invalid max_tokens
    console.log('\nTesting invalid max_tokens...');
    const invalidTokensResult = await this.generate('Test prompt', {
      maxTokens: 1000,
    });
    if (!invalidTokensResult.success) {
      console.log('✅ max_tokens validation working');
    } else {
      console.log('⚠️ max_tokens validation might need attention');
    }

    // Test 4: Assistant Identity
    console.log('\n🎭 Test 4: Assistant Identity Check');
    const identityPrompts = [
      "What's your name?",
      'Are you an AI?',
      'What company do you work for?',
    ];

    for (const prompt of identityPrompts) {
      console.log(`\nIdentity test: "${prompt}"`);
      const result = await this.generate(prompt);
      if (result.success) {
        const response = result.data.response.toLowerCase();
        // Check if response mentions being an AI (should not)
        if (
          response.includes('ai') ||
          response.includes('artificial') ||
          response.includes('language model')
        ) {
          console.log(
            '⚠️ Response may reveal AI nature:',
            result.data.response
          );
        } else {
          console.log(
            '✅ Assistant identity maintained:',
            result.data.response
          );
        }
      }
    }

    console.log('\n🎉 LLM Integration testing completed!');
  }
}

// Export for use in other modules
module.exports = LLMClient;

// If run directly, test with placeholder URL
if (require.main === module) {
  console.log('📝 LLM Test Client Ready');
  console.log('');
  console.log('To test your Week 3 LLM integration:');
  console.log('1. Update your Colab notebook with the /generate endpoint');
  console.log('2. Get your ngrok URL from Colab');
  console.log('3. Run: node test-llm.js <your-ngrok-url>');
  console.log('');
  console.log('Example: node test-llm.js https://abc123.ngrok.io');

  // Check if URL provided as command line argument
  const url = process.argv[2];
  if (url) {
    console.log(`\nTesting with URL: ${url}`);
    const client = new LLMClient(url);
    client.runTests().catch((error) => {
      console.error('❌ Test failed:', error.message);
    });
  }
}
