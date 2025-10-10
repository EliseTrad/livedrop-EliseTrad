
import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { CartItemCard } from '@/components/molecules/CartItemCard'
import { useCartStore } from '@/lib/store'
import { formatCurrency } from '@/lib/format'

export function CartPage() {
  const { items, getTotal, getItemCount, clearCart } = useCartStore()
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link to="/catalog">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Shopping Cart ({getItemCount()} items)
        </h1>
        <Button
          variant="outline"
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(getTotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatCurrency(getTotal() * 0.08)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(getTotal() * 1.08)}</span>
              </div>
            </div>
          </div>

          <Link to="/checkout" className="block mt-6">
            <Button size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>

          <Link 
            to="/catalog" 
            className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}