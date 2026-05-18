import api from './api.js'

export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params })
  return data
}

export async function createProduct(payload) {
  const { data } = await api.post('/products', payload)
  return data.item
}

export async function updateProduct(id, payload) {
  const { data } = await api.patch(`/products/${id}`, payload)
  return data.item
}

export async function toggleProductActive(id, activo) {
  const { data } = await api.patch(`/products/${id}/toggle-active`, { activo })
  return data.item
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`)
}