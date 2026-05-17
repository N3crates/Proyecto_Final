import axios from "axios"
import { useUiStore } from "../stores/uiStore"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})
api.interceptors.request.use(
    (config) => {
        const uiStore = useUiStore()
        uiStore.startLoading()
        const token = localStorage.getItem('token')
        if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
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
            
            if(window.location.pathname !== '/login'){
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api