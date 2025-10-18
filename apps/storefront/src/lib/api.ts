export interface Product {
  id: string
  name: string
  title: string
  price: number
  image: string
  tags: string[]
  stockQty: number
  description?: string
  category?: string
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
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED'
  items: CartItem[]
  total: number
  createdAt: string
  orderDate?: string
  estimatedDelivery?: string
  carrier?: string
  customerEmail?: string
}

export interface User {
  email: string
  name?: string
}

// API Configuration
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000'

// API helper function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API Error: ${response.status} - ${error}`)
  }
  
  return response.json()
}

// Real API functions
export async function listProducts(): Promise<Product[]> {
  const data = await apiCall('/api/products?limit=30')
  return data.products.map((product: any) => ({
    ...product,
    title: product.name, // Map name to title for compatibility
    image: product.imageUrl, // Map imageUrl to image for compatibility
    tags: product.tags || [],
    stockQty: product.stock || 0,
  }))
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await apiCall(`/api/products/${id}`)
    return {
      ...product,
      title: product.name,
      image: product.imageUrl, // Map imageUrl to image for compatibility
      tags: product.tags || [],
      stockQty: product.stock || 0,
    }
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const data = await apiCall(`/api/products?search=${encodeURIComponent(query)}`)
  return data.products.map((product: any) => ({
    ...product,
    title: product.name,
    image: product.imageUrl, // Map imageUrl to image for compatibility
    tags: product.tags || [],
    stockQty: product.stock || 0,
  }))
}

// Place order now requires customerId
export async function placeOrder(cartItems: CartItem[], customerId: string): Promise<{ orderId: string }> {
  const orderData = {
    customerId,
    items: cartItems.map(item => ({
      productId: item.id,
      productName: item.title,
      quantity: item.quantity,
      price: item.price,
    })),
    total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
  };
  const data = await apiCall('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return { orderId: data.data.orderId };
}

export async function getOrderStatus(orderId: string): Promise<Order | null> {
  try {
    const data = await apiCall(`/api/orders/${orderId}`)
    return {
      ...data.data,
      items: data.data.items.map((item: any) => ({
        id: item.productId,
        title: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: '', // Will be populated from product data if needed
      })),
    }
  } catch (error) {
    console.error('Failed to fetch order:', error)
    return null
  }
}

export async function getCustomerOrders(email: string): Promise<Order[]> {
  try {
    const data = await apiCall(`/api/customers/${encodeURIComponent(email)}/orders`)
    return data.data.map((order: any) => ({
      ...order,
      items: order.items.map((item: any) => ({
        id: item.productId,
        title: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: '', // Will be populated from product data if needed
      })),
    }))
  } catch (error) {
    console.error('Failed to fetch customer orders:', error)
    return []
  }
}

export async function chatWithAssistant(message: string, sessionId?: string): Promise<{
  response: string
  sessionId: string
  intent: string
  confidence: number
}> {
  try {
    const data = await apiCall('/api/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    })
    return data.data
  } catch (error) {
    console.error('Failed to chat with assistant:', error)
    return {
      response: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
      sessionId: sessionId || 'session-' + Date.now(),
      intent: 'error',
      confidence: 1.0,
    }
  }
}

// Server-Sent Events for real-time order updates
export function streamOrderUpdates(orderId: string, onUpdate: (order: Order) => void): () => void {
  const eventSource = new EventSource(`${API_BASE_URL}/api/stream/order/${orderId}`)
  
  eventSource.onmessage = (event) => {
    try {
      const orderData = JSON.parse(event.data)
      onUpdate({
        ...orderData,
        items: orderData.items.map((item: any) => ({
          id: item.productId,
          title: item.productName,
          quantity: item.quantity,
          price: item.price,
          image: '', // Will be populated from product data if needed
        })),
      })
    } catch (error) {
      console.error('Failed to parse order update:', error)
    }
  }
  
  eventSource.onerror = (error) => {
    console.error('Order stream error:', error)
  }
  
  return () => eventSource.close()
}