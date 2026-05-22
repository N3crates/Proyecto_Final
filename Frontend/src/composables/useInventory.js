import { ref } from 'vue'
import { getInventory, getMovements } from '../services/inventory'

export function useInventory() {
  const inventory = ref([])
  const movements = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const search = ref('')

  const loadInventory = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await getInventory({ page: page.value, limit: limit.value, q: search.value })
      inventory.value = response.items || []
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar inventario'
    } finally {
      loading.value = false
    }
  }

  const loadMovements = async () => {
    try {
      const response = await getMovements({ limit: 50 })
      movements.value = response.items || []
    } catch (e) {
      console.error(e)
    }
  }

  return { inventory, movements, loading, error, page, limit, search, loadInventory, loadMovements }
}