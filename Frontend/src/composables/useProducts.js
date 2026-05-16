import { ref } from "vue";
import { getProducts, createProduct, updateProduct, deleteProduct, toggleProductActive } from "../services/products";

export function useProducts() {
    const products = ref([])
    const loading = ref(false)
    const error = ref(null)
    const page = ref(1)
    const limit = ref(10)
    const search= ref('')

    const loadProducts = async() => {
        if(loading.value) return
        loading.value = true
        error.value = null

        try {
            const response = await getProducts({ page: page.value, limit: limit.value, search: search.value})
            products.value = response.products || []
        } catch (e) {
            console.error(e)
            error.value = e.response?.data?.message || 'Error al cargar productos'
        }finally{
            loading.value = false
        }
    }

    const create = async(payload) => {
        try{
        const response = await createProduct(payload)
        await loadProducts()
        return response
        }catch(e){
            console.error(e)
            throw e
        }
    }

    const update = async(id, payload) => {
        try {
            const response = await updateProduct(id, payload)
            await loadProducts()
            return response
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    const toggleActive = async(id) => {
        try {
            const response = await toggleActive(id)
            await loadProducts()
            return response
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    const remove = async(id) => {
        try{
        const response = await deleteProduct(id)
        await loadProducts()
        return response
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    return{ products, loading, error, page, limit, search, loadProducts, create, update,toggleActive, remove}
}