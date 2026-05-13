import api from './api.js'

export async function getInventory() {
  const { data } = await api.get('/inventory')
  return data.items
}

export async function getInventoryByProduct(productId) {
  const { data } = await api.get(`/inventory/${productId}`)
  return data.item
}

export async function adjustInventory(productId, payload) {
  const { data } = await api.post(`/inventory/${productId}/adjust`, payload)
  return data.item
}

export async function getMovements() {
  const { data } = await api.get('/inventory/movements')
  return data.items
}