import { describe, it, expect, vi } from 'vitest'
import { supportEngine } from '@/assistant/engine'
import '@testing-library/jest-dom'

// Mock the API
vi.mock('@/lib/api', () => ({
  getOrderStatus: vi.fn(),
}))

describe('Support Engine', () => {
  it('should find best match for ground truth questions', async () => {
    const result = await supportEngine.processQuery('How do I create a buyer account?')
    
    expect(result.confidence).toBeGreaterThan(0.5)
    expect(result.answer).toContain('buyer account')
    expect(result.source).toBe('Q01')
  })

  it('should handle order ID queries', async () => {
    const { getOrderStatus } = await import('@/lib/api')
    vi.mocked(getOrderStatus).mockResolvedValue({
      orderId: 'ABC1234567',
      status: 'Shipped',
      items: [],
      total: 99.99,
      createdAt: '2024-01-01T00:00:00Z',
      carrier: 'FedEx',
      estimatedDelivery: '2024-01-03T00:00:00Z',
    })

    const result = await supportEngine.processQuery('What is the status of order ABC1234567?')
    
    expect(result.answer).toContain('...4567')
    expect(result.answer).toContain('Shipped')
    expect(result.source).toBe('Order System')
  })

  it('should refuse out-of-scope questions', async () => {
    const result = await supportEngine.processQuery('What is the weather today?')
    
    expect(result.confidence).toBeLessThan(0.3)
    expect(result.answer).toContain('don\'t have specific information')
  })

  it('should handle order not found', async () => {
    const { getOrderStatus } = await import('@/lib/api')
    vi.mocked(getOrderStatus).mockResolvedValue(null)

    const result = await supportEngine.processQuery('Check order NOTFOUND123')
    
    expect(result.answer).toContain('couldn\'t find an order')
    expect(result.answer).toContain('...D123')
  })
})