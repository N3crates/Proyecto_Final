<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Proveedores</h1>
            <p class="text-sm opacity-70">Administra los proveedores del sistema ERP.</p>
          </div>
          <button class="btn btn-primary" @click="supplierModal.open()">+ Nuevo Proveedor</button>
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
                <button class="btn btn-sm btn-warning" @click="supplierModal.open(supplier)">Editar</button>
                <button class="btn btn-sm btn-error" @click="openDelete(supplier)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <SupplierModal ref="supplierModal" :loading="saving" @submit="handleSubmit" />
    <ConfirmDialog ref="confirmDialog" title="Eliminar proveedor" message="¿Estás seguro de que deseas eliminar este proveedor?" :loading="saving" @confirm="handleDelete" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import SupplierModal from '../components/SupplierModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/suppliers.js'

const suppliers = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref(null)
const success = ref(null)
const selectedSupplier = ref(null)
const supplierModal = ref(null)
const confirmDialog = ref(null)

function showSuccess(msg) { success.value = msg; setTimeout(() => success.value = null, 3000) }

async function loadSuppliers() {
  loading.value = true; error.value = null
  try { suppliers.value = await getSuppliers() }
  catch (e) { error.value = 'Error al cargar proveedores' }
  finally { loading.value = false }
}

async function handleSubmit(payload) {
  saving.value = true; error.value = null
  try {
    if (payload.mode === 'create') { await createSupplier(payload); showSuccess('Proveedor creado correctamente') }
    else { await updateSupplier(payload.id, payload); showSuccess('Proveedor actualizado correctamente') }
    supplierModal.value.close()
    await loadSuppliers()
  } catch (e) { error.value = 'Error al guardar proveedor' }
  finally { saving.value = false }
}

function openDelete(supplier) { selectedSupplier.value = supplier; confirmDialog.value.open() }

async function handleDelete() {
  saving.value = true; error.value = null
  try {
    await deleteSupplier(selectedSupplier.value.id)
    showSuccess('Proveedor eliminado correctamente')
    confirmDialog.value.close()
    await loadSuppliers()
  } catch (e) { error.value = 'Error al eliminar proveedor' }
  finally { saving.value = false; selectedSupplier.value = null }
}

onMounted(() => loadSuppliers())
</script>