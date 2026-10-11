import Home from './Home'
import Landing from './Landing'
import { useAuth } from '../context/AuthContext'

function HomeLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12" aria-label="Loading your home page">
      <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
      <div className="mt-10 h-8 w-48 animate-pulse rounded bg-gray-100" />
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>
    </div>
  )
}

export default function HomeRoute() {
  const { user, loading } = useAuth()

  if (loading) return <HomeLoading />
  return user ? <Home /> : <Landing />
}
