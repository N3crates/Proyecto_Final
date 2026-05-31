<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <!-- Encabezado con titulo y boton de nuevo proveedor -->
      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Proveedores</h1>
            <p class="text-sm opacity-70">Administra los proveedores del sistema ERP.</p>
          </div>
          <button v-if="hasPermission('suppliers:create')" class="btn btn-primary" @click="supplierModal.open()">+ Nuevo Proveedor</button>
        </div>

        <!-- Barra de busqueda con debounce y boton manual -->
        <div class="flex gap-3 mt-4">
          <input v-model="search" @input="debounceSearch" class="input input-bordered" placeholder="Buscar proveedor..." />
          <button class="btn btn-primary" @click="doSearch">Buscar</button>
        </div>
      </div>

      <ErrorState v-if="error" :message="error" />

      <!-- Tabla de proveedores -->
      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Giro</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="suppliers.length === 0">
              <td colspan="6"><EmptyState title="Sin proveedores" description="No hay proveedores registrados" /></td>
            </tr>
            <tr v-for="supplier in suppliers" :key="supplier.id">
              <td>{{ supplier.nombre }}</td>
              <td>{{ supplier.email || '-' }}</td>
              <td>{{ supplier.telefono || '-' }}</td>
              <td>{{ supplier.giro || '-' }}</td>
              <td>
                <!-- Badge de estado activo/inactivo -->
                <span class="badge" :class="supplier.activo ? 'badge-success' : 'badge-error'">
                  {{ supplier.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="flex gap-2">
                <button v-if="hasPermission('suppliers:update')" class="btn btn-sm btn-warning" @click="supplierModal.open(supplier)">Editar</button>
                <button v-if="hasPermission('suppliers:update')" class="btn btn-sm" :class="supplier.activo ? 'btn-neutral' : 'btn-success'" @click="handleToggle(supplier)">
                  {{ supplier.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button v-if="hasPermission('suppliers:delete')" class="btn btn-sm btn-error" @click="openDelete(supplier)">Eliminar</button>
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
    <SupplierModal ref="supplierModal" :loading="saving" @submit="handleSubmit" />
    <ConfirmDialog ref="confirmDialog" title="Eliminar proveedor" message="¿Estás seguro de que deseas eliminar este proveedor?" :loading="saving" @confirm="handleDelete" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash'
import AdminLayout from '../layouts/AdminLayout.vue'
import SupplierModal from '../components/SupplierModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import { hasPermission } from '../utils/permissions.js'
import { useSuppliers } from '../composables/useSuppliers.js'
import { getErrorMessage } from '../utils/errorHandler.js'
import { useNotificationStore } from '../stores/notificationStore.js'
import { required } from '../utils/validators.js'

// Composable con estado y acciones de proveedores
const { suppliers, loading, error, page, total, totalPages, search, loadSuppliers, create, update, toggleActive, remove } = useSuppliers()

const saving = ref(false)
const selectedSupplier = ref(null)
const supplierModal = ref(null)
const confirmDialog = ref(null)
const notifications = useNotificationStore()

// Maneja crear y editar segun el mode que viene del modal
async function handleSubmit(payload) {
  error.value = null
  const validations = [required(payload.nombre, 'nombre')]
  const firstError = validations.find(v => v)
  if (firstError) { error.value = firstError; return }

  saving.value = true
  try {
    const cleanPayload = {
      nombre: payload.nombre?.trim(),
      rfc: payload.rfc?.trim() || null,
      email: payload.email?.trim() || null,
      telefono: payload.telefono?.trim() || null,
      direccion: payload.direccion?.trim() || null,
      contacto: payload.contacto?.trim() || null,
      giro: payload.giro?.trim() || null,
      notas: payload.notas?.trim() || null,
    }
    if (payload.mode === 'create') {
      await create(cleanPayload)
      notifications.add('Proveedor creado correctamente', 'success')
    } else {
      await update(payload.id, cleanPayload)
      notifications.add('Proveedor actualizado correctamente', 'success')
    }
    supplierModal.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al guardar proveedor')
  } finally {
    saving.value = false
  }
}

// Cambia el estado activo/inactivo del proveedor
async function handleToggle(supplier) {
  try {
    await toggleActive(supplier.id, !supplier.activo)
    notifications.add(`Proveedor ${supplier.activo ? 'desactivado' : 'activado'} correctamente`, 'success')
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al cambiar estado')
  }
}

// Abre el confirm dialog guardando el proveedor a eliminar
function openDelete(supplier) { selectedSupplier.value = supplier; confirmDialog.value.open() }

// Ejecuta la eliminacion tras confirmar
async function handleDelete() {
  saving.value = true
  try {
    await remove(selectedSupplier.value.id)
    notifications.add('Proveedor eliminado correctamente', 'success')
    confirmDialog.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al eliminar proveedor')
  } finally {
    saving.value = false
    selectedSupplier.value = null
  }
}

// Navegacion entre paginas con limite
function previousPage() { if (page.value > 1) { page.value--; loadSuppliers() } }
function nextPage() { if (page.value < totalPages.value) { page.value++; loadSuppliers() } }

// Busqueda inmediata (boton) y con debounce (input)
function doSearch() { page.value = 1; loadSuppliers() }
const debounceSearch = debounce(() => { page.value = 1; loadSuppliers() }, 500)

onMounted(() => loadSuppliers())
</script>