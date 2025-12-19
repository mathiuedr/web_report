// src/components/user/UserNav.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { removeAuthCookie } from '@/lib/auth'

export default function UserNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await removeAuthCookie()
    router.push('/auth')
  }

  const navItems = [
    { href: '/my-requests', label: 'Мои отзывы' },
    { href: '/new-request', label: 'Новый отзыв' },
    { href: '/answers', label: 'Ответы' },
  ]

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Обратная связь
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                    ${
                      pathname === item.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Выход
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
