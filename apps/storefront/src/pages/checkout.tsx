import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner'
import { useCartStore } from '@/lib/store'
import { placeOrder } from '@/lib/api'
import { formatCurrency } from '@/lib/format'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const handlePlaceOrder = async () => {
    if (items.length === 0) return

    setLoading(true)
    try {
      const { orderId } = await placeOrder(items)
      clearCart()
      navigate(`/order/${orderId}`)
    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items to Checkout</h1>
        <p className="text-gray-600 mb-6">Your cart is empty.</p>
        <Button onClick={() => navigate('/catalog')}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  const subtotal = getTotal()
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
        
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
        <p className="text-gray-600 mb-4">
          This is a demo checkout. No actual payment will be processed.
        </p>
        
        <Button
          size="lg"
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Placing Order...</span>
            </div>
          ) : (
            `Place Order - ${formatCurrency(total)}`
          )}
        </Button>
      </div>
    </div>
  )
}