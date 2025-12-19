// src/components/user/RequestCard.tsx
'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import EditRequestModal from './EditRequestModal'

interface Request {
  request_id: number
  text: string
  status: 'PENDING' | 'ANSWERED'
  created_at?: string
  answer?: string
  response_text?: string
}

interface RequestCardProps {
  request: Request
  onUpdate: () => void
}

export default function RequestCard({ request, onUpdate }: RequestCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const statusConfig = {
    PENDING: {
      label: 'Ожидает ответа',
      className: 'bg-yellow-100 text-yellow-800'
    },
    ANSWERED: {
      label: 'Отвечено',
      className: 'bg-green-100 text-green-800'
    }
  }

  const config = statusConfig[request.status]
  const answerText = request.answer || request.response_text

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
                {config.label}
              </span>
              <span className="text-sm text-gray-500">
                ID: {request.request_id}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Ваш отзыв
                </p>
                <p className="text-gray-900 whitespace-pre-wrap">{request.text}</p>
              </div>

              {answerText && request.status === 'ANSWERED' && (
                <div className="pt-3 border-t border-gray-200 bg-green-50 rounded-md p-3">
                  <p className="text-xs font-medium text-green-700 uppercase mb-1">
                    Ответ администратора
                  </p>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {answerText}
                  </p>
                </div>
              )}
            </div>

            {request.created_at && (
              <p className="mt-3 text-sm text-gray-500">
                {new Date(request.created_at).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
          {request.status === 'PENDING' && (
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(true)}
              className="ml-4"
            >
              Редактировать
            </Button>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <EditRequestModal
          request={request}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}
