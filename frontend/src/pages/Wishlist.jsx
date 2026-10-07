import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import ProductGrid from '../components/products/ProductGrid'
import { useWishlist } from '../context/WishlistContext'

export default function Wishlist() {
  const { items, count, loading } = useWishlist()

  if (loading && count === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800">My Wishlist</h1>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-md bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <Heart size={40} className="mx-auto text-brand" />
        <h1 className="mt-4 text-xl font-bold text-gray-800">Your wishlist is empty</h1>
        <p className="mt-2 text-gray-500">
          Tap the heart on any product to save it here for later.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-brand px-6 py-3 font-bold uppercase text-white hover:bg-brand-dark"
        >
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800">
        My Wishlist{' '}
        <span className="text-base font-normal text-gray-500">
          ({count} {count === 1 ? 'item' : 'items'})
        </span>
      </h1>
      <div className="mt-6">
        {/* Most recently saved first */}
        <ProductGrid products={[...items].reverse()} />
      </div>
    </div>
  )
}