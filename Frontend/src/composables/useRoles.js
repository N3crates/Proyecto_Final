import { ref } from 'vue'
import { getRoles, createRole, updateRole, deleteRole } from '../services/roles'

export function useRoles() {
  const roles = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const search = ref('')

  const loadRoles = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await getRoles({ page: page.value, limit: limit.value, q: search.value })
      roles.value = response.items || []
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar roles'
    } finally {
      loading.value = false
    }
  }

  const executeAction = async (callback) => {
    const response = await callback()
    await loadRoles()
    return response
  }

  const create = (payload) => executeAction(() => createRole(payload))
  const update = (id, payload) => executeAction(() => updateRole(id, payload))
  const remove = (id) => executeAction(() => deleteRole(id))

  return { roles, loading, error, page, limit, search, loadRoles, create, update, remove }
}