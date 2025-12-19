// src/app/(admin)/layout.tsx
import { getAuthCookie, isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userId = await getAuthCookie()
  const adminCheck = await isAdmin()
  
  if (!userId || !adminCheck) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
