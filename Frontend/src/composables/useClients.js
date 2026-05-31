import { ref } from 'vue'
import { getClients, createClient, updateClient, deleteClient, toggleClientActive } from '../services/clients'

export function useClients() {
  const clients = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const search = ref('')
  const initialized = ref(false) // evita mostrar empty state antes de la primera carga

  // Carga clientes desde el backend con paginacion y busqueda
  const loadClients = async () => {
    if (loading.value) return // evita llamadas duplicadas si ya esta cargando
    loading.value = true
    error.value = null
    try {
      const response = await getClients({ page: page.value, limit: limit.value, q: search.value })
      clients.value = response.items || []
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar clientes'
    } finally {
      initialized.value = true
      loading.value = false
    }
  }

  // Ejecuta una accion y recarga la lista al terminar
  const executeAction = async (callback) => {
    try {
      const response = await callback()
      await loadClients()
      return response
    } catch (e) {
      throw e
    }
  }

  const create = (payload) => executeAction(() => createClient(payload))
  const update = (id, payload) => executeAction(() => updateClient(id, payload))
  const toggleActive = (id, activo) => executeAction(() => toggleClientActive(id, activo))
  const remove = (id) => executeAction(() => deleteClient(id))

  return { clients, loading, error, page, limit, search, loadClients, create, update, toggleActive, remove }
}