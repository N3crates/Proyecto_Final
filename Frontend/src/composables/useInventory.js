import { ref, computed } from 'vue'
import { getInventory, getMovements } from '../services/inventory'

export function useInventory() {
  const inventory = ref([])
  const movements = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const search = ref('')

  // Total de paginas calculado desde el total de registros del backend
  const totalPages = computed(() => Math.ceil(total.value / limit.value) || 1)

  // Carga el inventario desde el backend con paginacion y busqueda
  const loadInventory = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await getInventory({ page: page.value, limit: limit.value, q: search.value })
      inventory.value = response.items || []
      total.value = response.total || 0
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar inventario'
    } finally {
      loading.value = false
    }
  }

  // Carga los ultimos movimientos de inventario — usado para historial
  const loadMovements = async () => {
    try {
      const response = await getMovements({ limit: 50 })
      movements.value = response.items || []
    } catch (e) {
      // error silencioso — los movimientos son secundarios y no bloquean la vista
    }
  }

  return { inventory, movements, loading, error, page, limit, total, totalPages, search, loadInventory, loadMovements }
}