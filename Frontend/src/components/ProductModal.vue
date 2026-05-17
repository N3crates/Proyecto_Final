<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-3xl">
      <h3 class="font-bold text-2xl">
        {{mode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}}
      </h3>
      <p class="text-sm opacity-60 mt-1">Completa la información del producto</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label class="label">
            <span class="label-text">SKU</span>
          </label>
          <input v-model="form.sku" class="input input-bordered w-full" placeholder="SKU"/>
        </div>
        <div>
          <label class="label">
            <span class="label-text">Nombre</span>
          </label>
          <input v-model="form.nombre" class="input input-bordered w-full" placeholder="Nombre del producto"/>
        </div>
        <div>
          <label class="label">
            <span class="label-text">Categoría</span>
          </label>
          <input v-model="form.categoria" class="input input-bordered w-full" placeholder="Categoría" />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Marca</span>
          </label>
          <input v-model="form.marca" class="input input-bordered w-full" placeholder="Marca" />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Modelo</span>
          </label>
          <input v-model="form.modelo" class="input input-bordered w-full" placeholder="Modelo" />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Unidad</span>
          </label>
          <input v-model="form.unidad" class="input input-bordered w-full" placeholder="pza, kg, lt..." />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Precio compra</span>
          </label>
          <input v-model="form.precioCompra" type="number" min="0" class="input input-bordered w-full" placeholder="0" />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Precio venta</span>
          </label>
          <input v-model="form.precioVenta" type="number" min="0" class="input input-bordered w-full" placeholder="0" />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Stock inicial</span>
          </label>
          <input v-model="form.stock" type="number" min="0" class="input input-bordered w-full" placeholder="0" />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Stock mínimo</span>
          </label>
          <input v-model="form.stockMinimo" type="number" min="0" class="input input-bordered w-full" placeholder="0" />
        </div>
        <div class="md:col-span-2">
          <label class="label">
            <span class="label-text">Descripción</span>
          </label>
          <textarea v-model="form.descripcion" class="textarea textarea-bordered w-full h-28" placeholder="Descripción del producto"></textarea>
        </div>
      </div>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="cancel">Cancelar</button>
        <button class="btn btn-primary" :disabled="loading" @click="submit">
          <span v-if="loading" class="loading loading-spinner"></span>
          {{ mode === 'create' ? 'Crear' : 'Guardar' }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="cancel">close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])
const dialogRef = ref(null)
const mode = ref('create')
const emptyForm = () => ({
  sku: '',
  nombre: '',
  descripcion: '',
  categoria: '',
  unidad: '',
  marca: '',
  modelo: '',
  precioCompra: 0,
  precioVenta: 0,
  stock: 0,
  stockMinimo: 0
})
const form = ref(emptyForm())

function open(selected = null) {
  mode.value = selected ? 'edit' : 'create'
  form.value = selected ? { ...selected } : emptyForm()
  dialogRef.value.showModal()
}

function submit() {
  emit('submit',
    {
      ...form.value, mode: mode.value
    }
  )
}

function cancel() {
  dialogRef.value.close()
  emit('cancel')
}

defineExpose({
  open,
  close: () => dialogRef.value.close()
})

</script>