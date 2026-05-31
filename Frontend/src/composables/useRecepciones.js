import { ref, computed } from 'vue'
import { getRecepciones, createRecepcion, updateRecepcion, deleteRecepcion, confirmRecepcion } from '../services/recepciones'

export function useRecepciones() {
  const recepciones = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const search = ref('')

  // Total de paginas calculado desde el total de registros del backend
  const totalPages = computed(() => Math.ceil(total.value / limit.value) || 1)

  // Carga recepciones desde el backend con paginacion y busqueda
  const loadRecepciones = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await getRecepciones({ page: page.value, limit: limit.value, q: search.value })
      recepciones.value = response.items || []
      total.value = response.total || 0
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar recepciones'
    } finally {
      loading.value = false
    }
  }

  // Ejecuta una accion y recarga la lista al terminar
  const executeAction = async (callback) => {
    try {
      const response = await callback()
      await loadRecepciones()
      return response
    } catch (e) {
      throw e
    }
  }

  const create = (payload) => executeAction(() => createRecepcion(payload))
  const update = (id, payload) => executeAction(() => updateRecepcion(id, payload))
  const confirm = (id) => executeAction(() => confirmRecepcion(id))
  const remove = (id) => executeAction(() => deleteRecepcion(id))

  return { recepciones, loading, error, page, limit, total, totalPages, search, loadRecepciones, create, update, confirm, remove }
}