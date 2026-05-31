import api from './api.js'

// Obtiene la lista de productos con paginacion y busqueda opcional
export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params })
  return data
}

// Crea un producto nuevo
export async function createProduct(payload) {
  const { data } = await api.post('/products', payload)
  return data.item
}

// Actualiza los datos de un producto existente
export async function updateProduct(id, payload) {
  const { data } = await api.patch(`/products/${id}`, payload)
  return data.item
}

// Cambia el estado activo/inactivo del producto
export async function toggleProductActive(id, activo) {
  const { data } = await api.patch(`/products/${id}/toggle-active`, { activo })
  return data.item
}

// Elimina un producto por id
export async function deleteProduct(id) {
  await api.delete(`/products/${id}`)
}