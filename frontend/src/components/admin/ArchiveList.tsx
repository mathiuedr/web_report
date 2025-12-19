// src/components/admin/ArchiveList.tsx
'use client'

import { useState, useEffect } from 'react'
import Alert from '@/components/ui/Alert'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface ArchiveItem {
  request_id: number
  id?: number  // Добавляем альтернативное поле
  text: string
  answer?: string
  response_text?: string
  answered_at?: string
}

interface ArchiveListProps {
  userId: string
}

export default function ArchiveList({ userId }: ArchiveListProps) {
  const [archive, setArchive] = useState<ArchiveItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchArchive()
  }, [userId])

  const fetchArchive = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/feedback/getArchive?user_id=${userId}`
      )
      
      if (response.ok) {
        const data = await response.json()
        console.log('Полные данные архива:', JSON.stringify(data, null, 2))
        setArchive(data)
      } else {
        setError('Ошибка загрузки архива')
      }
    } catch (err) {
      console.error('Ошибка загрузки архива:', err)
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const filteredArchive = archive.filter(
    (item) =>
      item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.answer || item.response_text || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

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
    <div className="space-y-4">
      <div className="bg-white px-4 py-3 rounded-lg shadow">
        <input
          type="text"
          placeholder="Поиск по тексту отзыва или ответа..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white px-4 py-3 rounded-lg shadow">
        <p className="text-sm text-gray-700">
          Всего в архиве: <span className="font-semibold">{archive.length}</span>
          {searchTerm && (
            <span className="ml-2">
              (найдено: <span className="font-semibold">{filteredArchive.length}</span>)
            </span>
          )}
        </p>
      </div>

      {filteredArchive.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {searchTerm ? 'Ничего не найдено' : 'Архив пуст'}
          </p>
        </div>
      ) : (
        filteredArchive.map((item) => {
          const answerText = item.answer || item.response_text
          const itemId = item.request_id || item.id
          
          return (
            <div key={itemId} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  ID: {itemId || 'не указан'}
                </span>
                {item.answered_at && (
                  <span className="text-sm text-gray-400">
                    {new Date(item.answered_at).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                    Отзыв
                  </p>
                  <p className="text-gray-900 whitespace-pre-wrap">{item.text}</p>
                </div>
                
                {answerText ? (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-green-600 uppercase mb-1">
                      Ответ администратора
                    </p>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {answerText}
                    </p>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                      Ответ отсутствует
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
