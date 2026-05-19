import { ref } from 'vue'
import { getRecepciones, createRecepcion, updateRecepcion, deleteRecepcion, confirmRecepcion } from '../services/recepciones'

export function useRecepciones() {
  const recepciones = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const search = ref('')

  const loadRecepciones = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await getRecepciones({ page: page.value, limit: limit.value, q: search.value })
      recepciones.value = response.items || []
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar recepciones'
    } finally {
      loading.value = false
    }
  }

  const executeAction = async (callback) => {
    const response = await callback()
    await loadRecepciones()
    return response
  }

  const create = (payload) => executeAction(() => createRecepcion(payload))
  const update = (id, payload) => executeAction(() => updateRecepcion(id, payload))
  const confirm = (id) => executeAction(() => confirmRecepcion(id))
  const remove = (id) => executeAction(() => deleteRecepcion(id))

  return { recepciones, loading, error, page, limit, search, loadRecepciones, create, update, confirm, remove }
}