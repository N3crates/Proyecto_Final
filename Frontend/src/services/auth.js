import api from './api.js'

export async function login(usuario, password) {
  const { data } = await api.post('/auth/login', { usuario, password })
  localStorage.setItem('token', data.token)
}

export function logout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

export function getToken() {
  return localStorage.getItem('token')
}

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}