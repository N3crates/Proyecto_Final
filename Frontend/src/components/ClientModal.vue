<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente' }}</h3>

      <div class="space-y-3 mt-4">
        <input v-model="form.nombre" class="input input-bordered w-full" placeholder="Nombre completo" />
        <input v-model="form.email" type="email" class="input input-bordered w-full" placeholder="Email" />
        <input v-model="form.telefono" class="input input-bordered w-full" placeholder="Teléfono" />
        <input v-model="form.direccion" class="input input-bordered w-full" placeholder="Dirección" />
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
const form = ref({ nombre: '', email: '', telefono: '', direccion: '' })

function open(selected = null) {
  mode.value = selected ? 'edit' : 'create'
  form.value = selected ? { ...selected } : { nombre: '', email: '', telefono: '', direccion: '' }
  dialogRef.value.showModal()
}

function submit() { emit('submit', { ...form.value, mode: mode.value }) }
function cancel() { dialogRef.value.close(); emit('cancel') }

defineExpose({ open, close: () => dialogRef.value.close() })
</script>