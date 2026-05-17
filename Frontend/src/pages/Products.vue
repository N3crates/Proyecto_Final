<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Productos</h1>
            <p class="text-sm opacity-70">Administra el catálogo de productos.</p>
          </div>
          <button v-if="hasPermission('products:create')" class="btn btn-primary" @click="productModal.open()">+ Nuevo Producto</button>
        </div>
        <div class="flex gap-3 mt-4">
          <input v-model="search" @input="debounceSearch" class="input input-bordered" placeholder="Buscar producto..." />
          <button class="btn btn-primary" @click="loadProducts">Buscar</button>
        </div>
      </div>

      <div v-if="error" class="alert alert-error"><span>{{ error }}</span></div>
      <div v-if="success" class="alert alert-success"><span>{{ success }}</span></div>

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
              <td>{{ product.precioVenta || product.precio || product_price || '-' }}</td>
              <td>{{ product.stock ?? '-' }}</td>
              <td>
                <span class="badge" :class="product.activo ? 'badge-success' : 'badge-error'">
                  {{ product.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="flex gap-2">
                <button v-if="hasPermission('products:update')" class="btn btn-sm btn-warning" @click="productModal.open(product)">Editar</button>
                <button v-if="hasPermission('products:delete')" class="btn btn-sm btn-error" @click="openDelete(product)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between items-center mt-4">
        <button class="btn btn-sm" @click="previousPage" :disabled="page <= 1">Anterior</button>
        <span>Pagina {{ page }}</span>
        <button class="btn btn-sm" @click="nextPage">Siguiente</button>
      </div>
    </div>
    <ProductModal ref="productModal" :loading="saving" @submit="handleSubmit" />
    <ConfirmDialog ref="confirmDialog" title="Eliminar producto" message="¿Estás seguro de que deseas eliminar este producto?" :loading="saving" @confirm="handleDelete" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import ProductModal from '../components/ProductModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { debounce } from 'lodash'
import { useProducts } from '../composables/useProducts.js'
import { hasPermission } from '../utils/permissions.js'
import { getErrorMessage } from '../utils/errorHandler.js'
import { useNotificationStore } from '../stores/notificationStore.js'

const { products, loading, error, page, limit, search, loadProducts, create, update, remove} = useProducts()
const saving = ref(false)
const selectedProduct = ref(null)
const productModal = ref(null)
const confirmDialog = ref(null)
const notifications = useNotificationStore()

async function handleSubmit(payload) {
  saving.value = true; error.value = null
  try {
    if (payload.mode === 'create') { await create(payload); notifications.add('Producto creado correctamente', 'success') }
    else { await update(payload.id, payload); notifications.add('Producto actualizado correctamente', 'success') }
    productModal.value.close()
    await loadProducts()
  } catch (e) { error.value = getErrorMessage(e, 'Error al guardar producto') }
  finally { saving.value = false }
}

function openDelete(product) { selectedProduct.value = product; confirmDialog.value.open() }

async function handleDelete() {
  saving.value = true; error.value = null
  try {
    await remove(selectedProduct.value.id)
    notifications.add('Producto eliminado correctamente', 'success')
    confirmDialog.value.close()
    await loadProducts()
  } catch (e) { error.value = getErrorMessage(e, 'Error al eliminar producto') }
  finally { saving.value = false; selectedProduct.value = null }
}

function previousPage(){
  if(page.value > 1){
    page.value--
    loadProducts()
  }
}

function nextPage() {
  page.value++
  loadProducts()
}

const debounceSearch = debounce(() => {
  page.value = 1
  loadProducts()
}, 500)

onMounted(() => loadProducts())
</script>