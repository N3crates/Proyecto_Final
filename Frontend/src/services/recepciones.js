import api from './api.js'

// Obtiene la lista de recepciones con paginacion y busqueda opcional
export async function getRecepciones(params = {}) {
  const { data } = await api.get('/recepciones', { params })
  return data
}

// Crea una recepcion nueva en estado borrador
export async function createRecepcion(payload) {
  const { data } = await api.post('/recepciones', payload)
  return data.item
}

// Actualiza los datos de una recepcion en estado borrador
export async function updateRecepcion(id, payload) {
  const { data } = await api.patch(`/recepciones/${id}`, payload)
  return data.item
}

// Confirma una recepcion, despues de esto afecta el inventario y no se puede editar
export async function confirmRecepcion(id) {
  const { data } = await api.patch(`/recepciones/${id}/confirm`)
  return data.item
}

// Elimina una recepcion, solo disponible en estado borrador
export async function deleteRecepcion(id) {
  await api.delete(`/recepciones/${id}`)
}