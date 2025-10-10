import { RouterProvider } from 'react-router-dom'
import { router } from '@/lib/router'
import { SupportPanel } from '@/components/organisms/SupportPanel'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RouterProvider router={router} />
      <SupportPanel />
    </div>
  )
}

export default App