// src/components/user/RequestList.tsx
'use client'

import { useState, useEffect } from 'react'
import RequestCard from './RequestCard'
import Alert from '@/components/ui/Alert'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface Request {
  request_id: number
  text: string
  created_at?: string
}

interface RequestListProps {
  userId: string
}

export default function RequestList({ userId }: RequestListProps) {
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
        <p className="text-gray-500">У вас пока нет отзывов</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <RequestCard
          key={request.request_id}
          request={request}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}
