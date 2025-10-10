import { useState, useEffect } from 'react'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { ProductCard } from '@/components/molecules/ProductCard'
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner'
import { listProducts, type Product } from '@/lib/api'
import { debounce } from '@/lib/format'

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name')

  const debouncedSearch = debounce((term: string) => {
    filterProducts(term, selectedTag, sortBy)
  }, 300)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, selectedTag, sortBy, debouncedSearch])

  const loadProducts = async () => {
    try {
      const data = await listProducts()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = (search: string, tag: string, sort: string) => {
    let filtered = [...products] // Create a copy to avoid mutating original

    // Filter by search term
    if (search) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Filter by tag
    if (tag) {
      filtered = filtered.filter(product => product.tags.includes(tag))
    }

    // Sort products - create a new sorted array
    let sorted = [...filtered]
    switch (sort) {
      case 'price-asc':
        sorted = sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted = sorted.sort((a, b) => b.price - a.price)
        break
      default:
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredProducts(sorted)
  }

  const allTags = Array.from(new Set(products.flatMap(p => p.tags))).sort()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Catalog</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus-ring focus:border-primary-500"
          >
            <option value="">All categories</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus-ring focus:border-primary-500"
          >
            <option value="name">Sort by Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setSelectedTag('')
              setSortBy('name')
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}