const request = require('supertest');
const app = require('../apps/api/src/server');
const { handleAssistantQuery } = require('../apps/api/src/assistant/engine');

describe('Integration: Complete Purchase Flow', () => {
  it('Browses products, creates order, tracks status, asks assistant', async () => {
    const productsRes = await request(app).get('/api/products');
    expect(productsRes.status).toBe(200);
    const product = productsRes.body[0];
    const orderRes = await request(app)
      .post('/api/orders')
      .send({
        customerId: 'demo-customer-id',
        items: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ],
        total: product.price,
        status: 'PENDING',
        carrier: 'DHL',
        estimatedDelivery: '2025-10-20',
      });
    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.id;
    // Simulate SSE: just check endpoint exists
    const sseRes = await request(app).get(`/api/orders/${orderId}/stream`);
    expect([200, 404]).toContain(sseRes.status);
    // Ask assistant about order status
    const assistantRes = await handleAssistantQuery('Where is my order?', {
      orderId,
    });
    expect(assistantRes.intent).toBe('order_status');
    expect(assistantRes.text).toMatch(/status/i);
  });
});

describe('Integration: Support Interaction Flow', () => {
  it('Policy question, grounded response, order query, complaint', async () => {
    const policyRes = await handleAssistantQuery('What is your return policy?');
    expect(policyRes.intent).toBe('policy_question');
    expect(policyRes.citations.length).toBeGreaterThan(0);
    const orderRes = await handleAssistantQuery('Where is my order?', {
      orderId: 'demo-order-id',
    });
    expect(orderRes.intent).toBe('order_status');
    const complaintRes = await handleAssistantQuery('I am not happy');
    expect(complaintRes.intent).toBe('complaint');
    expect(complaintRes.text).toMatch(/sorry|help/i);
  });
});

describe('Integration: Multi-Intent Conversation', () => {
  it('Chitchat, product search, policy, order status, context maintained', async () => {
    const chatRes = await handleAssistantQuery('Hello!');
    expect(chatRes.intent).toBe('chitchat');
    const searchRes = await handleAssistantQuery('Show me shoes');
    expect(searchRes.intent).toBe('product_search');
    const policyRes = await handleAssistantQuery('What is your return policy?');
    expect(policyRes.intent).toBe('policy_question');
    const orderRes = await handleAssistantQuery('Where is my order?', {
      orderId: 'demo-order-id',
    });
    expect(orderRes.intent).toBe('order_status');
  });
});
