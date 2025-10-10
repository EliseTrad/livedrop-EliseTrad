import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner'
import { getOrderStatus, type Order } from '@/lib/api'
import { formatCurrency, formatDateTime } from '@/lib/format'

export function OrderStatusPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadOrder(id)
    }
  }, [id])

  const loadOrder = async (orderId: string) => {
    try {
      const orderData = await getOrderStatus(orderId)
      if (!orderData) {
        setError('Order not found')
      } else {
        setOrder(orderData)
      }
    } catch (err) {
      setError('Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100'
      case 'Shipped':
        return 'text-blue-600 bg-blue-100'
      case 'Packed':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">
          {error || 'The order you\'re looking for doesn\'t exist.'}
        </p>
        <Link to="/catalog">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Order #{order.orderId}
        </h1>
        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Order Date:</span>
              <span className="ml-2 font-medium">{formatDateTime(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-medium">{order.status}</span>
            </div>
            {order.carrier && (
              <div>
                <span className="text-gray-600">Carrier:</span>
                <span className="ml-2 font-medium">{order.carrier}</span>
              </div>
            )}
            {order.estimatedDelivery && (
              <div>
                <span className="text-gray-600">Expected Delivery:</span>
                <span className="ml-2 font-medium">
                  {formatDateTime(order.estimatedDelivery)}
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-600">Total:</span>
              <span className="ml-2 font-medium text-lg">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h2>
          <div className="space-y-4">
            {['Placed', 'Packed', 'Shipped', 'Delivered'].map((step, index) => {
              const isCompleted = ['Placed', 'Packed', 'Shipped', 'Delivered'].indexOf(order.status) >= index
              const isCurrent = order.status === step
              
              return (
                <div key={step} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    isCompleted ? 'bg-primary-600' : 'bg-gray-300'
                  } ${isCurrent ? 'ring-2 ring-primary-600 ring-offset-2' : ''}`} />
                  <span className={`${isCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h2>
        <div className="space-y-4">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4">
        <Link to="/catalog">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Button
          onClick={() => window.print()}
          variant="outline"
        >
          Print Order
        </Button>
      </div>
    </div>
  )
}