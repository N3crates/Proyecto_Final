<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <!-- Encabezado con titulo, badge de admin y boton de nuevo usuario -->
      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Usuarios</h1>
            <p class="text-sm opacity-70">Administra usuarios del sistema ERP.</p>
          </div>
          <!-- Badge visible solo para administradores -->
          <div v-if="isAdmin()">
            <span class="badge badge-primary">Panel administrador</span>
          </div>
          <button v-if="hasPermission('users:create')" class="btn btn-primary" @click="userModal.open()">
            + Nuevo Usuario
          </button>
        </div>

        <!-- Barra de busqueda con debounce y boton manual -->
        <div class="flex gap-3 mb-4 mt-4">
          <input v-model="search" @input="debounceSearch" class="input input-bordered" placeholder="Buscar usuario..." />
          <button class="btn btn-primary" @click="doSearch">Buscar</button>
        </div>
      </div>

      <ErrorState v-if="error" :message="error" />

      <!-- Tabla de usuarios -->
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
              <td class="text-center opacity-50 py-8">Sin usuarios registrados</td>
            </tr>
            <tr v-for="user in users" :key="user.id">
              <!-- Fallbacks por si el backend cambia nombres de campo -->
              <td>{{ user.nombre || user.name }}</td>
              <td>{{ user.usuario || user.email }}</td>
              <td>{{ roleMap[user.roleId] || user.roleId || '-' }}</td>
              <td>
                <!-- Badge de estado activo/inactivo -->
                <span class="badge" :class="user.activo ? 'badge-success' : 'badge-error'">
                  {{ user.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="flex gap-2">
                <button v-if="hasPermission('users:update')" class="btn btn-sm btn-warning" @click="userModal.open(user)">Editar</button>
                <button v-if="hasPermission('users:update')" class="btn btn-sm" :class="user.activo ? 'btn-neutral' : 'btn-success'" @click="handleToggleActive(user)">
                  {{ user.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button v-if="hasPermission('users:delete')" class="btn btn-sm btn-error" @click="openDelete(user)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginacion -->
      <div class="flex justify-between items-center mt-4">
        <button class="btn btn-sm" @click="previousPage" :disabled="page <= 1">Anterior</button>
        <span>Página {{ page }}</span>
        <button class="btn btn-sm" @click="nextPage">Siguiente</button>
      </div>

    </div>

    <!-- Modales -->
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
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import { hasPermission, isAdmin } from '../utils/permissions.js'
import { useUsers } from '../composables/useUsers.js'
import { getErrorMessage } from '../utils/errorHandler.js'
import debounce from 'lodash/debounce'
import { useNotificationStore } from '../stores/notificationStore.js'
import { required, validEmail, minLength } from '../utils/validators.js'
import { getRoles } from '../services/roles'
 
const { users, loading, error, page, limit, search, loadUsers, create, update, remove, toggleActive } = useUsers()
const saving = ref(false)       // controla el estado de carga al guardar/eliminar
const selectedUser = ref(null)  // usuario seleccionado para eliminar
const userModal = ref(null)     // referencia al modal de crear/editar
const confirmDialog = ref(null) // referencia al modal de confirmacion
const roleMap = ref({})
const notifications = useNotificationStore()

// Valida y envia el usuario al backend, maneja crear y editar
async function handleSubmit(payload) {
  error.value = null

  // Validaciones de campos obligatorios y formato
  const validations = [
    required(payload.nombre, 'nombre'),
    required(payload.apellido, 'apellido'),
    required(payload.usuario, 'usuario'),
    required(payload.email, 'email'),
    validEmail(payload.email)
  ]

  // Password requerido y con minimo de 6 caracteres 
  if (payload.mode === 'create') {

    const passwordRequired = required(payload.password, 'Contraseña')
    if (passwordRequired) { error.value = passwordRequired; return }
    const passwordMinLength = minLength(payload.password, 6, 'Contraseña')
    if (passwordMinLength) { error.value = passwordMinLength; return }
  }

  const firstError = validations.find(v => v)
  if (firstError) { error.value = firstError; return }

  saving.value = true
  try {
    // Normaliza el payload, password solo se incluye si viene informado
    const cleanPayload = {
      nombre: payload.nombre?.trim(),
      apellido: payload.apellido?.trim(),
      usuario: payload.usuario?.trim(),
      email: payload.email?.trim(),
      roleId: payload.roleId,
      activo: payload.activo
    }

    // Al editar, el password es opcional
    if (payload.password) cleanPayload.password = payload.password

    if (payload.mode === 'create') {
      await create(cleanPayload)
      notifications.add('Usuario creado correctamente', 'success')
    } else {
      await update(payload.id, cleanPayload)
      notifications.add('Usuario actualizado correctamente', 'success')
    }
    userModal.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al guardar usuario')
  } finally {
    saving.value = false
  }
}

// Abre el confirm dialog guardando el usuario a eliminar
function openDelete(user) { selectedUser.value = user; confirmDialog.value.open() }

// Ejecuta la eliminacion tras confirmar
async function handleDelete() {
  saving.value = true
  error.value = null
  try {
    await remove(selectedUser.value.id)
    notifications.add('Usuario eliminado correctamente', 'success')
    confirmDialog.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al eliminar usuario')
  } finally {
    saving.value = false
    selectedUser.value = null
  }
}

// Cambia el estado activo/inactivo del usuario con manejo de error
async function handleToggleActive(user) {
  await toggleActive(user.id, !user.activo)
}

async function loadRoles() {
  try {
    const response = await getRoles({ limit: 100 })
    roleMap.value = Object.fromEntries((response || []).map(role => [role.id, role.nombre]))
  } catch (e) {
    console.error('Error cargando roles',e)
  }
}
 
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
 
onMounted(async() => {await loadRoles(), await loadUsers()})

</script>