import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner'
import { ProductCard } from '@/components/molecules/ProductCard'
import { useCartStore } from '@/lib/store'
import { getProduct, listProducts, type Product } from '@/lib/api'
import { formatCurrency } from '@/lib/format'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    if (id) {
      loadProduct(id)
    }
  }, [id])

  const loadProduct = async (productId: string) => {
    try {
      const [productData, allProducts] = await Promise.all([
        getProduct(productId),
        listProducts()
      ])
      
      if (!productData) {
        setProduct(null)
        return
      }

      setProduct(productData)

      // Find related products by shared tags
      const related = allProducts
        .filter(p => 
          p.id !== productId && 
          p.tags.some(tag => productData.tags.includes(tag))
        )
        .slice(0, 3)
      
      setRelatedProducts(related)
    } catch (error) {
      console.error('Failed to load product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/catalog">
          <Button>Return to Catalog</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <nav className="text-sm breadcrumbs">
        <Link to="/catalog" className="text-primary-600 hover:text-primary-700">
          Catalog
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-2xl font-semibold text-primary-600 mt-2">
              {formatCurrency(product.price)}
            </p>
          </div>

          {product.description && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span 
                  key={tag}
                  className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                {product.stockQty > 0 
                  ? `${product.stockQty} items in stock` 
                  : 'Out of stock'
                }
              </span>
            </div>
            
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stockQty === 0}
              className="w-full"
            >
              {product.stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}