<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Usuarios</h1>
            <p class="text-sm opacity-70">Administra usuarios del sistema ERP.</p>
          </div>
          <button class="btn btn-primary">+ Nuevo Usuario</button>
        </div>
      </div>

      <!-- Alerta de error -->
      <div v-if="error" class="alert alert-error">
        <span>{{ error }}</span>
      </div>

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
                <button class="btn btn-sm btn-warning">Editar</button>
                <button class="btn btn-sm btn-error">Eliminar</button>
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
import { getUsers } from '../services/users.js'

const users = ref([])
const loading = ref(false)
const error = ref(null)

async function loadUsers() {
  loading.value = true
  error.value = null
  try {
    users.value = await getUsers()
  } catch (e) {
    error.value = 'Error al cargar usuarios'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadUsers())
</script>