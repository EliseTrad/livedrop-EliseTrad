
import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { useCartStore, useSupportStore } from '@/lib/store'
import { useState } from 'react'
import { UserLogin } from '@/components/UserLogin'

export function Header() {
  const getItemCount = useCartStore(state => state.getItemCount)
  const openSupport = useSupportStore(state => state.open)
  const [showLogin, setShowLogin] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Storefront" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">Storefront</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/catalog" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Catalog
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={openSupport}
              className="hidden sm:flex"
            >
              Ask Support
            </Button>
            
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm">
                Cart
                {getItemCount() > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full">
                    {getItemCount()}
                  </span>
                )}
              </Button>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="hidden sm:flex"
                  >
                    Sign In
                  </Button>
                </Link>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
    {showLogin && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowLogin(false)}
            aria-label="Close"
          >
            &times;
          </button>
          <UserLogin />
        </div>
      </div>
    )}
}