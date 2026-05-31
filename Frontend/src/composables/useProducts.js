import { ref } from "vue"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive
} from "../services/products"

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const page = ref(1)
  const limit = ref(10)
  const search = ref('')
  const initialized = ref(false)

  const loadProducts = async () => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const response = await getProducts({
        page: page.value,
        limit: limit.value,
        q: search.value
      })

      products.value = response.items || []
    } catch (e) {
      console.error(e)
      error.value = e.response?.data?.message || 'Error al cargar productos'
    } finally {
      initialized.value = true
      loading.value = false
    }
  }

  const executeAction = async (callback) => {
    try {
      const response = await callback()
      await loadProducts()
      return response
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const create = (payload) =>
    executeAction(() => createProduct(payload))

  const update = (id, payload) =>
    executeAction(() => updateProduct(id, payload))

  const toggleActive = (id, activo) =>
    executeAction(() => toggleProductActive(id, activo))

  const remove = (id) =>
    executeAction(() => deleteProduct(id))

  return {
    products,
    loading,
    error,
    page,
    limit,
    search,
    initialized,
    loadProducts,
    create,
    update,
    toggleActive,
    remove
  }
}