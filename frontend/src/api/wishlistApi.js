import api from './axios'

const WISHLIST_PATH = '/wishlist'

export const fetchWishlist = async () => {
  const body = (await api.get(WISHLIST_PATH)).data
  return Array.isArray(body) ? body : (body.data ?? [])
}

export const toggleWishlistItem = async (productId) =>
  (await api.post(`${WISHLIST_PATH}/toggle`, { productId })).data