<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <h1 class="text-2xl font-bold">Permisos</h1>
        <p class="text-sm opacity-70">Visualiza los permisos disponibles en el sistema.</p>
      </div>

      <ErrorState v-if="error" :message="error" />

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
              <td colspan="4" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="permissions.length === 0">
              <td colspan="4"><EmptyState title="Sin permisos" description="No hay permisos registrados" /></td>
            </tr>
            <tr v-for="perm in permissions" :key="perm.id">
              <td class="font-mono text-sm">{{ perm.code }}</td>
              <td>{{ perm.nombre }}</td>
              <td><span class="badge badge-outline">{{ perm.modulo }}</span></td>
              <td class="opacity-70 text-sm">{{ perm.descripcion || '-' }}</td>
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
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import { getPermissions } from '../services/permissions.js'

const permissions = ref([])
const loading = ref(false)
const error = ref(null)

async function loadPermissions() {
  loading.value = true
  error.value = null
  try {
    const response = await getPermissions({ limit: 100 })
    permissions.value = response.items || []
  } catch (e) {
    error.value = 'Error al cargar permisos'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadPermissions())
</script>