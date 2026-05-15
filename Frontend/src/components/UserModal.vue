<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario' }}</h3>

      <div class="space-y-3 mt-4">
        <input
          v-model="form.nombre"
          class="input input-bordered w-full"
          placeholder="Nombre completo"
        />
        <input
          v-model="form.usuario"
          class="input input-bordered w-full"
          placeholder="Usuario"
        />
        <input
          v-model="form.email"
          type="email"
          class="input input-bordered w-full"
          placeholder="Email"
        />
        <input
          v-if="mode === 'create'"
          v-model="form.password"
          type="password"
          class="input input-bordered w-full"
          placeholder="Contraseña"
        />
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

const props = defineProps({
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['submit', 'cancel'])

const dialogRef = ref(null)
const mode = ref('create')
const form = ref({
  nombre: '',
  usuario: '',
  email: '',
  password: ''
})

function open(selectedUser = null) {
  if (selectedUser) {
    mode.value = 'edit'
    form.value = { ...selectedUser, password: '' }
  } else {
    mode.value = 'create'
    form.value = { nombre: '', usuario: '', email: '', password: '' }
  }
  dialogRef.value.showModal()
}

function submit() {
  emit('submit', { ...form.value, mode: mode.value })
}

function cancel() {
  dialogRef.value.close()
  emit('cancel')
}

defineExpose({ open, close: () => dialogRef.value.close() })
</script>