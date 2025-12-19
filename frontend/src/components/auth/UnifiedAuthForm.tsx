// src/components/auth/UnifiedAuthForm.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { setAuthCookie } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default function UnifiedAuthForm() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      })

      if (response.status === 200) {
        const data = await response.json()
        
        // Сохранить user_id в cookies
        await setAuthCookie(data.user_id)
        
        // Определить роль пользователя (можно расширить логику)
        const isAdmin = login.includes('admin') // Временная логика
        
        // Редирект в зависимости от роли
        if (isAdmin) {
          router.push('/current-requests')
        } else {
          router.push('/my-requests')
        }
      } else if (response.status === 500) {
        setError('Неверный пароль')
      }
    } catch (err) {
      setError('Ошибка подключения к серверу. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && <Alert variant="error">{error}</Alert>}
      
      <div className="space-y-4">
        <Input
          id="login"
          name="login"
          type="text"
          autoComplete="username"
          required
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          disabled={loading}
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        fullWidth
        disabled={loading}
      >
        {loading ? 'Загрузка...' : 'Войти / Зарегистрироваться'}
      </Button>
    </form>
  )
}
