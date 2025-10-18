import { UserLogin } from '@/components/UserLogin';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <UserLogin />
      </div>
    </div>
  );
}
