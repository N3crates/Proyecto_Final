import api from './api.js'

// Obtiene la lista de productos con su stock actual
export async function getInventory(params = {}) {
  const { data } = await api.get('/inventory', { params })
  return data
}

// Registra un ajuste de stock, tipo ENTRADA, SALIDA o AJUSTE
export async function adjustInventory(productId, payload) {
  const { data } = await api.patch(`/inventory/${productId}/adjust`, payload)
  return data
}

// Obtiene el historial de movimientos de inventario
export async function getMovements(params = {}) {
  const { data } = await api.get('/inventory/movements', { params })
  return data
}