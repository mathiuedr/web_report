// src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`
            appearance-none relative block w-full px-3 py-2
            border border-gray-300 placeholder-gray-500 text-gray-900
            rounded-md focus:outline-none focus:ring-blue-500 
            focus:border-blue-500 focus:z-10 sm:text-sm
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
