import api from './axios'

const PRODUCTS_PATH = '/products'

export const fetchProducts = async (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  )
  const { data } = await api.get(PRODUCTS_PATH, { params: clean })
  return data 
}

export const fetchProductById = async (id) => {
  const { data } = await api.get(`${PRODUCTS_PATH}/${id}`)
  return data.data ?? data
}