<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <!-- Encabezado con titulo y boton de nueva recepcion -->
      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Recepciones</h1>
            <p class="text-sm opacity-70">Registro y confirmación de recepciones de productos.</p>
          </div>
          <button v-if="hasPermission('recepciones:create')" class="btn btn-primary" @click="recepcionModal.open()">+ Nueva Recepción</button>
        </div>

        <!-- Barra de busqueda con debounce y boton manual -->
        <div class="flex gap-3 mt-4">
          <input v-model="search" @input="debounceSearch" class="input input-bordered" placeholder="Buscar recepción..." />
          <button class="btn btn-primary" @click="doSearch">Buscar</button>
        </div>
      </div>

      <ErrorState v-if="error" :message="error" />

      <!-- Tabla de recepciones -->
      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="recepciones.length === 0">
              <td colspan="6"><EmptyState title="Sin recepciones" description="No hay recepciones registradas" /></td>
            </tr>
            <tr v-for="rec in recepciones" :key="rec.id">
              <td class="font-mono text-sm">{{ rec.folio }}</td>
              <!-- Fallback por si el backend no popula el nombre del proveedor -->
              <td>{{ rec.supplierNombre || rec.supplierId || '-' }}</td>
              <td>{{ rec.fecha ? new Date(rec.fecha).toLocaleDateString() : '-' }}</td>
              <td>{{ rec.items?.length || 0 }} productos</td>
              <td>
                <!-- Badge segun estado: CONFIRMED o borrador -->
                <span class="badge" :class="rec.status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'">
                  {{ rec.status === 'CONFIRMED' ? 'Confirmado' : 'Borrador' }}
                </span>
              </td>
              <td class="flex gap-2">
                <!-- Acciones solo disponibles si la recepcion no esta confirmada -->
                <button v-if="hasPermission('recepciones:update') && rec.status !== 'CONFIRMED'" class="btn btn-sm btn-success" @click="handleConfirm(rec)">Confirmar</button>
                <button v-if="hasPermission('recepciones:update') && rec.status !== 'CONFIRMED'" class="btn btn-sm btn-warning" @click="recepcionModal.open(rec)">Editar</button>
                <button v-if="hasPermission('recepciones:delete') && rec.status !== 'CONFIRMED'" class="btn btn-sm btn-error" @click="openDelete(rec)">Eliminar</button>
              </td>
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

    <!-- Modales -->
    <RecepcionModal ref="recepcionModal" :loading="saving" @submit="handleSubmit" />
    <ConfirmDialog ref="confirmDialog" title="Eliminar recepción" message="¿Estás seguro de que deseas eliminar esta recepción?" :loading="saving" @confirm="handleDelete" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash'
import AdminLayout from '../layouts/AdminLayout.vue'
import RecepcionModal from '../components/RecepcionModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import { hasPermission } from '../utils/permissions.js'
import { useRecepciones } from '../composables/useRecepciones.js'
import { getErrorMessage } from '../utils/errorHandler.js'
import { useNotificationStore } from '../stores/notificationStore.js'

// Composable con estado y acciones de recepciones
const { recepciones, loading, error, page, total, totalPages, search, loadRecepciones, create, update, confirm, remove } = useRecepciones()

const saving = ref(false)
const selectedRec = ref(null)
const recepcionModal = ref(null)
const confirmDialog = ref(null)
const notifications = useNotificationStore()

// Valida y envia la recepcion al backend — maneja crear y editar
async function handleSubmit(payload) {
  error.value = null
  if (!payload.supplierId) { error.value = 'Selecciona un proveedor'; return }
  if (!payload.folio) { error.value = 'El folio es obligatorio'; return }
  if (!payload.fecha) { error.value = 'La fecha es obligatoria'; return }
  if (!payload.items?.length) { error.value = 'Agrega al menos un producto'; return }

  saving.value = true
  try {
    // Normaliza el payload y convierte cantidades y costos a numeros
    const cleanPayload = {
      supplierId: payload.supplierId,
      folio: payload.folio.trim(),
      fecha: payload.fecha,
      comentarios: payload.comentarios?.trim() || null,
      items: payload.items.map(i => ({
        productId: i.productId,
        cantidad: Number(i.cantidad),
        costoUnitario: Number(i.costoUnitario)
      }))
    }
    if (payload.mode === 'create') {
      await create(cleanPayload)
      notifications.add('Recepción creada correctamente', 'success')
    } else {
      await update(payload.id, cleanPayload)
      notifications.add('Recepción actualizada correctamente', 'success')
    }
    recepcionModal.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al guardar recepcion')
  } finally {
    saving.value = false
  }
}

// Confirma la recepcion — despues de esto ya no se puede editar ni eliminar
async function handleConfirm(rec) {
  saving.value = true
  try {
    await confirm(rec.id)
    notifications.add('Recepción confirmada correctamente', 'success')
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al confirmar recepcion')
  } finally {
    saving.value = false
  }
}

function openDelete(rec) { selectedRec.value = rec; confirmDialog.value.open() }

async function handleDelete() {
  saving.value = true
  try {
    await remove(selectedRec.value.id)
    notifications.add('Recepción eliminada correctamente', 'success')
    confirmDialog.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al eliminar recepcion')
  } finally {
    saving.value = false
    selectedRec.value = null
  }
}

// Navegacion entre paginas con limite
function previousPage() { if (page.value > 1) { page.value--; loadRecepciones() } }
function nextPage() { if (page.value < totalPages.value) { page.value++; loadRecepciones() } }

// Busqueda inmediata (boton) y con debounce (input)
function doSearch() { page.value = 1; loadRecepciones() }
const debounceSearch = debounce(() => { page.value = 1; loadRecepciones() }, 500)

onMounted(() => loadRecepciones())
</script>