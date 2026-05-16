import { ref } from "vue";
import { getUsers, createUser, updateUser, deleteUser } from "../services/users";

export function useUsers() {
    const users = ref([])
    const loading = ref(false)
    const error = ref(null)
    const page = ref(1)
    const limit = ref(10)
    const search = ref('')
    const initialized = ref(false)

    const loadUsers = async() => {
        if(loading.value) return

        loading.value = true
        error.value = null
        
        try {
            const response = await getUsers({ page: page.value, limit: limit.value, q: search.value })
            users.value = response.items || []
        } catch (e) {
            console.error(e)
            error.value = e.response?.data?.message || 'Error al cargar usuarios'
        } finally {
            initialized.value = true
            loading.value = false
        }
    }

    const create = async (payload) => {
        try {
            const response = await createUser(payload)
            await loadUsers()
            return response
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    const update = async (id, payload) => {
        try {
            const response = await updateUser(id, payload)
            await loadUsers()
            return response
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    const remove = async (id) => {
        try {
            const response = await deleteUser(id)
            await loadUsers()
            return response
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    return { users, loading, error, loadUsers, create, update, remove, page, limit, search }
}