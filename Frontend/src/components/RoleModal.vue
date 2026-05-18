<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg">{{ mode === 'create' ? 'Nuevo Rol' : 'Editar Rol' }}</h3>

      <div class="space-y-3 mt-4">
        <input v-model="form.nombre" class="input input-bordered w-full" placeholder="Nombre del rol (obligatorio)" />
        <textarea v-model="form.descripcion" class="textarea textarea-bordered w-full" placeholder="Descripción"></textarea>

        <div>
          <p class="text-sm font-semibold mb-2">Permisos</p>
          <div v-if="loadingPerms" class="text-center py-4">
            <span class="loading loading-spinner"></span>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-1 max-h-60 overflow-y-auto border border-base-300 rounded-lg p-3">
            <div v-for="perm in permissionsByModule" :key="perm.code">
              <template v-if="perm.isHeader">
                <p class="text-xs font-bold uppercase opacity-50 mt-2">{{ perm.modulo }}</p>
              </template>
              <label v-else class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" class="checkbox checkbox-sm" :value="perm.code" v-model="form.permissions" />
                <span class="text-sm">{{ perm.nombre }}</span>
              </label>
            </div>
          </div>
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
    <form method="dialog" class="modal-backdrop"><button @click="cancel">close</button></form>
  </dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getPermissions } from '../services/permissions.js'

defineProps({ loading: { type: Boolean, default: false } })
const emit = defineEmits(['submit', 'cancel'])
const dialogRef = ref(null)
const mode = ref('create')
const loadingPerms = ref(false)
const allPermissions = ref([])
const form = ref({ nombre: '', descripcion: '', permissions: [] })

const permissionsByModule = computed(() => {
  const grouped = {}
  allPermissions.value.forEach(p => {
    if (!grouped[p.modulo]) grouped[p.modulo] = []
    grouped[p.modulo].push(p)
  })
  const result = []
  Object.keys(grouped).sort().forEach(modulo => {
    result.push({ isHeader: true, modulo })
    grouped[modulo].forEach(p => result.push(p))
  })
  return result
})

async function loadPermissions() {
  loadingPerms.value = true
  try {
    const response = await getPermissions({ limit: 100 })
    allPermissions.value = response.items || []
  } finally {
    loadingPerms.value = false
  }
}

async function open(selected = null) {
  mode.value = selected ? 'edit' : 'create'
  form.value = selected
    ? { nombre: selected.nombre, descripcion: selected.descripcion || '', permissions: selected.permissions || [] }
    : { nombre: '', descripcion: '', permissions: [] }
  dialogRef.value.showModal()
  await loadPermissions()
}

function submit() { emit('submit', { ...form.value, mode: mode.value }) }
function cancel() { dialogRef.value.close(); emit('cancel') }

defineExpose({ open, close: () => dialogRef.value.close() })
</script>