import api from './axios'

const CART_PATH = '/cart'

export const fetchCart = async () => (await api.get(CART_PATH)).data.data

export const addCartItem = async ({ productId, size, quantity = 1 }) =>
  (await api.post(CART_PATH, { productId, size, quantity })).data.data

export const updateCartItem = async (productId, size, quantity) =>
  (await api.put(`${CART_PATH}/item/${productId}`, { size, quantity })).data.data

export const removeCartItem = async (productId, size) =>
  (await api.delete(`${CART_PATH}/item/${productId}`, { params: { size } })).data.data