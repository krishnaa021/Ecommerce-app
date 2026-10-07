import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { fetchWishlist, toggleWishlistItem } from '../api/wishlistApi'

const WishlistContext = createContext(null)
const EMPTY = []

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const userId = user?._id

  const [wishlist, setWishlist] = useState({ userId: null, items: EMPTY })

  useEffect(() => {
    if (!userId) return
    let ignore = false

    fetchWishlist()
      .then((items) => {
        if (!ignore) setWishlist({ userId, items })
      })
      .catch(() => {
        if (!ignore) {
          setWishlist((prev) => (prev.userId === userId ? prev : { userId, items: EMPTY }))
        }
      })

    return () => {
      ignore = true
    }
  }, [userId])

  const items = useMemo(
    () => (wishlist.userId === userId ? wishlist.items.filter(Boolean) : EMPTY),
    [wishlist, userId]
  )
  const loading = Boolean(userId) && wishlist.userId !== userId
  const ids = useMemo(() => new Set(items.map((p) => p._id)), [items])

  const isWishlisted = useCallback((productId) => ids.has(productId), [ids])

  const toggle = useCallback(
    async (product) => {
      const data = await toggleWishlistItem(product._id)
      const added = (data.wishlist ?? []).map(String).includes(product._id)

      setWishlist((prev) => {
        const base = prev.userId === userId ? prev.items : EMPTY
        const without = base.filter((p) => p && p._id !== product._id)
        return { userId, items: added ? [...without, product] : without }
      })
      return added
    },
    [userId]
  )

  const value = useMemo(
    () => ({ items, count: items.length, loading, isWishlisted, toggle }),
    [items, loading, isWishlisted, toggle]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}