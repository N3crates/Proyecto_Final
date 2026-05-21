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
          <div v-else class="space-y-4 max-h-72 overflow-y-auto border-base-300 rounded-xl p-4 bg-base-200/30">
            <div v-for="module in groupedModules" :key="module.modulo" class="rounded-lg border-base-300 bg-base-100 p-3">
                <h4 class="text-sm font-bold uppercase opacity-60 mb-3">
                  {{ module.modulo }}
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label v-for="perm in module.permissions" :key="perm.code" class="flex items-center gap-3 cursor-pointer rounded-lg px-2 py-2 hover:bg-base-200 transition-colors">
                    <input type="checkbox" class="checkbox checkbox-sm" :value="perm.code" v-model="form.permissions" />
                    <span class="text-sm">{{ perm.nombre }}</span>
                  </label>
                </div>
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

const groupedModules = computed(() => {
  const grouped = {}
  allPermissions.value.forEach(p => {
    if (!grouped[p.modulo]) {
      grouped[p.modulo] = []
    }
    grouped[p.modulo].push(p)
  })
  return Object.keys(grouped).sort().map(modulo => ({modulo, permissions: grouped[modulo]}))
})

async function loadPermissions() {
  loadingPerms.value = true
  try {
    const response = await getPermissions({ limit: 100 })
    console.log(response)
    allPermissions.value = response || []
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