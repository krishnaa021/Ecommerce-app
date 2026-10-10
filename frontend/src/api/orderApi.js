import api from './axios'

const ORDERS_PATH = '/orders'

export const placeOrder = async (shippingAddress) =>
  (await api.post(ORDERS_PATH, { shippingAddress })).data.data

export const fetchMyOrders = async () =>
  (await api.get(`${ORDERS_PATH}/my-orders`)).data.data

export const fetchOrderById = async (id) => {
  try {
    return (await api.get(`${ORDERS_PATH}/${id}`)).data.data
  } catch (err) {
    if (err.response?.status !== 404) throw err

    const orders = await fetchMyOrders()
    const order = orders.find((o) => o._id === id)
    if (order) return order

    throw err
  }
}