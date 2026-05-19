import api from './api.js'

export async function getRecepciones(params = {}) {
  const { data } = await api.get('/recepciones', { params })
  return data
}

export async function createRecepcion(payload) {
  const { data } = await api.post('/recepciones', payload)
  return data.item
}

export async function updateRecepcion(id, payload) {
  const { data } = await api.patch(`/recepciones/${id}`, payload)
  return data.item
}

export async function confirmRecepcion(id) {
  const { data } = await api.patch(`/recepciones/${id}/confirm`)
  return data.item
}

export async function deleteRecepcion(id) {
  await api.delete(`/recepciones/${id}`)
}