import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Input from '../components/common/Input'
import { useAuth } from '../context/AuthContext'
import getErrorMessage from '../utils/getErrorMessage'

export default function Login() {
  const { user, login } = useAuth()
  const location = useLocation()
  const from = (location.state?.from?.pathname ?? '/') + (location.state?.from?.search ?? '')

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Already logged in (or just logged in): go to where the user was headed
  if (user) return <Navigate to={from} replace />

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password')
      return
    }

    setSubmitting(true)
    try {
      await login({ email: form.email.trim(), password: form.password })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Login</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Please sign in to continue.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-brand py-3 font-bold uppercase text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New here?{' '}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}