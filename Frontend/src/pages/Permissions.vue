<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <!-- Encabezado con titulo y buscador — igual que el resto de paginas -->
      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Permisos</h1>
            <p class="text-sm opacity-70">Visualiza los permisos disponibles en el sistema.</p>
          </div>
        </div>

        <!-- Barra de busqueda con debounce y boton manual -->
        <div class="flex gap-3 mt-4">
          <input v-model="search" @input="debounceSearch" type="text" placeholder="Buscar permiso..." class="input input-bordered"/>
          <button class="btn btn-primary" @click="doSearch">Buscar</button>
        </div>
      </div>

      <ErrorState v-if="error" :message="error"/>

      <!-- Tabla de permisos -->
      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
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
              <!-- Codigo en monospace por ser formato recurso:accion -->
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

      <!-- Paginacion con limite real por totalPages -->
      <div class="flex justify-between items-center mt-4">
        <button class="btn btn-sm" @click="previousPage" :disabled="page <= 1">Anterior</button>
        <span>Página {{ page }} de {{ totalPages }}</span>
        <button class="btn btn-sm" @click="nextPage" :disabled="page >= totalPages">Siguiente</button>
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

// Lista visible (pagina actual) y lista completa para filtrar
const permissions = ref([])
const allPermissions = ref([])
const loading = ref(false)
const error = ref(null)
const page = ref(1)
const limit = ref(10)
const search = ref('')

// Total de paginas calculado sobre los resultados filtrados
const totalPages = computed(() => Math.ceil(filteredPermissions.value.length / limit.value) || 1)

// Filtra en el cliente por codigo, nombre o modulo
const filteredPermissions = computed(() => {
  if (!search.value.trim()) return allPermissions.value
  const term = search.value.toLowerCase()
  return allPermissions.value.filter(
    (perm) =>
      perm.code?.toLowerCase().includes(term) ||
      perm.nombre?.toLowerCase().includes(term) ||
      perm.modulo?.toLowerCase().includes(term)
  )
})

// Corta el slice de la pagina actual desde los resultados filtrados
function updatePagination() {
  const start = (page.value - 1) * limit.value
  permissions.value = filteredPermissions.value.slice(start, start + limit.value)
}

// Carga todos los permisos de una sola vez para filtrar en el cliente
async function loadPermissions() {
  loading.value = true
  error.value = null
  try {
    const response = await getPermissions({ limit: 100 })
    allPermissions.value = Array.isArray(response) ? response : response.items || []
    updatePagination()
  } catch (e) {
    error.value = 'Error al cargar permisos'
  } finally {
    loading.value = false
  }
}

// Navegacion entre paginas
function previousPage() {
  if (page.value > 1) { page.value--; updatePagination() }
}

function nextPage() {
  if (page.value < totalPages.value) { page.value++; updatePagination() }
}

// Busqueda inmediata (boton) y con debounce (input)
function doSearch() { page.value = 1; updatePagination() }
const debounceSearch = debounce(() => { page.value = 1; updatePagination() }, 500)

onMounted(() => loadPermissions())
</script>