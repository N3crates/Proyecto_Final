<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Proveedores</h1>
            <p class="text-sm opacity-70">Administra los proveedores del sistema ERP.</p>
          </div>
          <button class="btn btn-primary">+ Nuevo Proveedor</button>
        </div>
      </div>

      <div v-if="error" class="alert alert-error"><span>{{ error }}</span></div>

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
            <tr v-else-if="suppliers.length === 0">
              <td colspan="5" class="text-center opacity-50 py-8">Sin proveedores registrados</td>
            </tr>
            <tr v-for="supplier in suppliers" :key="supplier.id">
              <td>{{ supplier.nombre || supplier.name }}</td>
              <td>{{ supplier.email }}</td>
              <td>{{ supplier.telefono || supplier.phone || '-' }}</td>
              <td>
                <span class="badge" :class="supplier.active ? 'badge-success' : 'badge-error'">
                  {{ supplier.active ? 'Activo' : 'Inactivo' }}
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
import { getSuppliers } from '../services/suppliers.js'

const suppliers = ref([])
const loading = ref(false)
const error = ref(null)

async function loadSuppliers() {
  loading.value = true
  error.value = null
  try {
    suppliers.value = await getSuppliers()
  } catch (e) {
    error.value = 'Error al cargar proveedores'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadSuppliers())
</script>