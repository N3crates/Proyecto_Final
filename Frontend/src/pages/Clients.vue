<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Clientes</h1>
            <p class="text-sm opacity-70">Administra los clientes del sistema ERP.</p>
          </div>
          <button v-if="hasPermission('clients:create')" class="btn btn-primary" @click="clientModal.open()">+ Nuevo Cliente</button>
        </div>
        <div class="flex gap-3 mt-4">
          <input v-model="search" @input="debounceSearch" class="input input-bordered" placeholder="Buscar cliente..." />
          <button class="btn btn-primary" @click="doSearch">Buscar</button>
        </div>
      </div>

      <ErrorState v-if="error" :message="error" />

      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="clients.length === 0">
              <td colspan="5"><EmptyState title="Sin clientes" description="No hay clientes registrados" /></td>
            </tr>
            <tr v-for="client in clients" :key="client.id">
              <td>{{ client.nombre }}</td>
              <td>{{ client.email || '-' }}</td>
              <td>{{ client.telefono || '-' }}</td>
              <td>
                <span class="badge" :class="client.activo ? 'badge-success' : 'badge-error'">
                  {{ client.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="flex gap-2">
                <button v-if="hasPermission('clients:update')" class="btn btn-sm btn-warning" @click="clientModal.open(client)">Editar</button>
                <button v-if="hasPermission('clients:update')" class="btn btn-sm" :class="client.activo ? 'btn-neutral' : 'btn-success'" @click="handleToggle(client)">
                  {{ client.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button v-if="hasPermission('clients:delete')" class="btn btn-sm btn-error" @click="openDelete(client)">Eliminar</button>
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

    <ClientModal ref="clientModal" :loading="saving" @submit="handleSubmit" />
    <ConfirmDialog ref="confirmDialog" title="Eliminar cliente" message="¿Estás seguro de que deseas eliminar este cliente?" :loading="saving" @confirm="handleDelete" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash'
import AdminLayout from '../layouts/AdminLayout.vue'
import ClientModal from '../components/ClientModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import { hasPermission } from '../utils/permissions.js'
import { useClients } from '../composables/useClients.js'
import { getErrorMessage } from '../utils/errorHandler.js'
import { useNotificationStore } from '../stores/notificationStore.js'
import { required } from '../utils/validators.js'

const { clients, loading, error, page, search, loadClients, create, update, toggleActive, remove } = useClients()
const saving = ref(false)
const selectedClient = ref(null)
const clientModal = ref(null)
const confirmDialog = ref(null)
const notifications = useNotificationStore()

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
      notas: payload.notas?.trim() || null,
    }
    if (payload.mode === 'create') { await create(cleanPayload); notifications.add('Cliente creado correctamente', 'success') }
    else { await update(payload.id, cleanPayload); notifications.add('Cliente actualizado correctamente', 'success') }
    clientModal.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al guardar cliente')
  } finally {
    saving.value = false
  }
}

async function handleToggle(client) {
  try {
    await toggleActive(client.id, !client.activo)
    notifications.add(`Cliente ${client.activo ? 'desactivado' : 'activado'} correctamente`, 'success')
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al cambiar estado')
  }
}

function openDelete(client) { selectedClient.value = client; confirmDialog.value.open() }

async function handleDelete() {
  saving.value = true
  try {
    await remove(selectedClient.value.id)
    notifications.add('Cliente eliminado correctamente', 'success')
    confirmDialog.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al eliminar cliente')
  } finally {
    saving.value = false
    selectedClient.value = null
  }
}

function previousPage() { if (page.value > 1) { page.value--; loadClients() } }
function nextPage() { page.value++; loadClients() }
function doSearch() { page.value = 1; loadClients() }
const debounceSearch = debounce(() => { page.value = 1; loadClients() }, 500)

onMounted(() => loadClients())
</script>