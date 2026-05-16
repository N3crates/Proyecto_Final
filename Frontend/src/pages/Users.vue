<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">
 
      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Usuarios</h1>
            <p class="text-sm opacity-70">Administra usuarios del sistema ERP.</p>
          </div>
          <button v-if="hasPermission('users:create')" class="btn btn-primary" @click="userModal.open()">
            + Nuevo Usuario
          </button>
        </div>
        <div class="flex gap-3 mb-4 mt-4">
          <input v-model="search" @input="debounceSearch" class="input input-bordered" placeholder="Buscar usuario..." />
          <button class="btn btn-primary" @click="doSearch">Buscar</button>
        </div>
      </div>
 
      <div v-if="error" class="alert alert-error"><span>{{ error }}</span></div>
      <div v-if="success" class="alert alert-success"><span>{{ success }}</span></div>
 
      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-8">
                <span class="loading loading-spinner"></span>
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="5" class="text-center opacity-50 py-8">Sin usuarios registrados</td>
            </tr>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.nombre || user.name }}</td>
              <td>{{ user.usuario || user.email }}</td>
              <td>{{ user.rol || '-' }}</td>
              <td>
                <span class="badge" :class="user.active ? 'badge-success' : 'badge-error'">
                  {{ user.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="flex gap-2">
                <button v-if="hasPermission('users:update')" class="btn btn-sm btn-warning" @click="userModal.open(user)">Editar</button>
                <button v-if="hasPermission('users:delete')" class="btn btn-sm btn-error" @click="openDelete(user)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
 
      <div class="flex justify-between items-center mt-4">
        <!-- FIX: usar funciones en lugar de mutar page directamente en el template -->
        <button class="btn btn-sm" @click="previousPage" :disabled="page <= 1">Anterior</button>
        <span>Página {{ page }}</span>
        <button class="btn btn-sm" @click="nextPage">Siguiente</button>
      </div>
    </div>
 
    <UserModal ref="userModal" :loading="saving" @submit="handleSubmit" />
    <ConfirmDialog
      ref="confirmDialog"
      title="Eliminar usuario"
      message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
      :loading="saving"
      @confirm="handleDelete"
    />
  </AdminLayout>
</template>
 
<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import UserModal from '../components/UserModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { hasPermission } from '../utils/permissions.js'
import { useUsers } from '../composables/useUsers.js'
import { getErrorMessage } from '../utils/errorHandler.js'
import debounce from 'lodash/debounce'
import { useNotificationStore } from '../stores/notificationStore.js'
 
const { users, loading, error, page, limit, search, loadUsers, create, update, remove } = useUsers()
const saving = ref(false)
const success = ref(null)
const selectedUser = ref(null)
const userModal = ref(null)
const confirmDialog = ref(null)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const notifications = useNotificationStore()
 
function showSuccess(msg) {
  success.value = msg
  setTimeout(() => { success.value = null }, 3000)
}
 
async function handleSubmit(payload) {
  error.value = null
 
  // FIX: todas las validaciones antes de poner saving = true
  if (!payload.nombre) {
    error.value = 'El nombre es obligatorio'
    return
  }
  if (!payload.apellido) {
    error.value = 'El apellido es obligatorio'
    return
  }
  if (!payload.usuario) {
    error.value = 'El usuario es obligatorio'
    return
  }
  if (!payload.email) {
    error.value = 'El email es obligatorio'
    return
  }
  if (!emailRegex.test(payload.email)) {
    error.value = 'Correo electrónico inválido'
    return
  }
  // FIX: faltaba el return cuando no hay contraseña en modo create
  if (payload.mode === 'create' && !payload.password) {
    error.value = 'La contraseña es obligatoria'
    return
  }
 
  saving.value = true
  try {
    const cleanPayload = {
      nombre: payload.nombre?.trim(),
      apellido: payload.apellido?.trim(),
      usuario: payload.usuario?.trim(),
      email: payload.email?.trim(),
      password: payload.password,
      roleId: payload.roleId,
      activo: payload.activo
    }
 
    if (payload.mode === 'create') {
      // FIX: create() ya llama loadUsers() internamente en el composable,
      // no hace falta llamarlo de nuevo aquí
      await create(cleanPayload)
      notifications.add('Usuario creado correctamente', 'success')
    } else {
      await update(payload.id, cleanPayload)
      showSuccess('Usuario actualizado correctamente')
    }
    userModal.value.close()
  } catch (e) {
    console.error(e)
    error.value = getErrorMessage(e, 'Error al guardar usuario')
  } finally {
    saving.value = false
  }
}
 
function openDelete(user) {
  selectedUser.value = user
  confirmDialog.value.open()
}
 
async function handleDelete() {
  saving.value = true
  error.value = null
  try {
    // FIX: era `delete(...)` que es palabra reservada de JS — debe ser `remove(...)`
    await remove(selectedUser.value.id)
    showSuccess('Usuario eliminado correctamente')
    confirmDialog.value.close()
  } catch (e) {
    console.error(e)
    error.value = getErrorMessage(e, 'Error al eliminar usuario')
  } finally {
    saving.value = false
    selectedUser.value = null
  }
}
 
// FIX: page es un ref del composable, hay que usar .value
function previousPage() {
  if (page.value > 1) {
    page.value--
    loadUsers()
  }
}
 
function nextPage() {
  page.value++
  loadUsers()
}
 
function doSearch() {
  page.value = 1
  loadUsers()
}
 
const debounceSearch = debounce(() => {
  page.value = 1
  loadUsers()
}, 500)
 
onMounted(() => loadUsers())
</script>