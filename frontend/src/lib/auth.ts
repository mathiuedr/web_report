// src/lib/auth.ts
'use server'

import { cookies } from 'next/headers'

const ADMIN_USER_ID = '11111111-1111-1111-1111-111111111111'

export async function setAuthCookie(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set('user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 неделя
    path: '/',
  })
}

export async function setAdminCookie(isAdmin: string) {
  const cookieStore = await cookies()
  cookieStore.set('is_admin', isAdmin, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('user_id')?.value
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value
  return userId === ADMIN_USER_ID
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('user_id')
  cookieStore.delete('is_admin')
}

export async function isAuthenticated(): Promise<boolean> {
  const userId = await getAuthCookie()
  return !!userId
}
