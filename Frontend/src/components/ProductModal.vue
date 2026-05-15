<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg">{{ mode === 'create' ? 'Nuevo Producto' : 'Editar Producto' }}</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <input v-model="form.sku" class="input input-bordered w-full" placeholder="SKU (obligatorio)" />
        <input v-model="form.nombre" class="input input-bordered w-full" placeholder="Nombre (obligatorio)" />
        <input v-model="form.categoria" class="input input-bordered w-full" placeholder="Categoría" />
        <input v-model="form.marca" class="input input-bordered w-full" placeholder="Marca" />
        <input v-model="form.modelo" class="input input-bordered w-full" placeholder="Modelo" />
        <input v-model="form.unidad" class="input input-bordered w-full" placeholder="Unidad (pza, kg, lt...)" />
        <input v-model="form.precioCompra" type="number" class="input input-bordered w-full" placeholder="Precio de compra" />
        <input v-model="form.precioVenta" type="number" class="input input-bordered w-full" placeholder="Precio de venta" />
        <input v-model="form.stock" type="number" class="input input-bordered w-full" placeholder="Stock inicial" />
        <input v-model="form.stockMinimo" type="number" class="input input-bordered w-full" placeholder="Stock mínimo" />
        <textarea v-model="form.descripcion" class="textarea textarea-bordered w-full md:col-span-2" placeholder="Descripción"></textarea>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="cancel">Cancelar</button>
        <button class="btn btn-primary" :disabled="loading" @click="submit">
          <span v-if="loading" class="loading loading-spinner"></span>
          {{ mode === 'create' ? 'Crear' : 'Guardar' }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button @click="cancel">close</button></form>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ loading: { type: Boolean, default: false } })
const emit = defineEmits(['submit', 'cancel'])
const dialogRef = ref(null)
const mode = ref('create')
const emptyForm = () => ({ sku: '', nombre: '', descripcion: '', categoria: '', unidad: '', marca: '', modelo: '', precioCompra: 0, precioVenta: 0, stock: 0, stockMinimo: 0 })
const form = ref(emptyForm())

function open(selected = null) {
  mode.value = selected ? 'edit' : 'create'
  form.value = selected ? { ...selected } : emptyForm()
  dialogRef.value.showModal()
}

function submit() { emit('submit', { ...form.value, mode: mode.value }) }
function cancel() { dialogRef.value.close(); emit('cancel') }

defineExpose({ open, close: () => dialogRef.value.close() })
</script>