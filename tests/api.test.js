const request = require('supertest');
const app = require('../apps/api/src/server');

describe('API Endpoints', () => {
  it('GET /api/products returns array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/orders with valid data succeeds', async () => {
    const order = {
      customerId: 'demo-customer-id',
      items: [
        { productId: 'demo-product-id', name: 'Demo', price: 10, quantity: 1 },
      ],
      total: 10,
      status: 'PENDING',
      carrier: 'DHL',
      estimatedDelivery: '2025-10-20',
    };
    const res = await request(app).post('/api/orders').send(order);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('POST /api/orders with invalid data returns 400', async () => {
    const res = await request(app).post('/api/orders').send({});
    expect(res.status).toBe(400);
  });

  it('GET /api/analytics/dashboard-metrics returns correct format', async () => {
    const res = await request(app).get('/api/analytics/dashboard-metrics');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalRevenue');
  });

  it('Error responses are JSON', async () => {
    const res = await request(app).get('/api/products/invalid-id');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
