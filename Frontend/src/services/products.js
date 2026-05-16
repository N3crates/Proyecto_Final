import api from './api.js'
import { ENDPOINTS } from '../constants/endpoints.js'

export async function getProducts(params={}) {
  const { data } = await api.get(ENDPOINTS.PRODUCTS.BASE, {params})
  return data.items
}

export async function createProduct(payload) {
  const { data } = await api.post(ENDPOINTS.PRODUCTS.BASE, payload)
  return data.item
}

export async function updateProduct(id, payload) {
  const { data } = await api.patch(`${ENDPOINTS.PRODUCTS.BASE}/${id}`, payload)
  return data.item
}

export async function toggleProductActive(id) {
  const { data } = await api.patch(`${ENDPOINTS.PRODUCTS.BASE}/${id}/toggle-active`)
  return data.item
}

export async function deleteProduct(id) {
  await api.delete(`${ENDPOINTS.PRODUCTS.BASE}/${id}`)
}