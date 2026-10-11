import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../context/AuthContext'
import getErrorMessage from '../../utils/getErrorMessage'

export default function GoogleSignInButton({ text = 'signin_with' }) {
  const { googleLogin } = useAuth()
  const [error, setError] = useState('')

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return null

  const handleSuccess = async (credentialResponse) => {
    setError('')

    if (!credentialResponse.credential) {
      setError('Google did not return a sign-in token. Please try again.')
      return
    }

    try {
      await googleLogin(credentialResponse.credential)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        or
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError('Google sign-in failed. Please try again.')}
          text={text}
          shape="rectangular"
          size="large"
        />
      </div>

      {error && (
        <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
    </div>
  )
}