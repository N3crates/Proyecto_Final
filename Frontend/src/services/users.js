import api from './api.js'

export async function getUsers() {
  const { data } = await api.get('/users')
  return data.items
}

export async function createUser(payload) {
  const { data } = await api.post('/users', payload)
  return data.item
}

export async function updateUser(id, payload) {
  const { data } = await api.patch(`/users/${id}`, payload)
  return data.item
}

export async function toggleUserActive(id) {
  const { data } = await api.patch(`/users/${id}/toggle-active`)
  return data.item
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`)
}