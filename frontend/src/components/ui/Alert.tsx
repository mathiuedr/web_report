// src/components/ui/Alert.tsx
import { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  variant?: 'error' | 'success' | 'info'
}

export default function Alert({ children, variant = 'info' }: AlertProps) {
  const variants = {
    error: 'bg-red-50 border-red-400 text-red-800',
    success: 'bg-green-50 border-green-400 text-green-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
  }

  return (
    <div
      className={`
        border-l-4 p-4 rounded ${variants[variant]}
      `}
      role="alert"
    >
      <p className="text-sm">{children}</p>
    </div>
  )
}
