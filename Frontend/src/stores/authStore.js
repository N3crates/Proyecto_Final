import { defineStore } from "pinia";
import {meRequest} from '../services/authService'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        permissions: JSON.parse(localStorage.getItem('permissions') || '[]')
    }),
    getters: {isAuthenticated: (state) => !!state.token},
    actions: {
        setAuth(data){
            this.token = data.token
            this.user = data.user
            this.permissions = data.user.permissions || []
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('permissions', JSON.stringify(data.user.permissions || []))
        },
        logout() {
            this.token = null
            this.user = null
            this.permissions = []
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('permissions')
        },
        async initializeAuth() {
            const token = localStorage.getItem('token')

            if(!token) return

            try {
                this.token = token
                const response = await meRequest()
                this.user = response.user
                this.permissions = response.user.permissions || []
                localStorage.setItem('user', JSON.stringify(response.user))
                localStorage.setItem('permissions', JSON.stringify(response.user.permissions || []))
            } catch (error) {
                this.logout()
            }
        }
    }
})