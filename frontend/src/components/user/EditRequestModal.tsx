// src/components/user/EditRequestModal.tsx
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

interface EditRequestModalProps {
  request: Request
  onClose: () => void
  onUpdate: () => void
}

export default function EditRequestModal({
  request,
  onClose,
  onUpdate,
}: EditRequestModalProps) {
  const [requestText, setRequestText] = useState(request.text)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (requestText.length < 10 || requestText.length > 1000) {
      setError('Отзыв должен содержать от 10 до 1000 символов')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback/updateRequest`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: request.request_id,
          request_text: requestText,
        }),
      })

      if (response.status === 200) {
        onUpdate()
        onClose()
      } else {
        setError('Ошибка при обновлении отзыва')
      }
    } catch (err) {
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const charCount = requestText.length

  return (
    <Modal onClose={onClose} title="Редактировать отзыв">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div>
          <textarea
            rows={6}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            disabled={loading}
          />
          <div className="mt-2 text-sm text-right">
            <span className={charCount > 1000 ? 'text-red-600' : 'text-gray-500'}>
              {charCount} / 1000
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Отмена
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
