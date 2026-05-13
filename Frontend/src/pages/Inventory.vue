<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Inventario</h1>
            <p class="text-sm opacity-70">Consulta y ajusta el stock de productos.</p>
          </div>
          <button class="btn btn-primary">+ Ajustar Inventario</button>
        </div>
      </div>

      <div v-if="error" class="alert alert-error"><span>{{ error }}</span></div>

      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="inventory.length === 0">
              <td colspan="5" class="text-center opacity-50 py-8">Sin registros de inventario</td>
            </tr>
            <tr v-for="item in inventory" :key="item.id">
              <td>{{ item.producto || item.productName || item.nombre || '-' }}</td>
              <td>{{ item.stockActual ?? item.stock ?? '-' }}</td>
              <td>{{ item.stockMinimo ?? item.minStock ?? '-' }}</td>
              <td>
                <span class="badge" :class="(item.stockActual ?? item.stock) <= (item.stockMinimo ?? item.minStock) ? 'badge-warning' : 'badge-success'">
                  {{ (item.stockActual ?? item.stock) <= (item.stockMinimo ?? item.minStock) ? 'Bajo stock' : 'OK' }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-warning">Ajustar</button>
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
import { getInventory } from '../services/inventory.js'

const inventory = ref([])
const loading = ref(false)
const error = ref(null)

async function loadInventory() {
  loading.value = true
  error.value = null
  try {
    inventory.value = await getInventory()
  } catch (e) {
    error.value = 'Error al cargar inventario'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadInventory())
</script>