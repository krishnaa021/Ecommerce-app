import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Input from '../components/common/Input'
import { useAuth } from '../context/AuthContext'
import getErrorMessage from '../utils/getErrorMessage'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const { user, register } = useAuth()
  const location = useLocation()
  const from = (location.state?.from?.pathname ?? '/') + (location.state?.from?.search ?? '')

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={from} replace />

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Please enter your name'
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Please enter a valid email address'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
    } catch (err) {
      setServerError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="mt-1 text-sm text-gray-500">Sign up to start shopping.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <Input id="name" name="name" label="Full name" autoComplete="name"
            value={form.name} onChange={handleChange} error={errors.name} />
          <Input id="email" name="email" type="email" label="Email" autoComplete="email"
            value={form.email} onChange={handleChange} error={errors.email} />
          <Input id="password" name="password" type="password" label="Password"
            autoComplete="new-password" value={form.password}
            onChange={handleChange} error={errors.password} />
          <Input id="confirmPassword" name="confirmPassword" type="password"
            label="Confirm password" autoComplete="new-password"
            value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

          {serverError && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-brand py-3 font-bold uppercase text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}