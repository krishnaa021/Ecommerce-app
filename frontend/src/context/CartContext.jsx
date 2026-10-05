import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { addCartItem, fetchCart, removeCartItem, updateCartItem } from '../api/cartAPI'

const CartContext = createContext(null)

const findStock = (item) =>
  item.product.sizes?.find((s) => s.size.toLowerCase() === item.size.toLowerCase())?.stock ?? 0

export function CartProvider({ children }) {
  const { user } = useAuth()
  const userId = user?._id
  const [rawItems, setRawItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) {
      setRawItems([])
      return
    }
    let ignore = false
    setLoading(true)
    fetchCart()
      .then((cart) => {
        if (!ignore) setRawItems(cart.items ?? [])
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [userId])

  const addToCart = useCallback(async (item) => {
    const cart = await addCartItem(item)
    setRawItems(cart.items ?? [])
  }, [])

  const updateQuantity = useCallback(async (productId, size, quantity) => {
    const cart = await updateCartItem(productId, size, quantity)
    setRawItems(cart.items ?? [])
  }, [])

  const removeItem = useCallback(async (productId, size) => {
    const cart = await removeCartItem(productId, size)
    setRawItems(cart.items ?? [])
  }, [])

  const clearLocalCart = useCallback(() => setRawItems([]), [])

  const value = useMemo(() => {
    const items = rawItems
      .filter((i) => i.product)
      .map((i) => ({ ...i, stock: findStock(i) }))

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