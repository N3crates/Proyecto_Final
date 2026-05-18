import api from './api.js'

export async function getUsers(params = {}) {
  const { data } = await api.get('/users', { params })
  return data
}

export async function createUser(payload) {
  const { data } = await api.post('/users', payload)
  return data.item
}

export async function updateUser(id, payload) {
  const { data } = await api.patch(`/users/${id}`, payload)
  return data.item
}

export async function toggleUserActive(id, activo) {
  const { data } = await api.patch(`/users/${id}/toggle-active`, { activo })
  return data.item
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`)
}