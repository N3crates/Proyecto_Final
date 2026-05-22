<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Inventario</h1>
            <p class="text-sm opacity-70">Consulta y ajusta el stock de productos.</p>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <input v-model="search" @input="debounceSearch" class="input input-bordered" placeholder="Buscar producto..." />
          <button class="btn btn-primary" @click="doSearch">Buscar</button>
        </div>
      </div>

      <ErrorState v-if="error" :message="error" />

      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="inventory.length === 0">
              <td colspan="6"><EmptyState title="Sin registros" description="No hay productos en inventario" /></td>
            </tr>
            <tr v-for="item in inventory" :key="item.productId">
              <td class="font-mono text-sm">{{ item.sku || '-' }}</td>
              <td>{{ item.productNombre || item.nombre || '-' }}</td>
              <td>
                <span :class="item.stock <= item.stockMinimo ? 'text-error font-bold' : ''">
                  {{ item.stock ?? '-' }}
                </span>
              </td>
              <td>{{ item.stockMinimo ?? '-' }}</td>
              <td>
                <span class="badge" :class="item.stock <= item.stockMinimo ? 'badge-warning' : 'badge-success'">
                  {{ item.stock <= item.stockMinimo ? 'Bajo stock' : 'OK' }}
                </span>
              </td>
              <td>
                <button v-if="hasPermission('inventory:update')" class="btn btn-sm btn-primary" @click="adjustModal.open(item)">Ajustar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center mt-4">
        <button class="btn btn-sm" @click="previousPage" :disabled="page <= 1">Anterior</button>
        <span>Página {{ page }}</span>
        <button class="btn btn-sm" @click="nextPage">Siguiente</button>
      </div>

    </div>

    <AdjustModal ref="adjustModal" :loading="saving" @submit="handleAdjust" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash'
import AdminLayout from '../layouts/AdminLayout.vue'
import AdjustModal from '../components/AdjustModal.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import { hasPermission } from '../utils/permissions.js'
import { useInventory } from '../composables/useInventory.js'
import { adjustInventory } from '../services/inventory.js'
import { getErrorMessage } from '../utils/errorHandler.js'
import { useNotificationStore } from '../stores/notificationStore.js'

const { inventory, loading, error, page, search, loadInventory } = useInventory()
const saving = ref(false)
const adjustModal = ref(null)
const notifications = useNotificationStore()

async function handleAdjust(payload) {
  if (!payload.tipo) { error.value = 'Selecciona un tipo de ajuste'; return }
  if (!payload.motivo) { error.value = 'El motivo es obligatorio'; return }

  saving.value = true
  error.value = null
  try {
    await adjustInventory(payload.productId, {
      tipo: payload.tipo,
      cantidad: Number(payload.cantidad),
      motivo: payload.motivo.trim(),
      referencia: payload.referencia?.trim() || null
    })
    notifications.add('Inventario ajustado correctamente', 'success')
    adjustModal.value.close()
    await loadInventory()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al ajustar inventario')
  } finally {
    saving.value = false
  }
}

function previousPage() { if (page.value > 1) { page.value--; loadInventory() } }
function nextPage() { page.value++; loadInventory() }
function doSearch() { page.value = 1; loadInventory() }
const debounceSearch = debounce(() => { page.value = 1; loadInventory() }, 500)

onMounted(() => loadInventory())
</script>