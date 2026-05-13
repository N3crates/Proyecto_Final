<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div>
          <h1 class="text-2xl font-bold">Auditoría</h1>
          <p class="text-sm opacity-70">Historial de eventos del sistema.</p>
        </div>
      </div>

      <div v-if="error" class="alert alert-error"><span>{{ error }}</span></div>

      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Módulo</th>
              <th>Acción</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="events.length === 0">
              <td colspan="5" class="text-center opacity-50 py-8">Sin eventos registrados</td>
            </tr>
            <tr v-for="event in events" :key="event.id">
              <td>{{ event.fecha ? new Date(event.fecha).toLocaleString() : '-' }}</td>
              <td>{{ event.usuario || event.user || '-' }}</td>
              <td>{{ event.modulo || event.module || '-' }}</td>
              <td>
                <span class="badge badge-info">{{ event.accion || event.action || '-' }}</span>
              </td>
              <td class="text-sm opacity-70">{{ event.detalle || event.detail || '-' }}</td>
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
import { getAudit } from '../services/audit.js'

const events = ref([])
const loading = ref(false)
const error = ref(null)

async function loadAudit() {
  loading.value = true
  error.value = null
  try {
    events.value = await getAudit()
  } catch (e) {
    error.value = 'Error al cargar auditoría'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadAudit())
</script>