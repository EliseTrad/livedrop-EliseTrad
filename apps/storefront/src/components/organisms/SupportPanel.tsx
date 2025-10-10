import React, { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner'
import { useSupportStore } from '@/lib/store'
import { supportEngine } from '@/assistant/engine'

export function SupportPanel() {
  const { isOpen, close } = useSupportStore()
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [source, setSource] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return

    setLoading(true)
    try {
      const result = await supportEngine.processQuery(query.trim())
      setResponse(result.answer)
      setSource(result.source)
    } catch (error) {
      setResponse('Sorry, I encountered an error. Please try again or contact our support team.')
      setSource('Error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    close()
    setQuery('')
    setResponse(null)
    setSource(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl animate-slide-in">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ask Support</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              aria-label="Close support panel"
            >
              ×
            </Button>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="How can we help you?"
                placeholder="Ask about orders, returns, products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />
              
              <Button
                type="submit"
                disabled={!query.trim() || loading}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  'Ask Question'
                )}
              </Button>
            </form>

            {response && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-gray-900">Answer:</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{response}</p>
                {source && source !== 'Error' && source !== 'N/A' && (
                  <p className="text-xs text-gray-500">Source: {source}</p>
                )}
              </div>
            )}

            <div className="text-xs text-gray-500 space-y-2">
              <p><strong>Tips:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ask about order status by including your order ID</li>
                <li>Questions about returns, shipping, or account issues</li>
                <li>Product information and availability</li>
              </ul>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              Need more help? <a href="#" className="text-primary-600 hover:text-primary-700">Contact human support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}