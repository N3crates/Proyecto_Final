import api from './api.js'

export async function getRoles(params = {}) {
  const { data } = await api.get('/roles', { params })
  return data.items || []
}

export async function createRole(payload) {
  const { data } = await api.post('/roles', payload)
  return data.item
}

export async function updateRole(id, payload) {
  const { data } = await api.patch(`/roles/${id}`, payload)
  return data.item
}

export async function deleteRole(id) {
  await api.delete(`/roles/${id}`)
}