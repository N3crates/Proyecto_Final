<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Usuarios</h1>
            <p class="text-sm opacity-70">Administra usuarios del sistema ERP.</p>
          </div>
          <button class="btn btn-primary" @click="userModal.open()">+ Nuevo Usuario</button>
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
              <td colspan="5" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="5" class="text-center opacity-50 py-8">Sin usuarios registrados</td>
            </tr>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.nombre }}</td>
              <td>{{ user.usuario }}</td>
              <td>{{ user.rol || '-' }}</td>
              <td>
                <span class="badge" :class="user.activo ? 'badge-success' : 'badge-error'">
                  {{ user.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="flex gap-2">
                <button class="btn btn-sm btn-warning" @click="userModal.open(user)">Editar</button>
                <button class="btn btn-sm" :class="user.activo ? 'btn-neutral' : 'btn-success'" @click="handleToggle(user)">
                  {{ user.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button class="btn btn-sm btn-error" @click="openDelete(user)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <UserModal ref="userModal" :loading="saving" @submit="handleSubmit" />
    <ConfirmDialog ref="confirmDialog" title="Eliminar usuario" message="¿Estás seguro de que deseas eliminar este usuario?" :loading="saving" @confirm="handleDelete" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import UserModal from '../components/UserModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { getUsers, createUser, updateUser, toggleUserActive, deleteUser } from '../services/users.js'

const users = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref(null)
const success = ref(null)
const selectedUser = ref(null)
const userModal = ref(null)
const confirmDialog = ref(null)

function showSuccess(msg) { success.value = msg; setTimeout(() => success.value = null, 3000) }

async function loadUsers() {
  loading.value = true; error.value = null
  try { users.value = await getUsers() }
  catch (e) { error.value = 'Error al cargar usuarios' }
  finally { loading.value = false }
}

async function handleSubmit(payload) {
  saving.value = true; error.value = null
  try {
    if (payload.mode === 'create') { await createUser(payload); showSuccess('Usuario creado correctamente') }
    else { await updateUser(payload.id, payload); showSuccess('Usuario actualizado correctamente') }
    userModal.value.close()
    await loadUsers()
  } catch (e) { error.value = 'Error al guardar usuario' }
  finally { saving.value = false }
}

async function handleToggle(user) {
  try {
    await toggleUserActive(user.id, !user.activo)
    showSuccess(`Usuario ${user.activo ? 'desactivado' : 'activado'} correctamente`)
    await loadUsers()
  } catch (e) { error.value = 'Error al cambiar estado del usuario' }
}

function openDelete(user) { selectedUser.value = user; confirmDialog.value.open() }

async function handleDelete() {
  saving.value = true; error.value = null
  try {
    await deleteUser(selectedUser.value.id)
    showSuccess('Usuario eliminado correctamente')
    confirmDialog.value.close()
    await loadUsers()
  } catch (e) { error.value = 'Error al eliminar usuario' }
  finally { saving.value = false; selectedUser.value = null }
}

onMounted(() => loadUsers())
</script>