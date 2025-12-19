
// src/app/(admin)/current-requests/page.tsx
import { getAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CurrentRequestsList from '@/components/admin/CurrentRequestsList'

export default async function CurrentRequestsPage() {
  const userId = await getAuthCookie()

  if (!userId) {
    redirect('/auth')
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Текущие отзывы
      </h2>
      <CurrentRequestsList userId={userId} />
    </div>
  )
}