
import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'

interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  )
}