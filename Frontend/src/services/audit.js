import api from './api.js'

// Obtiene el historial de eventos con paginacion y busqueda 
export async function getAudit(params = {}) {
  const { data } = await api.get('/audit', { params })
  return data
}

// Obtiene el detalle de un evento especifico por id
export async function getAuditById(id) {
  const { data } = await api.get(`/audit/${id}`)
  return data.item
}