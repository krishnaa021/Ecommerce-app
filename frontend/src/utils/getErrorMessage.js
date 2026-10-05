export default function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (err.response?.data?.message) return err.response.data.message
  if (err.request) return 'Cannot reach the server. Please check that the backend is running.'
  return fallback
}