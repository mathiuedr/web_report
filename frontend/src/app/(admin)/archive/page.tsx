// src/app/(admin)/archive/page.tsx
import { getAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ArchiveList from '@/components/admin/ArchiveList'

export default async function ArchivePage() {
  const userId = await getAuthCookie()

  if (!userId) {
    redirect('/auth')
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Архив отзывов
      </h2>
      <ArchiveList userId={userId} />
    </div>
  )
}
