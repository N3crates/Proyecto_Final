import api from './api.js'

export async function getAudit(params = {}) {
  const { data } = await api.get('/audit', {params})
  return data
}

export async function getAuditById(id) {
  const { data } = await api.get(`/audit/${id}`)
  return data.item
}