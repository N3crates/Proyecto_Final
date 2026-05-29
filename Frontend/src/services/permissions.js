import api from './api.js'

// Obtiene todos los permisos del sistema, es usado en Permisos.vue y RoleModal para asignar permisos a roles
export async function getPermissions(params = {}) {
  const { data } = await api.get('/permissions', { params })
  return data
}