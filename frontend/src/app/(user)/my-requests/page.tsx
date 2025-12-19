// src/app/(user)/my-requests/page.tsx
import { getAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'
import RequestList from '@/components/user/RequestList'
import Link from 'next/link'

export default async function MyRequestsPage() {
  const userId = await getAuthCookie()

  if (!userId) {
    redirect('/auth')
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Мои отзывы</h2>
        <Link
          href="/new-request"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          + Создать новый отзыв
        </Link>
      </div>
      <RequestList userId={userId} />
    </div>
  )
}
