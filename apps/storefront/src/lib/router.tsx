
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/templates/Layout'
import { CatalogPage } from '@/pages/catalog'
import { ProductPage } from '@/pages/product'
import { CartPage } from '@/pages/cart'
import { CheckoutPage } from '@/pages/checkout'
import { OrderStatusPage } from '@/pages/order-status'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CatalogPage />,
      },
      {
        path: '/catalog',
        element: <CatalogPage />,
      },
      {
        path: '/p/:id',
        element: <ProductPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
      {
        path: '/order/:id',
        element: <OrderStatusPage />,
      },
    ],
  },
])