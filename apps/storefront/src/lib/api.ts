export interface Product {
  id: string
  title: string
  price: number
  image: string
  tags: string[]
  stockQty: number
  description?: string
}

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

export interface Order {
  orderId: string
  status: 'Placed' | 'Packed' | 'Shipped' | 'Delivered'
  items: CartItem[]
  total: number
  createdAt: string
  estimatedDelivery?: string
  carrier?: string
}

// Mock API functions
export async function listProducts(): Promise<Product[]> {
  const response = await fetch('/mock-catalog.json')
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await listProducts()
  return products.find(p => p.id === id) || null
}

export async function placeOrder(cartItems: CartItem[]): Promise<{ orderId: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const orderId = generateOrderId()
  const order: Order = {
    orderId,
    status: 'Placed',
    items: cartItems,
    total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    createdAt: new Date().toISOString(),
  }
  
  // Store in localStorage for demo
  const orders = getStoredOrders()
  orders[orderId] = order
  localStorage.setItem('orders', JSON.stringify(orders))
  
  return { orderId }
}

export async function getOrderStatus(orderId: string): Promise<Order | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const orders = getStoredOrders()
  const order = orders[orderId]
  
  if (!order) return null
  
  // Simulate order progress
  const now = Date.now()
  const created = new Date(order.createdAt).getTime()
  const elapsed = now - created
  
  if (elapsed > 5 * 60 * 1000) { // 5 minutes
    order.status = 'Delivered'
  } else if (elapsed > 3 * 60 * 1000) { // 3 minutes
    order.status = 'Shipped'
    order.carrier = 'FedEx'
    order.estimatedDelivery = new Date(now + 24 * 60 * 60 * 1000).toISOString()
  } else if (elapsed > 1 * 60 * 1000) { // 1 minute
    order.status = 'Packed'
  }
  
  // Update stored order
  orders[orderId] = order
  localStorage.setItem('orders', JSON.stringify(orders))
  
  return order
}

// Helper functions
function generateOrderId(): string {
  return Math.random().toString(36).substring(2, 12).toUpperCase()
}

function getStoredOrders(): Record<string, Order> {
  try {
    return JSON.parse(localStorage.getItem('orders') || '{}')
  } catch {
    return {}
  }
}