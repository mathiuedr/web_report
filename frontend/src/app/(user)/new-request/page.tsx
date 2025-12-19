// src/app/(user)/new-request/page.tsx
import { getAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'
import RequestForm from '@/components/user/RequestForm'

export default async function NewRequestPage() {
  const userId = await getAuthCookie()

  if (!userId) {
    redirect('/auth')
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Создать новый отзыв
          </h2>
          <RequestForm userId={userId} />
        </div>
      </div>
    </div>
  )
}
