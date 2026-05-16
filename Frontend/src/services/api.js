import axios from "axios"
import { useUiStore } from "../stores/uiStore"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})
api.interceptors.request.use(
    (config) => {
        const uiStore = useUiStore()
        uiStore.startLoading()
        const token =
            localStorage.getItem('token')
        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`
        }
        return config
    },
    (error) => {
        const uiStore = useUiStore()
        uiStore.stopLoading()
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        const uiStore = useUiStore()
        uiStore.stopLoading()
        return response
    },
    (error) => {
        const uiStore = useUiStore()
        uiStore.stopLoading()
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('permissions')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api