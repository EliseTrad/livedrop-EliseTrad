
import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { useCartStore } from '@/lib/store'
import { formatCurrency } from '@/lib/format'
import type { Product } from '@/lib/api'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem)
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image
    })
  }
  
  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <Link to={`/p/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {formatCurrency(product.price)}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 2).map(tag => (
              <span 
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {product.stockQty > 0 ? `${product.stockQty} in stock` : 'Out of stock'}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stockQty === 0}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}