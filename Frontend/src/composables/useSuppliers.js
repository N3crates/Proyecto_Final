import { ref, computed } from 'vue'
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, toggleSupplierActive } from '../services/suppliers'

export function useSuppliers() {
  const suppliers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const search = ref('')
  const initialized = ref(false)

  // Total de paginas calculado desde el total de registros del backend
  const totalPages = computed(() => Math.ceil(total.value / limit.value) || 1)

  // Carga proveedores desde el backend con paginacion y busqueda
  const loadSuppliers = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await getSuppliers({ page: page.value, limit: limit.value, q: search.value })
      suppliers.value = response.items || []
      total.value = response.total || 0
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar proveedores'
    } finally {
      initialized.value = true
      loading.value = false
    }
  }

  // Ejecuta una accion y recarga la lista al terminar
  const executeAction = async (callback) => {
    try {
      const response = await callback()
      await loadSuppliers()
      return response
    } catch (e) {
      throw e
    }
  }

  const create = (payload) => executeAction(() => createSupplier(payload))
  const update = (id, payload) => executeAction(() => updateSupplier(id, payload))
  const toggleActive = (id, activo) => executeAction(() => toggleSupplierActive(id, activo))
  const remove = (id) => executeAction(() => deleteSupplier(id))

  return { suppliers, loading, error, page, limit, total, totalPages, search, loadSuppliers, create, update, toggleActive, remove }
}