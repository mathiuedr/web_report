// src/components/admin/AdminRequestCard.tsx
'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import AnswerModal from './AnswerModal'
import DeleteConfirmModal from './DeleteConfirmModal'

interface Request {
  request_id: number
  text: string
  created_at?: string
}

interface AdminRequestCardProps {
  request: Request
  userId: string
  onUpdate: () => void
}

export default function AdminRequestCard({ 
  request, 
  userId,
  onUpdate 
}: AdminRequestCardProps) {
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-500">
                ID: {request.request_id}
              </span>
              {request.created_at && (
                <span className="text-sm text-gray-400">
                  {new Date(request.created_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
            <p className="text-gray-900 whitespace-pre-wrap">{request.text}</p>
          </div>
          <div className="ml-4 flex flex-col space-y-2">
            <button
              onClick={() => setIsAnswerModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors duration-200"
            >
              Ответить
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-colors duration-200"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      {isAnswerModalOpen && (
        <AnswerModal
          request={request}
          userId={userId}
          onClose={() => setIsAnswerModalOpen(false)}
          onSuccess={onUpdate}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          requestId={request.request_id}
          userId={userId}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={onUpdate}
        />
      )}
    </>
  )
}
