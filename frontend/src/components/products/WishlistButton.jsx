import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import getErrorMessage from '../../utils/getErrorMessage'

export default function WishlistButton({ product, variant = 'icon', onError }) {
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const [busy, setBusy] = useState(false)

  const active = isWishlisted(product._id)

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }

    setBusy(true)
    try {
      await toggle(product)
    } catch (err) {
      const message = getErrorMessage(err)
      if (onError) onError(message)
      else window.alert(message)
    } finally {
      setBusy(false)
    }
  }

  const label = active ? 'Remove from wishlist' : 'Add to wishlist'

  if (variant === 'full') {
    return (
      <button
        type="button"
        aria-pressed={active}
        disabled={busy}
        onClick={handleClick}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md border py-3 font-bold uppercase transition disabled:opacity-60 ${
          active
            ? 'border-brand text-brand'
            : 'border-gray-300 text-gray-800 hover:border-gray-800'
        }`}
      >
        <Heart size={20} className={active ? 'fill-brand' : ''} />
        {active ? 'Wishlisted' : 'Wishlist'}
      </button>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={busy}
      onClick={handleClick}
      className={`absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow transition hover:text-brand disabled:opacity-60 ${
        active ? 'text-brand' : 'text-gray-600 md:opacity-0 md:group-hover:opacity-100'
      }`}
    >
      <Heart size={18} className={active ? 'fill-brand' : ''} />
    </button>
  )
}