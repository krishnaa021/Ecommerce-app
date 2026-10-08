import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Star } from 'lucide-react'
import { fetchProductById } from '../api/productApi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import WishlistButton from '../components/products/WishlistButton'
import getErrorMessage from '../utils/getErrorMessage'

export default function ProductDetails() {
  const { id } = useParams()
  return <ProductDetailsContent key={id} id={id} />
}

function ProductDetailsContent({ id }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [message, setMessage] = useState('')
  const [messageIsError, setMessageIsError] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    let ignore = false

    fetchProductById(id)
      .then((p) => {
        if (!ignore) setProduct(p)
      })
      .catch((err) => {
        if (ignore) return
        const status = err.response?.status
        setError(
          status === 404 || status === 400
            ? 'Product not found.'
            : 'Could not load this product. Please try again.'
        )
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 md:grid-cols-2">
        <div className="aspect-[3/4] animate-pulse rounded-md bg-gray-200" />
        <div className="space-y-4">
          <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-1/3 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-lg text-gray-700">{error || 'Product not found.'}</p>
        <Link to="/products" className="mt-4 inline-block font-semibold text-brand hover:underline">
          Back to products
        </Link>
      </div>
    )
  }

  const {
    name, brand, description, category, subCategory, price, originalPrice,
    images = [], sizes = [], color, rating, ratingCount,
  } = product

  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0
  const selected = sizes.find((s) => s.size === selectedSize)
  const allOut = sizes.length > 0 && sizes.every((s) => s.stock === 0)

  const handleAddToBag = async () => {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }

    setAdding(true)
    setMessage('')
    try {
      await addToCart({ productId: id, size: selectedSize, quantity: 1 })
      setMessageIsError(false)
      setMessage('Added to your bag.')
    } catch (err) {
      setMessageIsError(true)
      setMessage(getErrorMessage(err))
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-brand">Home</Link>
        <span className="mx-1">/</span>
        <Link to={`/products?category=${category}`} className="capitalize hover:text-brand">
          {category}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-800">{name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`h-20 w-16 shrink-0 overflow-hidden rounded border-2 ${
                  i === activeImage ? 'border-brand' : 'border-transparent'
                }`}
              >
                <img src={src} alt={`${name} view ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="aspect-[3/4] flex-1 overflow-hidden rounded-md bg-gray-100">
            <img src={images[activeImage]} alt={name} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{brand}</h1>
          <p className="text-lg text-gray-500">{name}</p>

          {rating > 0 && (
            <span className="mt-3 inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-sm font-semibold">
              {rating.toFixed(1)}
              <Star size={14} className="fill-green-600 text-green-600" />
              <span className="text-gray-300">|</span>
              <span className="font-normal text-gray-500">{ratingCount} Ratings</span>
            </span>
          )}

          <hr className="my-4 border-gray-200" />

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
            {discount > 0 && (
              <>
                <span className="text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                <span className="font-semibold text-brand">({discount}% OFF)</span>
              </>
            )}
          </div>
          <p className="text-sm font-semibold text-green-700">inclusive of all taxes</p>

          {/* Sizes */}
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase text-gray-800">Select size</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {sizes.map(({ size, stock }) => {
                const out = stock === 0
                const active = size === selectedSize
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={out}
                    onClick={() => {
                      setSelectedSize(size)
                      setSizeError(false)
                      setMessage('')
                    }}
                    className={`flex h-12 min-w-12 items-center justify-center rounded-full border px-3 text-sm font-semibold transition ${
                      out
                        ? 'cursor-not-allowed border-dashed border-gray-200 text-gray-300 line-through'
                        : active
                          ? 'border-brand text-brand ring-1 ring-brand'
                          : 'border-gray-300 text-gray-800 hover:border-brand'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            {selected && selected.stock <= 5 && (
              <p className="mt-2 text-sm font-semibold text-orange-600">Only {selected.stock} left</p>
            )}
            {sizeError && (
              <p className="mt-2 text-sm font-semibold text-red-600">Please select a size</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={allOut || adding}
              onClick={handleAddToBag}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-brand py-3 font-bold uppercase text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingBag size={20} />
              {allOut ? 'Out of stock' : adding ? 'Adding...' : 'Add to bag'}
            </button>
            <WishlistButton
              product={product}
              variant="full"
              onError={(msg) => {
                setMessageIsError(true)
                setMessage(msg)
              }}
            />
          </div>

          {message && (
            <p className={`mt-3 text-sm ${messageIsError ? 'text-red-600' : 'text-green-700'}`}>
              {message}{' '}
              {!messageIsError && (
                <Link to="/cart" className="font-semibold underline">
                  Go to bag
                </Link>
              )}
            </p>
          )}

          {/* Details */}
          <hr className="my-6 border-gray-200" />
          <h2 className="text-sm font-bold uppercase text-gray-800">Product details</h2>
          <p className="mt-2 text-gray-600">{description}</p>
          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="w-24 text-gray-500">Category</dt>
              <dd className="capitalize text-gray-800">{category} / {subCategory}</dd>
            </div>
            {color && (
              <div className="flex gap-2">
                <dt className="w-24 text-gray-500">Color</dt>
                <dd className="text-gray-800">{color}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  )
}