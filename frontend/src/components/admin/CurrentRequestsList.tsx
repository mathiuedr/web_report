// src/components/admin/CurrentRequestsList.tsx
'use client'

import { useState, useEffect } from 'react'
import AdminRequestCard from './AdminRequestCard'
import Alert from '@/components/ui/Alert'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface Request {
  request_id: number
  text: string
  created_at?: string
}

interface CurrentRequestsListProps {
  userId: string
}

export default function CurrentRequestsList({ userId }: CurrentRequestsListProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [userId])

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/feedback/getCurrentRequests?user_id=${userId}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      } else {
        setError('Ошибка загрузки отзывов')
      }
    } catch (err) {
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = () => {
    setLoading(true)
    fetchRequests()
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-600">Загрузка...</p>
      </div>
    )
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">Нет текущих отзывов</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white px-4 py-3 rounded-lg shadow mb-4">
        <p className="text-sm text-gray-700">
          Всего отзывов: <span className="font-semibold">{requests.length}</span>
        </p>
      </div>
      {requests.map((request) => (
        <AdminRequestCard
          key={request.request_id}
          request={request}
          userId={userId}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}
