import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'

const formatCount = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n)

export default function ProductCard({ product }) {
  const { _id, name, brand, price, originalPrice, images, rating, ratingCount, sizes } = product

  const discount =
    originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0
  const outOfStock = sizes?.length > 0 && sizes.every((s) => s.stock === 0)

  return (
    <Link
      to={`/products/${_id}`}
      className="group block overflow-hidden rounded-md bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={images?.[0]}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {rating > 0 && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-white/95 px-2 py-1 text-xs font-semibold text-gray-800 shadow">
            {rating.toFixed(1)}
            <Star size={12} className="fill-green-600 text-green-600" />
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">{formatCount(ratingCount)}</span>
          </span>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-gray-600 shadow transition hover:text-brand md:opacity-0 md:group-hover:opacity-100"
        >
          <Heart size={18} />
        </button>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded bg-gray-800 px-3 py-1 text-xs font-semibold uppercase text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="px-1 pb-3 pt-2">
        <h3 className="truncate text-sm font-bold text-gray-900">{brand}</h3>
        <p className="truncate text-sm text-gray-500">{name}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
          <span className="font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-brand">({discount}% OFF)</span>
            </>
          )}
        </p>
      </div>
    </Link>
  )
}