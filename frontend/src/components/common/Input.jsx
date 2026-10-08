import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Input({ label, id, error, type = 'text', ...props }) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          {...props}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand ${
            isPassword ? 'pr-10 [&::-ms-reveal]:hidden' : ''
          } ${error ? 'border-red-500' : 'border-gray-300'}`}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            // Keeps the cursor in the field when the icon is clicked
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}