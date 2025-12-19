// src/components/user/RequestList.tsx
'use client'

import { useState, useEffect } from 'react'
import RequestCard from './RequestCard'
import Alert from '@/components/ui/Alert'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface Request {
  request_id: number
  text: string
  status: 'PENDING' | 'ANSWERED'
  created_at?: string
  answer?: string
  response_text?: string
}

interface Answer {
  request_id: number
  answer: string
}

interface RequestListProps {
  userId: string
}

export default function RequestList({ userId }: RequestListProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'active' | 'answered'>('active')

  useEffect(() => {
    fetchRequests()
  }, [userId])

  const fetchRequests = async () => {
    try {
      // Получаем список отзывов
      const requestsResponse = await fetch(
        `${API_BASE_URL}/api/feedback/getUserRequests?user_id=${userId}`
      )
      
      if (!requestsResponse.ok) {
        setError('Ошибка загрузки отзывов')
        setLoading(false)
        return
      }

      const requestsData = await requestsResponse.json()
      console.log('Отзывы пользователя:', requestsData)

      // Получаем ответы администратора
      const answersResponse = await fetch(
        `${API_BASE_URL}/api/feedback/getAnswers?user_id=${userId}`
      )

      if (answersResponse.ok) {
        const answersData: Answer[] = await answersResponse.json()
        console.log('Ответы администратора:', answersData)

        // Объединяем отзывы с ответами
        const mergedRequests = requestsData.map((request: Request) => {
          const answer = answersData.find(
            (ans) => ans.request_id === request.request_id
          )
          return {
            ...request,
            answer: answer?.answer,
          }
        })

        console.log('Объединенные данные:', mergedRequests)
        setRequests(mergedRequests)
      } else {
        // Если ответов нет, просто показываем отзывы
        setRequests(requestsData)
      }
    } catch (err) {
      console.error('Ошибка:', err)
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = () => {
    setLoading(true)
    fetchRequests()
  }

  const activeRequests = requests.filter((req) => req.status === 'PENDING')
  const answeredRequests = requests.filter((req) => req.status === 'ANSWERED')

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

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Активные ({activeRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('answered')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'answered'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            С ответами ({answeredRequests.length})
          </button>
        </nav>
      </div>

      <div className="space-y-4">
        {activeTab === 'active' ? (
          activeRequests.length > 0 ? (
            activeRequests.map((request) => (
              <RequestCard
                key={request.request_id}
                request={request}
                onUpdate={handleUpdate}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Нет активных отзывов</p>
            </div>
          )
        ) : answeredRequests.length > 0 ? (
          answeredRequests.map((request) => (
            <RequestCard
              key={request.request_id}
              request={request}
              onUpdate={handleUpdate}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Нет отзывов с ответами</p>
          </div>
        )}
      </div>
    </div>
  )
}
