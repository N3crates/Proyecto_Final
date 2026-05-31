import { ref, computed } from 'vue'
import { getUsers, createUser, updateUser, deleteUser, toggleUserActive } from '../services/users'

export function useUsers() {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const search = ref('')
  const initialized = ref(false)

  // Total de paginas calculado desde el total de registros del backend
  const totalPages = computed(() => Math.ceil(total.value / limit.value) || 1)

  // Carga usuarios desde el backend con paginacion y busqueda
  const loadUsers = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await getUsers({ page: page.value, limit: limit.value, q: search.value })
      users.value = response.items || []
      total.value = response.total || 0
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar usuarios'
    } finally {
      initialized.value = true
      loading.value = false
    }
  }

  // Ejecuta una accion y recarga la lista al terminar
  const executeAction = async (callback) => {
    try {
      const response = await callback()
      await loadUsers()
      return response
    } catch (e) {
      throw e
    }
  }

  const create = (payload) => executeAction(() => createUser(payload))
  const update = (id, payload) => executeAction(() => updateUser(id, payload))
  const remove = (id) => executeAction(() => deleteUser(id))
  const toggleActive = (id, activo) => executeAction(() => toggleUserActive(id, activo))

  return { users, loading, error, initialized, page, limit, total, totalPages, search, loadUsers, create, update, remove, toggleActive }
}