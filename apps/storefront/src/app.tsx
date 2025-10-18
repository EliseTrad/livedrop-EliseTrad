import { RouterProvider } from 'react-router-dom';
import { router } from '@/lib/router';
import { SupportPanel } from '@/components/organisms/SupportPanel';
import { UserProvider } from '@/lib/user-context';

function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <RouterProvider router={router} />
        <SupportPanel />
      </div>
    </UserProvider>
  );
}

export default App;