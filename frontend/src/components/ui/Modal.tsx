// src/components/ui/Modal.tsx
'use client'

import { ReactNode, useEffect } from 'react'

interface ModalProps {
  children: ReactNode
  onClose: () => void
  title?: string
}

export default function Modal({ children, onClose, title }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 z-10">
          {title && (
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
