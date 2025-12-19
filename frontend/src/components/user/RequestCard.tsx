// src/components/user/RequestCard.tsx
'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import EditRequestModal from './EditRequestModal'

interface Request {
  request_id: number
  text: string
  created_at?: string
}

interface RequestCardProps {
  request: Request
  onUpdate: () => void
}

export default function RequestCard({ request, onUpdate }: RequestCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Ожидает ответа
              </span>
              <span className="text-sm text-gray-500">
                ID: {request.request_id}
              </span>
            </div>
            <p className="text-gray-900 whitespace-pre-wrap">{request.text}</p>
            {request.created_at && (
              <p className="mt-2 text-sm text-gray-500">
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
          <Button
            variant="secondary"
            onClick={() => setIsEditModalOpen(true)}
            className="ml-4"
          >
            Редактировать
          </Button>
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
