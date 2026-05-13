import api from './api.js'

export async function getClients() {
  const { data } = await api.get('/clients')
  return data.items
}

export async function createClient(payload) {
  const { data } = await api.post('/clients', payload)
  return data.item
}

export async function updateClient(id, payload) {
  const { data } = await api.patch(`/clients/${id}`, payload)
  return data.item
}

export async function toggleClientActive(id) {
  const { data } = await api.patch(`/clients/${id}/toggle-active`)
  return data.item
}

export async function deleteClient(id) {
  await api.delete(`/clients/${id}`)
}