<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Productos</h1>
            <p class="text-sm opacity-70">Administra el catálogo de productos.</p>
          </div>
          <button class="btn btn-primary">+ Nuevo Producto</button>
        </div>
      </div>

      <div v-if="error" class="alert alert-error"><span>{{ error }}</span></div>

      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="products.length === 0">
              <td colspan="6" class="text-center opacity-50 py-8">Sin productos registrados</td>
            </tr>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.nombre || product.name }}</td>
              <td>{{ product.categoria || product.category || '-' }}</td>
              <td>{{ product.precio || product.price || '-' }}</td>
              <td>{{ product.stock ?? '-' }}</td>
              <td>
                <span class="badge" :class="product.active ? 'badge-success' : 'badge-error'">
                  {{ product.active ? 'Activo' : 'Inactivo' }}
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
import { getProducts } from '../services/products.js'

const products = ref([])
const loading = ref(false)
const error = ref(null)

async function loadProducts() {
  loading.value = true
  error.value = null
  try {
    products.value = await getProducts()
  } catch (e) {
    error.value = 'Error al cargar productos'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadProducts())
</script>