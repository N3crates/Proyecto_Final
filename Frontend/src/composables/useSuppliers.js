import { ref } from 'vue'
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, toggleSupplierActive } from '../services/suppliers'

export function useSuppliers() {
  const suppliers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const search = ref('')
  const initialized = ref(false)

  const loadSuppliers = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const response = await getSuppliers({ page: page.value, limit: limit.value, q: search.value })
      suppliers.value = response.items || []
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar proveedores'
    } finally {
      initialized.value = true
      loading.value = false
    }
  }

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

  return { suppliers, loading, error, page, limit, search, loadSuppliers, create, update, toggleActive, remove }
}