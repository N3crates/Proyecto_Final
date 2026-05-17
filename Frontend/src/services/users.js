import api from './api.js'
import { ENDPOINTS } from '../constants/endpoints.js'

export const getUsers = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  )
  const { data } = await api.get(ENDPOINTS.USERS.BASE, { params: cleanParams })
  return data
}

export async function createUser(payload) {
  const { data } = await api.post(ENDPOINTS.USERS.BASE, payload)
  return data.item
}

export async function updateUser(id, payload) {
  const { data } = await api.patch(`${ENDPOINTS.USERS.BASE}/${id}`, payload)
  return data.item
}

export async function toggleUserActive(id) {
  const { data } = await api.patch(`${ENDPOINTS.USERS.BASE}/${id}/toggle-active`)
  return data.item
}

export async function deleteUser(id) {
  await api.delete(`${ENDPOINTS.USERS.BASE}/${id}`)
}