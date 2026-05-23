<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">
      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <h1 class="text-2xl font-bold">Permisos</h1>
        <p class="text-sm opacity-70">
          Visualiza los permisos disponibles en el sistema.
        </p>
      </div>
      <div class="flex justify-end">
        <input v-model="search" @input="debounceSearch" type="text" placeholder="Buscar permiso..." class="input input-bordered w-full max-w-sm"/>
      </div>
      <ErrorState v-if="error" :message="error"/>
      <div
        class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Módulo</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center py-8">
                <span class="loading loading-spinner"></span>
              </td>
            </tr>
            <tr v-else-if="permissions.length === 0">
              <td colspan="4">
                <EmptyState title="Sin permisos" description="No hay permisos registrados"/>
              </td>
            </tr>
            <tr v-for="perm in permissions" :key="perm.id">
              <td class="font-mono text-sm">{{ perm.code }}</td>
              <td>{{ perm.nombre }}</td>
              <td>
                <span class="badge badge-outline">{{ perm.modulo }}</span>
              </td>
              <td class="opacity-70 text-sm">{{ perm.descripcion || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between items-center mt-4">
        <button class="btn btn-sm" @click="previousPage" :disabled="page <= 1">Anterior</button>
        <span>Página {{ page }} de {{ totalPages }}
        </span>
        <button class="btn btn-sm" @click="nextPage":disabled="page >= totalPages">Siguiente</button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import debounce from 'lodash/debounce'
import AdminLayout from '../layouts/AdminLayout.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import { getPermissions } from '../services/permissions.js'

const permissions = ref([])
const allPermissions = ref([])
const loading = ref(false)
const error = ref(null)
const page = ref(1)
const limit = ref(10)
const search = ref('')

const totalPages = computed(() => {
  return Math.ceil( filteredPermissions.value.length / limit.value) || 1
})

const filteredPermissions = computed(() => {
  if (!search.value.trim()) {
    return allPermissions.value
  }
  const term = search.value.toLowerCase()

  return allPermissions.value.filter(
    (perm) =>
      perm.code?.toLowerCase().includes(term) ||
      perm.nombre?.toLowerCase().includes(term) ||
      perm.modulo?.toLowerCase().includes(term)
  )
})

function updatePagination() {
  const start = (page.value - 1) * limit.value
  const end = start + limit.value
  permissions.value = filteredPermissions.value.slice( start, end)
}

async function loadPermissions() {
  loading.value = true
  error.value = null
  try {
    const response = await getPermissions({limit: 100})
    allPermissions.value = Array.isArray(response) ? response : response.items || []
    updatePagination()
  } catch (e) {
    error.value = 'Error al cargar permisos'
  } finally {
    loading.value = false
  }
}

function previousPage() {
  if (page.value > 1) {
    page.value--
    updatePagination()
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    updatePagination()
  }
}

const debounceSearch = debounce(() => {
  page.value = 1
  updatePagination()
}, 500)

onMounted(() => {loadPermissions()})
</script>