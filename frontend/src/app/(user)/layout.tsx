// src/app/(user)/layout.tsx
import { getAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'
import UserNav from '@/components/user/UserNav'

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userId = await getAuthCookie()
  
  if (!userId) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNav />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
