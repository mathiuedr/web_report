// src/components/admin/AnswerModal.tsx
'use client'

import { useState, FormEvent } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface Request {
  request_id: number
  text: string
}

interface AnswerModalProps {
  request: Request
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export default function AnswerModal({
  request,
  userId,
  onClose,
  onSuccess,
}: AnswerModalProps) {
  const [responseText, setResponseText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (responseText.length < 10) {
      setError('Ответ должен содержать минимум 10 символов')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback/answerToRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: request.request_id.toString(),
          response_text: responseText,
          user_id: userId,
        }),
      })

      if (response.status === 200) {
        onSuccess()
        onClose()
      } else {
        setError('Ошибка при отправке ответа')
      }
    } catch (err) {
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose} title="Ответить на отзыв">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Текст отзыва
          </label>
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {request.text}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ваш ответ
          </label>
          <textarea
            rows={6}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
            placeholder="Введите ответ..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            disabled={loading}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Минимум 10 символов
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose} 
            disabled={loading}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить ответ'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
