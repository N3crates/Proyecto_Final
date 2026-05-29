<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <!-- Encabezado con titulo y boton de nuevo producto -->
      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold">Productos</h1>
            <p class="text-sm opacity-70">Administra el catálogo de productos.</p>
          </div>
          <button v-if="hasPermission('products:create')" class="btn btn-primary" @click="productModal.open()">+ Nuevo Producto</button>
        </div>

        <!-- Barra de busqueda con debounce y boton manual -->
        <div class="flex gap-3 mt-4">
          <input v-model="search" @input="debounceSearch" class="input input-bordered" placeholder="Buscar producto..." />
          <button class="btn btn-primary" @click="doSearch">Buscar</button>
        </div>
      </div>

      <ErrorState v-if="error" :message="error" />

      <!-- Tabla de productos -->
      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-8"><span class="loading loading-spinner"></span></td>
            </tr>
            <tr v-else-if="products.length === 0">
              <td colspan="7"><EmptyState title="Sin productos" description="No hay productos registrados" /></td>
            </tr>
            <tr v-for="product in products" :key="product.id">
              <td class="font-mono text-sm">{{ product.sku }}</td>
              <td>{{ product.nombre }}</td>
              <td>{{ product.categoria || '-' }}</td>
              <td>{{ product.precioVenta ?? '-' }}</td>
              <td>
                <!-- Resalta en rojo si el stock esta por debajo del minimo -->
                <span :class="product.stock <= product.stockMinimo ? 'text-error font-bold' : ''">
                  {{ product.stock ?? '-' }}
                </span>
              </td>
              <td>
                <!-- Badge de estado activo/inactivo -->
                <span class="badge" :class="product.activo ? 'badge-success' : 'badge-error'">
                  {{ product.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="flex gap-2">
                <button v-if="hasPermission('products:update')" class="btn btn-sm btn-warning" @click="productModal.open(product)">Editar</button>
                <button v-if="hasPermission('products:update')" class="btn btn-sm" :class="product.activo ? 'btn-neutral' : 'btn-success'" @click="handleToggle(product)">
                  {{ product.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button v-if="hasPermission('products:delete')" class="btn btn-sm btn-error" @click="openDelete(product)">Eliminar</button>
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
    <ProductModal ref="productModal" :loading="saving" @submit="handleSubmit" />
    <ConfirmDialog ref="confirmDialog" title="Eliminar producto" message="¿Estás seguro de que deseas eliminar este producto?" :loading="saving" @confirm="handleDelete" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { debounce } from 'lodash'
import AdminLayout from '../layouts/AdminLayout.vue'
import ProductModal from '../components/ProductModal.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import { hasPermission } from '../utils/permissions.js'
import { useProducts } from '../composables/useProducts.js'
import { getErrorMessage } from '../utils/errorHandler.js'
import { useNotificationStore } from '../stores/notificationStore.js'
import { required } from '../utils/validators.js'

// Composable con estado y acciones de productos
const { products, loading, error, page, search, loadProducts, create, update, toggleActive, remove } = useProducts()

const saving = ref(false)          // controla el estado de carga al guardar/eliminar
const selectedProduct = ref(null)  // producto seleccionado para eliminar
const productModal = ref(null)     // referencia al modal de crear/editar
const confirmDialog = ref(null)    // referencia al modal de confirmacion
const notifications = useNotificationStore()

// Maneja crear y editar segun el mode que viene del modal
async function handleSubmit(payload) {
  error.value = null

  // Validacion: SKU y nombre obligatorios
  const validations = [required(payload.sku, 'SKU'), required(payload.nombre, 'nombre')]
  const firstError = validations.find(v => v)
  if (firstError) { error.value = firstError; return }

  saving.value = true
  try {
    // Limpia y normaliza el payload, numeros con fallback a 0, strings vacios a null
    const cleanPayload = {
      sku: payload.sku?.trim(),
      nombre: payload.nombre?.trim(),
      descripcion: payload.descripcion?.trim() || null,
      categoria: payload.categoria?.trim() || null,
      unidad: payload.unidad?.trim() || null,
      marca: payload.marca?.trim() || null,
      modelo: payload.modelo?.trim() || null,
      precioCompra: Number(payload.precioCompra) || 0,
      precioVenta: Number(payload.precioVenta) || 0,
      stock: Number(payload.stock) || 0,
      stockMinimo: Number(payload.stockMinimo) || 0,
    }

    if (payload.mode === 'create') {
      await create(cleanPayload)
      notifications.add('Producto creado correctamente', 'success')
    } else {
      await update(payload.id, cleanPayload)
      notifications.add('Producto actualizado correctamente', 'success')
    }
    productModal.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al guardar producto')
  } finally {
    saving.value = false
  }
}

// Cambia el estado activo/inactivo del producto
async function handleToggle(product) {
  try {
    await toggleActive(product.id, !product.activo)
    notifications.add(`Producto ${product.activo ? 'desactivado' : 'activado'} correctamente`, 'success')
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al cambiar estado')
  }
}

// Abre el confirm dialog guardando el producto a eliminar
function openDelete(product) { selectedProduct.value = product; confirmDialog.value.open() }

// Ejecuta la eliminacion tras confirmar
async function handleDelete() {
  saving.value = true
  try {
    await remove(selectedProduct.value.id)
    notifications.add('Producto eliminado correctamente', 'success')
    confirmDialog.value.close()
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al eliminar producto')
  } finally {
    saving.value = false
    selectedProduct.value = null
  }
}

// Navegacion entre paginas
function previousPage() { if (page.value > 1) { page.value--; loadProducts() } }
function nextPage() { page.value++; loadProducts() }

// Busqueda inmediata (boton) y con debounce
function doSearch() { page.value = 1; loadProducts() }
const debounceSearch = debounce(() => { page.value = 1; loadProducts() }, 500)

onMounted(() => loadProducts())
</script>