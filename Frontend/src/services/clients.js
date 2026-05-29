import api from './api.js'

// Obtiene la lista de clientes con paginacion y busqueda opcional
export async function getClients(params = {}) {
  const { data } = await api.get('/clients', { params })
  return data
}

// Crea un cliente nuevo
export async function createClient(payload) {
  const { data } = await api.post('/clients', payload)
  return data.item
}

// Actualiza los datos de un cliente existente
export async function updateClient(id, payload) {
  const { data } = await api.patch(`/clients/${id}`, payload)
  return data.item
}

// Cambia el estado activo/inactivo del cliente
export async function toggleClientActive(id, activo) {
  const { data } = await api.patch(`/clients/${id}/toggle-active`, { activo })
  return data.item
}

// Elimina un cliente por id
export async function deleteClient(id) {
  await api.delete(`/clients/${id}`)
}