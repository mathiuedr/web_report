// src/components/admin/DeleteConfirmModal.tsx
'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface DeleteConfirmModalProps {
  requestId: number
  userId: string
  onClose: () => void
  onSuccess: () => void
}

export default function DeleteConfirmModal({
  requestId,
  userId,
  onClose,
  onSuccess,
}: DeleteConfirmModalProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback/deleteRequest`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: requestId,
          user_id: userId,
        }),
      })

      if (response.status === 200) {
        onSuccess()
        onClose()
      } else {
        setError('Ошибка при удалении отзыва')
      }
    } catch (err) {
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose} title="Подтверждение удаления">
      <div className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <p className="text-sm text-gray-600">
          Вы уверены, что хотите удалить отзыв #{requestId}? Это действие нельзя отменить.
        </p>

        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose} 
            disabled={loading}
          >
            Отмена
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? 'Удаление...' : 'Удалить'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
