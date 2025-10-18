
import { useState, useEffect } from 'react'
import { Layout } from '../components/templates/Layout'

interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  activeCustomers: number
  averageOrderValue: number
  recentOrders: Array<{
    orderId: string
    customerEmail: string
    total: number
    status: string
    createdAt: string
  }>
  dailyRevenue: Array<{
    date: string
    revenue: number
    orderCount: number
  }>
}

interface AssistantAnalytics {
  totalConversations: number
  intentDistribution: Record<string, number>
  averageResponseTime: number
  functionCalls: Record<string, number>
  topQueries: Array<{
    query: string
    count: number
    intent: string
  }>
}

interface SystemHealth {
  apiStatus: 'healthy' | 'degraded' | 'down'
  dbStatus: 'healthy' | 'degraded' | 'down'
  assistantStatus: 'healthy' | 'degraded' | 'down'
  activeConnections: number
  responseTime: number
  uptime: string
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [analytics, setAnalytics] = useState<AssistantAnalytics | null>(null)
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'health'>('overview')

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load business metrics
      const metricsResponse = await fetch('http://localhost:5000/api/analytics/dashboard')
      const metricsData = await metricsResponse.json()
      setMetrics(metricsData.data)

      // Load assistant analytics
      const analyticsResponse = await fetch('http://localhost:5000/api/analytics/assistant')
      const analyticsData = await analyticsResponse.json()
      setAnalytics(analyticsData.data)

      // Load system health
      const healthResponse = await fetch('http://localhost:5000/api/health')
      const healthData = await healthResponse.json()
      setHealth({
        apiStatus: healthData.status === 'ok' ? 'healthy' : 'down',
        dbStatus: healthData.database ? 'healthy' : 'down',
        assistantStatus: healthData.assistant ? 'healthy' : 'down',
        activeConnections: healthData.connections || 0,
        responseTime: healthData.responseTime || 0,
        uptime: healthData.uptime || '0s'
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading && !metrics) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor your e-commerce platform performance and analytics</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Business Overview' },
              { id: 'analytics', label: 'Assistant Analytics' },
              { id: 'health', label: 'System Health' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Business Overview Tab */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Active Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.activeCustomers}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.averageOrderValue)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Revenue Trend</h3>
              <div className="space-y-2">
                {metrics.dailyRevenue.slice(-7).map((day) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{formatDate(day.date)}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{day.orderCount} orders</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(day.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.recentOrders.slice(0, 10).map((order) => (
                      <tr key={order.orderId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customerEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Assistant Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Assistant Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Conversations</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalConversations}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Avg. Response Time</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics.averageResponseTime}ms</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Function Calls</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {Object.values(analytics.functionCalls).reduce((sum, count) => sum + count, 0)}
                </p>
              </div>
            </div>

            {/* Intent Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Intent Distribution</h3>
              <div className="space-y-3">
                {Object.entries(analytics.intentDistribution).map(([intent, count]) => (
                  <div key={intent} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{intent.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{
                            width: `${(count / Math.max(...Object.values(analytics.intentDistribution))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Function Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Function Usage</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analytics.functionCalls).map(([funcName, count]) => (
                  <div key={funcName} className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{funcName.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Queries */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top User Queries</h3>
              <div className="space-y-3">
                {analytics.topQueries.slice(0, 10).map((query, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{query.query}</p>
                      <p className="text-xs text-gray-500 capitalize">{query.intent.replace('_', ' ')}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{query.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Health Tab */}
        {activeTab === 'health' && health && (
          <div className="space-y-6">
            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">API Status</h3>
                    <p className="text-lg font-semibold capitalize">{health.apiStatus}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    health.apiStatus === 'healthy' ? 'bg-green-500' : 
                    health.apiStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Database Status</h3>
                    <p className="text-lg font-semibold capitalize">{health.dbStatus}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    health.dbStatus === 'healthy' ? 'bg-green-500' : 
                    health.dbStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Assistant Status</h3>
                    <p className="text-lg font-semibold capitalize">{health.assistantStatus}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    health.assistantStatus === 'healthy' ? 'bg-green-500' : 
                    health.assistantStatus === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Active Connections</h3>
                <p className="text-3xl font-bold text-gray-900">{health.activeConnections}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Response Time</h3>
                <p className="text-3xl font-bold text-gray-900">{health.responseTime}ms</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Uptime</h3>
                <p className="text-3xl font-bold text-gray-900">{health.uptime}</p>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Environment</p>
                  <p className="text-sm font-medium text-gray-900">Development</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Deployment</p>
                  <p className="text-sm font-medium text-gray-900">Today, 2:30 PM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">API Version</p>
                  <p className="text-sm font-medium text-gray-900">v1.0.0</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Database Version</p>
                  <p className="text-sm font-medium text-gray-900">MongoDB 7.0</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
    </Layout>
  )
}