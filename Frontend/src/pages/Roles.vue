<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Roles</h1>
            <p class="text-sm opacity-70">Gestiona los roles del sistema.</p>
          </div>
          <button v-if="hasPermission('roles:create')" class="btn btn-primary" @click="roleModal.open()">+ Nuevo Rol</button>
        </div>
        <div class="flex gap-3 mt-4">
          <input v-model="search" @input="debounceSearch" class="input input-bordered" placeholder="Buscar rol..." />
          <button class="btn btn-primary" @click="doSearch">Buscar</button>
        </div>
      </div>

      <ErrorState v-if="error" :message="error" />

      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Permisos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="roles.length === 0">
              <td colspan="4"><EmptyState title="Sin roles" description="No hay roles registrados" /></td>
            </tr>
            <tr v-for="role in roles" :key="role.id">
              <td class="font-semibold">{{ role.nombre }}</td>
              <td class="opacity-70">{{ role.descripcion || '-' }}</td>
              <td>
                <span class="badge badge-outline">{{ role.permissions?.length || 0 }} permisos</span>
              </td>
              <td class="flex gap-2">
                <button v-if="hasPermission('roles:update')" class="btn btn-sm btn-warning" @click="roleModal.open(role)">Editar</button>
                <button v-if="hasPermission('roles:delete')" class="btn btn-sm btn-error" @click="openDelete(role)">Eliminar</button>
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

    <RoleModal ref="roleModal" :loading="saving" @submit="handleSubmit" />
    <ConfirmDialog ref="confirmDialog" title="Eliminar rol" message="¿Estás seguro de que deseas eliminar este rol?" :loading="saving" @confirm="handleDelete" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash'
import AdminLayout from '../layouts/AdminLayout.vue'
import RoleModal from '../components/RoleModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import { hasPermission } from '../utils/permissions.js'
import { useRoles } from '../composables/useRoles.js'
import { getErrorMessage } from '../utils/errorHandler.js'
import { useNotificationStore } from '../stores/notificationStore.js'
import { required } from '../utils/validators.js'

const { roles, loading, error, page, search, loadRoles, create, update, remove } = useRoles()
const saving = ref(false)
const selectedRole = ref(null)
const roleModal = ref(null)
const confirmDialog = ref(null)
const notifications = useNotificationStore()

async function handleSubmit(payload) {
  error.value = null
  const firstError = required(payload.nombre, 'nombre')
  if (firstError) { error.value = firstError; return }

  saving.value = true
  try {
    const cleanPayload = {
      nombre: payload.nombre?.trim(),
      descripcion: payload.descripcion?.trim() || null,
      permissions: payload.permissions || []
    }
    if (payload.mode === 'create') { await create(cleanPayload); notifications.add('Rol creado correctamente', 'success') }
    else { await update(payload.id, cleanPayload); notifications.add('Rol actualizado correctamente', 'success') }
    roleModal.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al guardar rol')
  } finally {
    saving.value = false
  }
}

function openDelete(role) { selectedRole.value = role; confirmDialog.value.open() }

async function handleDelete() {
  saving.value = true
  try {
    await remove(selectedRole.value.id)
    notifications.add('Rol eliminado correctamente', 'success')
    confirmDialog.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al eliminar rol')
  } finally {
    saving.value = false
    selectedRole.value = null
  }
}

function previousPage() { if (page.value > 1) { page.value--; loadRoles() } }
function nextPage() { page.value++; loadRoles() }
function doSearch() { page.value = 1; loadRoles() }
const debounceSearch = debounce(() => { page.value = 1; loadRoles() }, 500)

onMounted(() => loadRoles())
</script>