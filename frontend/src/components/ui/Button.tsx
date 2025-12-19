// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center px-4 py-2
    border text-sm font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variants = {
    primary: `
      border-transparent text-white bg-blue-600
      hover:bg-blue-700 focus:ring-blue-500
    `,
    secondary: `
      border-gray-300 text-gray-700 bg-white
      hover:bg-gray-50 focus:ring-blue-500
    `,
    danger: `
      border-transparent text-white bg-red-600
      hover:bg-red-700 focus:ring-red-500
    `,
  }

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
