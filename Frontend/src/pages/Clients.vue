<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Clientes</h1>
            <p class="text-sm opacity-70">Administra los clientes del sistema ERP.</p>
          </div>
          <button class="btn btn-primary" @click="clientModal.open()">+ Nuevo Cliente</button>
        </div>
      </div>

      <div v-if="error" class="alert alert-error"><span>{{ error }}</span></div>
      <div v-if="success" class="alert alert-success"><span>{{ success }}</span></div>

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
              <td colspan="5" class="text-center opacity-50 py-8">Sin clientes registrados</td>
            </tr>
            <tr v-for="client in clients" :key="client.id">
              <td>{{ client.nombre || client.name }}</td>
              <td>{{ client.email }}</td>
              <td>{{ client.telefono || client.phone || '-' }}</td>
              <td>
                <span class="badge" :class="client.active ? 'badge-success' : 'badge-error'">
                  {{ client.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="flex gap-2">
                <button class="btn btn-sm btn-warning" @click="clientModal.open(client)">Editar</button>
                <button class="btn btn-sm btn-error" @click="openDelete(client)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <ClientModal ref="clientModal" :loading="saving" @submit="handleSubmit" />
    <ConfirmDialog ref="confirmDialog" title="Eliminar cliente" message="¿Estás seguro de que deseas eliminar este cliente?" :loading="saving" @confirm="handleDelete" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import ClientModal from '../components/ClientModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { getClients, createClient, updateClient, deleteClient } from '../services/clients.js'

const clients = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref(null)
const success = ref(null)
const selectedClient = ref(null)
const clientModal = ref(null)
const confirmDialog = ref(null)

function showSuccess(msg) { success.value = msg; setTimeout(() => success.value = null, 3000) }

async function loadClients() {
  loading.value = true; error.value = null
  try { clients.value = await getClients() }
  catch (e) { error.value = 'Error al cargar clientes' }
  finally { loading.value = false }
}

async function handleSubmit(payload) {
  saving.value = true; error.value = null
  try {
    if (payload.mode === 'create') { await createClient(payload); showSuccess('Cliente creado correctamente') }
    else { await updateClient(payload.id, payload); showSuccess('Cliente actualizado correctamente') }
    clientModal.value.close()
    await loadClients()
  } catch (e) { error.value = 'Error al guardar cliente' }
  finally { saving.value = false }
}

function openDelete(client) { selectedClient.value = client; confirmDialog.value.open() }

async function handleDelete() {
  saving.value = true; error.value = null
  try {
    await deleteClient(selectedClient.value.id)
    showSuccess('Cliente eliminado correctamente')
    confirmDialog.value.close()
    await loadClients()
  } catch (e) { error.value = 'Error al eliminar cliente' }
  finally { saving.value = false; selectedClient.value = null }
}

onMounted(() => loadClients())
</script>