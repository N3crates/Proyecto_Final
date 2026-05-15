<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ mode === 'create' ? 'Nuevo Producto' : 'Editar Producto' }}</h3>

      <div class="space-y-3 mt-4">
        <input v-model="form.nombre" class="input input-bordered w-full" placeholder="Nombre del producto" />
        <input v-model="form.categoria" class="input input-bordered w-full" placeholder="Categoría" />
        <input v-model="form.precio" type="number" class="input input-bordered w-full" placeholder="Precio" />
        <input v-model="form.stock" type="number" class="input input-bordered w-full" placeholder="Stock inicial" />
        <input v-model="form.stockMinimo" type="number" class="input input-bordered w-full" placeholder="Stock mínimo" />
        <textarea v-model="form.descripcion" class="textarea textarea-bordered w-full" placeholder="Descripción"></textarea>
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
const form = ref({ nombre: '', categoria: '', precio: '', stock: '', stockMinimo: '', descripcion: '' })

function open(selected = null) {
  mode.value = selected ? 'edit' : 'create'
  form.value = selected ? { ...selected } : { nombre: '', categoria: '', precio: '', stock: '', stockMinimo: '', descripcion: '' }
  dialogRef.value.showModal()
}

function submit() { emit('submit', { ...form.value, mode: mode.value }) }
function cancel() { dialogRef.value.close(); emit('cancel') }

defineExpose({ open, close: () => dialogRef.value.close() })
</script>