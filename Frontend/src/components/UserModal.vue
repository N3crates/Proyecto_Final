<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario' }}</h3>
      <div class="space-y-3 mt-4">
        <input v-model="form.nombre" class="input input-bordered w-full" placeholder="Nombre" />
        <input v-model="form.apellido" class="input input-bordered w-full" placeholder="Apellido" />
        <input v-model="form.email" type="email" class="input input-bordered w-full" placeholder="Email" />
        <input v-model="form.usuario" class="input input-bordered w-full" placeholder="Usuario" />
        <select v-model="form.roleId" class="select select-borderd w-full">
          <option disabled value="">Selecciona un rol</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.nombre }}</option>
        </select>
        <input v-if="mode === 'create'" v-model="form.password" type="password" class="input input-bordered w-full" placeholder="Contraseña (mín. 6 caracteres)" />
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
import { onMounted } from 'vue';
import { getRoles } from '../services/roles';

defineProps({ loading: { type: Boolean, default: false } })
const emit = defineEmits(['submit', 'cancel'])
const dialogRef = ref(null)
const mode = ref('create')
const roles = ref([])
const form = ref({ nombre: '', apellido: '', email: '', usuario: '', password: '', roleId:'', activo: true })

async function loadRoles() {
  try {
    roles.value = await getRoles()
  } catch (e) {
    console.error(e)
  }
}

function open(selected = null) {
  mode.value = selected ? 'edit' : 'create'
  form.value = selected
    ? { ...selected, password: '' }
    : { nombre: '', apellido: '', email: '', usuario: '', password: '' }
  dialogRef.value.showModal()
}

function submit() { emit('submit', { ...form.value, mode: mode.value }) }
function cancel() { dialogRef.value.close(); emit('cancel') }

defineExpose({ open, close: () => dialogRef.value.close() })

onMounted(() => {loadRoles()})
</script>