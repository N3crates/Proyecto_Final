import api from './api.js'

export async function getProducts() {
  const { data } = await api.get('/products')
  return data.items
}

export async function createProduct(payload) {
  const { data } = await api.post('/products', payload)
  return data.item
}

export async function updateProduct(id, payload) {
  const { data } = await api.patch(`/products/${id}`, payload)
  return data.item
}

export async function toggleProductActive(id) {
  const { data } = await api.patch(`/products/${id}/toggle-active`)
  return data.item
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`)
}