import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Wishlist() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 text-center">
      <Heart size={40} className="mx-auto text-brand" />
      <h1 className="mt-4 text-xl font-bold text-gray-800">Your wishlist</h1>
      <p className="mt-2 text-gray-500">Wishlist is coming soon. Check back shortly.</p>
      <Link
        to="/products"
        className="mt-6 inline-block rounded-md bg-brand px-6 py-3 font-bold uppercase text-white hover:bg-brand-dark"
      >
        Continue shopping
      </Link>
    </div>
  )
}