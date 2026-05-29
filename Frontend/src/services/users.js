import api from './api.js'

// Obtiene la lista de usuarios con paginacion y busqueda opcional
export async function getUsers(params = {}) {
  const { data } = await api.get('/users', { params })
  return data
}

// Crea un usuario nuevo con su rol y password
export async function createUser(payload) {
  const { data } = await api.post('/users', payload)
  return data.item
}

// Actualiza los datos de un usuario existente
export async function updateUser(id, payload) {
  const { data } = await api.patch(`/users/${id}`, payload)
  return data.item
}

// Cambia el estado activo/inactivo del usuario
export async function toggleUserActive(id, activo) {
  const { data } = await api.patch(`/users/${id}/toggle-active`, { activo })
  return data.item
}

// Elimina un usuario por id
export async function deleteUser(id) {
  await api.delete(`/users/${id}`)
}