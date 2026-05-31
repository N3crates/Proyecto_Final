<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p class="text-sm opacity-70">Resumen general del sistema.</p>
      </div>

      <!-- Alerta de error -->
      <div v-if="error" class="alert alert-error">
        <span>{{ error }}</span>
      </div>

      <!-- Cards de métricas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card bg-base-200 shadow cursor-pointer hover:shadow-xl transition-shadow" @click="$router.push('/users')">
          <div class="card-body">
            <h3 class="text-sm opacity-60">Usuarios</h3>
            <p class="text-3xl font-bold">{{ loading ? '...' : summary.totals?.users ?? 0 }}</p>
          </div>
        </div>

        <div class="card bg-base-200 shadow cursor-pointer hover:shadow-xl transition-shadow" @click="$router.push('/clients')">
          <div class="card-body">
            <h3 class="text-sm opacity-60">Clientes</h3>
            <p class="text-3xl font-bold">{{ loading ? '...' : summary.totals?.clients ?? 0 }}</p>
          </div>
        </div>

        <div class="card bg-base-200 shadow cursor-pointer hover:shadow-xl transition-shadow" @click="$router.push('/suppliers')">
          <div class="card-body">
            <h3 class="text-sm opacity-60">Proveedores</h3>
            <p class="text-3xl font-bold">{{ loading ? '...' : summary.totals?.suppliers ?? 0 }}</p>
          </div>
        </div>

        <div class="card bg-base-200 shadow cursor-pointer hover:shadow-xl transition-shadow" @click="$router.push('/products')">
          <div class="card-body">
            <h3 class="text-sm opacity-60">Productos</h3>
            <p class="text-3xl font-bold">{{ loading ? '...' : summary.totals?.products ?? 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Productos con bajo stock -->
      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg p-6">
        <h2 class="text-lg font-bold mb-4">Productos con bajo stock</h2>
        <div v-if="loading" class="text-center py-4">
          <span class="loading loading-spinner"></span>
        </div>
        <ul v-else-if="summary.lowStockProducts?.length > 0" class="space-y-2">
          <li v-for="p in summary.lowStockProducts" :key="p.id" class="flex justify-between items-center">
            <span>{{ p.nombre || p.name }}</span>
            <span class="badge badge-warning">Stock: {{ p.stock }}</span>
          </li>
        </ul>
        <p v-else class="text-center opacity-50">Sin productos con bajo stock</p>
      </div>
      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg p-6">
        <h2 class="text-lg font-bold mb-4">Actividad reciente</h2>
        <div v-if="loading" class="text-center py-4">
        <span class="loading loading-spinner"></span>
      </div>
      <div v-else-if="recentAudit.length" class="space-y-3">
        <div v-for="item in recentAudit" :key="item.id" class="flex items-center justify-between rounded-xl border border-base-300 p-3">
          <div>
            <p class="font-semibold">{{ item.action || item.accion }}</p>
            <p class="text-sm opacity-60">{{ item.module || item.modulo }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm">{{ item.userName || item.usuario || 'Sistema' }}</p>
          </div>
        </div>
      </div>
        <p v-else class="text-center opacity-50">Sin actividad reciente</p>
      </div>
      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg p-6">
        <h2 class="text-lg font-bold mb-4">Recepciones recientes</h2>
        <div v-if="loading" class="text-center py-4">
          <span class="loading loading-spinner"></span>
        </div>
        <div v-else-if="summary.recepcionesRecientes?.length" class="space-y-3">
          <div v-for="recepcion in summary.recepcionesRecientes" :key="recepcion.id" class="flex items-center justify-between rounded-xl border border-base-300 p-3">
            <div>
              <p class="font-semibold">{{ recepcion.folio || 'Recepción' }}</p>
              <p class="text-sm opacity-60">{{ recepcion.proveedorNombre || 'Proveedor' }}</p>
            </div>
            <div class="text-right">
              <span class="badge badge-success">{{ recepcion.estado || 'Confirmada' }}</span>
            </div>
          </div>
        </div>
        <p v-else class="text-center opacity-50">Sin recepciones recientes</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import api from '../services/api.js'

const summary = ref({})
const loading = ref(false)
const error = ref(null)
const recentAudit = ref([])

async function loadSummary() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get('/dashboard/summary')

    const auditResponse = await api.get('/audit?limit=3')
    recentAudit.value = auditResponse.data.items || []

    summary.value = data
  } catch (e) {
    error.value = 'Error al cargar el dashboard'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadSummary())
</script>