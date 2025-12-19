// src/app/auth/page.tsx
import UnifiedAuthForm from '@/components/auth/UnifiedAuthForm'

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Система обратной связи
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Введите свои данные для входа или регистрации
          </p>
        </div>
        <UnifiedAuthForm />
      </div>
    </div>
  )
}
