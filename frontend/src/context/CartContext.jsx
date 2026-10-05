import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { addCartItem, fetchCart, removeCartItem, updateCartItem } from '../api/cartApi'

const CartContext = createContext(null)
const EMPTY = []

const findStock = (item) =>
  item.product.sizes?.find((s) => s.size.toLowerCase() === item.size.toLowerCase())?.stock ?? 0

export function CartProvider({ children }) {
  const { user } = useAuth()
  const userId = user?._id

  const [cart, setCart] = useState({ userId: null, items: EMPTY })

  useEffect(() => {
    if (!userId) return
    let ignore = false

    fetchCart()
      .then((data) => {
        if (!ignore) setCart({ userId, items: data.items ?? [] })
      })
      .catch(() => {
        if (!ignore) setCart((prev) => (prev.userId === userId ? prev : { userId, items: EMPTY }))
      })

    return () => {
      ignore = true
    }
  }, [userId])

  const rawItems = cart.userId === userId ? cart.items : EMPTY
  const loading = Boolean(userId) && cart.userId !== userId

  const addToCart = useCallback(
    async (item) => {
      const data = await addCartItem(item)
      setCart({ userId, items: data.items ?? [] })
    },
    [userId]
  )

  const updateQuantity = useCallback(
    async (productId, size, quantity) => {
      const data = await updateCartItem(productId, size, quantity)
      setCart({ userId, items: data.items ?? [] })
    },
    [userId]
  )

  const removeItem = useCallback(
    async (productId, size) => {
      const data = await removeCartItem(productId, size)
      setCart({ userId, items: data.items ?? [] })
    },
    [userId]
  )

  const clearLocalCart = useCallback(() => setCart({ userId, items: EMPTY }), [userId])

  const value = useMemo(() => {
    const items = rawItems.filter((i) => i.product).map((i) => ({ ...i, stock: findStock(i) }))

    const itemCount = items.reduce((n, i) => n + i.quantity, 0)
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    const mrpTotal = items.reduce(
      (sum, i) => sum + (i.product.originalPrice ?? i.product.price) * i.quantity,
      0
    )

    return {
      items,
      loading,
      itemCount,
      subtotal,
      mrpTotal,
      discount: mrpTotal - subtotal,
      addToCart,
      updateQuantity,
      removeItem,
      clearLocalCart,
    }
  }, [rawItems, loading, addToCart, updateQuantity, removeItem, clearLocalCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}