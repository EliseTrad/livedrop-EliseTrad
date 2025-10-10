
import { Button } from '@/components/atoms/Button'
import { useCartStore } from '@/lib/store'
import { formatCurrency } from '@/lib/format'
import type { CartItem } from '@/lib/api'

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCartStore()
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(item.id)
    } else {
      updateQuantity(item.id, newQuantity)
    }
  }
  
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
      <img
        src={item.image}
        alt={item.title}
        className="w-16 h-16 object-cover rounded"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
        <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          aria-label="Decrease quantity"
        >
          -
        </Button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </Button>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-900">
          {formatCurrency(item.price * item.quantity)}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Remove
        </Button>
      </div>
    </div>
  )
}