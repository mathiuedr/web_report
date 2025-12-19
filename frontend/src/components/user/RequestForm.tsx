// src/components/user/RequestForm.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface RequestFormProps {
  userId: string
}

export default function RequestForm({ userId }: RequestFormProps) {
  const [requestText, setRequestText] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Валидация
    if (requestText.length < 10) {
      setError('Отзыв должен содержать минимум 10 символов')
      return
    }

    if (requestText.length > 1000) {
      setError('Отзыв не должен превышать 1000 символов')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback/createRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_text: requestText,
          user_id: userId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess(`Отзыв #${data.request_id} успешно создан!`)
        setRequestText('')
        
        // Редирект через 2 секунды
        setTimeout(() => {
          router.push('/my-requests')
        }, 2000)
      } else {
        setError('Ошибка при создании отзыва')
      }
    } catch (err) {
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const charCount = requestText.length
  const isValid = charCount >= 10 && charCount <= 1000

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div>
        <label
          htmlFor="request-text"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Текст отзыва
        </label>
        <textarea
          id="request-text"
          name="request-text"
          rows={8}
          className={`
            block w-full rounded-md shadow-sm sm:text-sm
            border-gray-300 focus:border-blue-500 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${!isValid && charCount > 0 ? 'border-red-300' : ''}
          `}
          placeholder="Опишите вашу проблему или предложение..."
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          disabled={loading}
          required
        />
        <div className="mt-2 flex justify-between text-sm">
          <span className={charCount < 10 ? 'text-red-600' : 'text-gray-500'}>
            Минимум 10 символов
          </span>
          <span
            className={
              charCount > 1000
                ? 'text-red-600'
                : charCount > 900
                ? 'text-yellow-600'
                : 'text-gray-500'
            }
          >
            {charCount} / 1000
          </span>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button type="submit" disabled={loading || !isValid}>
          {loading ? 'Отправка...' : 'Отправить отзыв'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/my-requests')}
          disabled={loading}
        >
          Отмена
        </Button>
      </div>
    </form>
  )
}
