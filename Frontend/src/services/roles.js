import api from './api.js'

// Obtiener la lista de roles, regresa directamente el array
export async function getRoles(params = {}) {
  const { data } = await api.get('/roles', { params })
  return data.items || []
}

// Crea un rol nuevo con sus permisos asignados
export async function createRole(payload) {
  const { data } = await api.post('/roles', payload)
  return data.item
}

// Actualiza nombre, descripcion o permisos de un rol existente
export async function updateRole(id, payload) {
  const { data } = await api.patch(`/roles/${id}`, payload)
  return data.item
}

// Elimina un rol, el backend valida que no tenga usuarios asignados
export async function deleteRole(id) {
  await api.delete(`/roles/${id}`)
}