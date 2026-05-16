import { useAuthStore } from '../stores/authStore'

export function hasPermission(permission) {
  const authStore = useAuthStore()
  if (
    authStore.user?.role === 'ADMIN'
  ) {
    return true
  }
  return authStore.permissions.includes(
    permission
  )
}
  
export function hasRole(role) {
  const authStore = useAuthStore()
  return (authStore.user?.role === role)
}