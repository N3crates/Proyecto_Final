<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Recepciones</h1>
            <p class="text-sm opacity-70">Registro y confirmación de recepciones de productos.</p>
          </div>
          <button class="btn btn-primary">+ Nueva Recepción</button>
        </div>
      </div>

      <div v-if="error" class="alert alert-error"><span>{{ error }}</span></div>

      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Proveedor</th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="recepciones.length === 0">
              <td colspan="6" class="text-center opacity-50 py-8">Sin recepciones registradas</td>
            </tr>
            <tr v-for="rec in recepciones" :key="rec.id">
              <td class="font-mono text-xs">{{ rec.id?.slice(0, 8) }}...</td>
              <td>{{ rec.proveedor || rec.supplierName || '-' }}</td>
              <td>{{ rec.productos?.length ?? rec.items?.length ?? '-' }}</td>
              <td>
                <span class="badge" :class="rec.estado === 'confirmado' || rec.status === 'confirmed' ? 'badge-success' : 'badge-warning'">
                  {{ rec.estado || rec.status || 'Borrador' }}
                </span>
              </td>
              <td>{{ rec.fecha ? new Date(rec.fecha).toLocaleDateString() : '-' }}</td>
              <td class="flex gap-2">
                <button class="btn btn-sm btn-success">Confirmar</button>
                <button class="btn btn-sm btn-warning">Editar</button>
                <button class="btn btn-sm btn-error">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import { getRecepciones } from '../services/recepciones.js'

const recepciones = ref([])
const loading = ref(false)
const error = ref(null)

async function loadRecepciones() {
  loading.value = true
  error.value = null
  try {
    recepciones.value = await getRecepciones()
  } catch (e) {
    error.value = 'Error al cargar recepciones'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadRecepciones())
</script>