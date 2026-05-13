import api from './api.js'

export async function getAudit() {
  const { data } = await api.get('/audit')
  return data.items
}

export async function getAuditById(id) {
  const { data } = await api.get(`/audit/${id}`)
  return data.item
}