import api from './api.js'

export async function getSuppliers() {
  const { data } = await api.get('/suppliers')
  return data.items
}

export async function createSupplier(payload) {
  const { data } = await api.post('/suppliers', payload)
  return data.item
}

export async function updateSupplier(id, payload) {
  const { data } = await api.patch(`/suppliers/${id}`, payload)
  return data.item
}

export async function toggleSupplierActive(id) {
  const { data } = await api.patch(`/suppliers/${id}/toggle-active`)
  return data.item
}

export async function deleteSupplier(id) {
  await api.delete(`/suppliers/${id}`)
}