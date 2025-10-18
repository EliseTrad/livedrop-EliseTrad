const {
  classifyIntent,
} = require('../apps/api/src/assistant/intent-classifier');
const registry = require('../apps/api/src/assistant/function-registry');
const {
  handleAssistantQuery,
  validateCitations,
} = require('../apps/api/src/assistant/engine');

describe('Assistant Intent Detection', () => {
  it('Detects policy_question intent', () => {
    expect(classifyIntent('What is your return policy?')).toBe(
      'policy_question'
    );
  });
  it('Detects order_status intent', () => {
    expect(classifyIntent('Where is my order?')).toBe('order_status');
  });
  it('Detects product_search intent', () => {
    expect(classifyIntent('Show me shoes')).toBe('product_search');
  });
  it('Detects complaint intent', () => {
    expect(classifyIntent('I am not happy')).toBe('complaint');
  });
  it('Detects chitchat intent', () => {
    expect(classifyIntent('Hello!')).toBe('chitchat');
  });
  it('Detects off_topic intent', () => {
    expect(classifyIntent('Tell me a joke')).toBe('off_topic');
  });
  it('Detects violation intent', () => {
    expect(classifyIntent('You are stupid')).toBe('violation');
  });
});

describe('Assistant Identity', () => {
  it('Does not reveal AI model', async () => {
    const res = await handleAssistantQuery("What's your name?");
    expect(res.text).not.toMatch(
      /ChatGPT|Llama|AI|artificial intelligence|language model/i
    );
  });
  it('Responds naturally to robot question', async () => {
    const res = await handleAssistantQuery('Are you a robot?');
    expect(res.text).not.toMatch(/AI|robot|language model/i);
  });
  it('References company for creator', async () => {
    const res = await handleAssistantQuery('Who created you?');
    expect(res.text).toMatch(/LiveDrops|company|team/i);
  });
});

describe('Function Calling', () => {
  it('Calls getOrderStatus', async () => {
    const result = await registry.execute('getOrderStatus', 'demo-order-id');
    expect(result).toHaveProperty('status');
  });
  it('Calls searchProducts', async () => {
    const result = await registry.execute('searchProducts', 'shoes', 2);
    expect(Array.isArray(result)).toBe(true);
  });
  it('Calls getCustomerOrders', async () => {
    const result = await registry.execute(
      'getCustomerOrders',
      'demo@example.com'
    );
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('Citation Validation', () => {
  it('Validates correct citation', () => {
    const result = validateCitations('You can return items [Policy3.1]');
    expect(result.isValid).toBe(true);
    expect(result.validCitations).toContain('Policy3.1');
  });
  it('Flags invalid citation', () => {
    const result = validateCitations('This is not a real policy [Fake1.2]');
    expect(result.isValid).toBe(false);
    expect(result.invalidCitations).toContain('Fake1.2');
  });
});
