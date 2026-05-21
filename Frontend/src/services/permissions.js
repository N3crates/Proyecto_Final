import api from './api.js'

export async function getPermissions(params = {}) {
  const { data } = await api.get('/permissions', { params })
  return data.items || []
}