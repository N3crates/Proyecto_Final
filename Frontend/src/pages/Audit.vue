<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">
      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <h1 class="text-2xl font-bold">Auditoría</h1>
        <p class="text-sm opacity-70">Historial de eventos del sistema.</p>
      </div>
      <div class="flex justify-end">
        <input v-model="search" @input="debounceSearch" type="text" placeholder="Buscar evento..." class="input input-bordered w-full max-w-sm"/>
      </div>
      <ErrorState v-if="error" :message="error"/>
      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Recurso</th>
              <th>Acción</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-8">
                <span class="loading loading-spinner"></span>
              </td>
            </tr>
            <tr v-else-if="events.length === 0">
              <td colspan="5">
                <EmptyState title="Sin eventos" description="No hay eventos de auditoría registrados"/>
              </td>
            </tr>
            <tr v-for="event in events" :key="event.id">
              <td class="text-sm">{{event.createdAt  ? new Date(event.createdAt).toLocaleString(): '-'}}</td>
              <td>{{ event.usuario || event.userId || '-' }}
              </td>
              <td>{{ event.resource || '-' }}</td>
              <td>
                <span class="badge badge-info">{{ event.action || '-' }}</span>
              </td>
              <td class="text-sm opacity-70">{{ event.resourceId || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between items-center mt-4">
        <button class="btn btn-sm" @click="previousPage" :disabled="page <= 1">Anterior</button>
        <span>Página {{ page }} de {{ totalPages }}
        </span>
        <button class="btn btn-sm" @click="nextPage" :disabled="page >= totalPages">Siguiente</button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted} from 'vue'
import debounce from 'lodash/debounce'
import AdminLayout from '../layouts/AdminLayout.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import {getAudit} from '../services/audit.js'

const events = ref([])
const loading = ref(false)
const error = ref(null)
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const search = ref('')

const totalPages = computed(() => {
  return Math.ceil(total.value / limit.value) || 1
})

async function loadAudit() {
  loading.value = true
  error.value = null
  try {
    const response = await getAudit({ page: page.value, limit: limit.value, q: search.value})
    events.value = response.items || []
    total.value = response.total || 0
  } catch (e) {
    error.value = 'Error al cargar auditoría'
  } finally {
    loading.value = false
  }
}

async function previousPage() {
  if (page.value > 1) {
    page.value--
    await loadAudit()
  }
}

async function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    await loadAudit()
  }
}

const debounceSearch = debounce(async () => {
  page.value = 1
  await loadAudit()
}, 500)

onMounted(() => {loadAudit()})
</script>