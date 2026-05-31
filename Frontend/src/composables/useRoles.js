import { ref, computed } from 'vue'
import { getRoles, createRole, updateRole, deleteRole } from '../services/roles'

export function useRoles() {
  const roles = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const search = ref('')

  // Total de paginas calculado desde el total de registros del backend
  const totalPages = computed(() => Math.ceil(total.value / limit.value) || 1)

  // Carga roles desde el backend con paginacion y busqueda
  const loadRoles = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      // getRoles ya retorna el array directamente desde el servicio
      const response = await getRoles({ page: page.value, limit: limit.value, q: search.value })
      roles.value = response || []
      total.value = response.total || 0
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar roles'
    } finally {
      loading.value = false
    }
  }

  // Ejecuta una accion y recarga la lista al terminar
  const executeAction = async (callback) => {
    try {
      const response = await callback()
      await loadRoles()
      return response
    } catch (e) {
      throw e
    }
  }

  const create = (payload) => executeAction(() => createRole(payload))
  const update = (id, payload) => executeAction(() => updateRole(id, payload))
  const remove = (id) => executeAction(() => deleteRole(id))

  return { roles, loading, error, page, limit, total, totalPages, search, loadRoles, create, update, remove }
}