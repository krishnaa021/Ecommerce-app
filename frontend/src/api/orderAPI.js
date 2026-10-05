import api from './axios'

const ORDERS_PATH = '/orders'

export const placeOrder = async (shippingAddress) =>
  (await api.post(ORDERS_PATH, { shippingAddress })).data.data

export const fetchMyOrders = async () =>
  (await api.get(`${ORDERS_PATH}/my-orders`)).data.data

export const fetchOrderById = async (id) =>
  (await api.get(`${ORDERS_PATH}/${id}`)).data.data