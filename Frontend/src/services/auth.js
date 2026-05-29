import api from './api.js'

// Envia credenciales al backend y guarda el token en localStorage
export async function login(usuario, password) {
  const { data } = await api.post('/auth/login', { usuario, password })
  localStorage.setItem('token', data.token)
}

// Elimina el token y redirige al login
export function logout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

// Retorna el token actual o null si no hay sesion
export function getToken() {
  return localStorage.getItem('token')
}

// Verifica si hay un token guardado
export function isAuthenticated() {
  return !!localStorage.getItem('token')
}