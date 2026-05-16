import api from './api.js'

export const getUsers = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  )
  const response = await api.get('/users', { params: cleanParams })
  return response.data
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