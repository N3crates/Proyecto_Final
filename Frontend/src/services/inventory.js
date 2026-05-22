import api from './api.js'

export async function getInventory(params = {}) {
  const { data } = await api.get('/inventory', { params })
  return data
}

export async function adjustInventory(productId, payload) {
  const { data } = await api.post(`/inventory/${productId}/adjust`, payload)
  return data
}

export async function getMovements(params = {}) {
  const { data } = await api.get('/inventory/movements', { params })
  return data
}