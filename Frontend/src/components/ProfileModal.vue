<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Editar Perfil</h3>

      <div class="space-y-3 mt-4">
        <div class="flex justify-center mb-2">
          <div class="avatar placeholder">
            <div class="bg-primary text-primary-content rounded-full w-9 flex items-center justify-center">
            <span class="text-sm font-bold">{{ initials }}</span>
            </div>
          </div>
        </div>

        <input v-model="form.nombre" class="input input-bordered w-full" placeholder="Nombre" />
        <input v-model="form.apellido" class="input input-bordered w-full" placeholder="Apellido" />
        <input v-model="form.usuario" class="input input-bordered w-full" placeholder="Usuario" />

        <div class="form-control">
          <label class="label">
            <span class="label-text text-xs opacity-50">Email</span>
          </label>
          <input :value="form.email" class="input input-bordered w-full opacity-50 cursor-not-allowed" disabled />
        </div>

        <div class="divider text-xs opacity-50">Cambiar contraseña (opcional)</div>

        <input v-model="form.password" type="password" class="input input-bordered w-full" placeholder="Nueva contraseña (mín. 6 caracteres)" />
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="cancel">Cancelar</button>
        <button class="btn btn-primary" :disabled="loading" @click="submit">
          <span v-if="loading" class="loading loading-spinner"></span>
          Guardar
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button @click="cancel">close</button></form>
  </dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'

defineProps({ loading: { type: Boolean, default: false } })
const emit = defineEmits(['submit', 'cancel'])
const dialogRef = ref(null)
const authStore = useAuthStore()

const form = ref({ nombre: '', apellido: '', usuario: '', email: '', password: '' })

const initials = computed(() => {
  const n = form.value.nombre?.[0] || ''
  const a = form.value.apellido?.[0] || ''
  return (n + a).toUpperCase() || '?'
})

function open() {
  const user = authStore.user
  form.value = {
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    usuario: user?.usuario || '',
    email: user?.email || '',
    password: ''
  }
  dialogRef.value.showModal()
}

function submit() { emit('submit', { ...form.value }) }
function cancel() { dialogRef.value.close(); emit('cancel') }

defineExpose({ open, close: () => dialogRef.value.close() })
</script>