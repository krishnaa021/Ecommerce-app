  import { Link } from 'react-router-dom'

  export default function NotFound() {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 text-xl font-bold text-gray-800">Page not found</h1>
        <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-brand px-6 py-3 font-bold uppercase text-white hover:bg-brand-dark"
        >
          Go home
        </Link>
      </div>
    )
  }