<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg">{{ mode === 'create' ? 'Nuevo Rol' : 'Editar Rol' }}</h3>
      <div class="space-y-4 mt-4">
        <input v-model="form.nombre" class="input input-bordered w-full" placeholder="Nombre del rol (obligatorio)" />
        <textarea v-model="form.descripcion" class="textarea textarea-bordered w-full" placeholder="Descripción"></textarea>
        <div>
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-semibold">Permisos</p>
            <span class="text-xs opacity-50">{{ form.permissions.length }} seleccionados</span>
          </div>

          <div v-if="loadingPerms" class="text-center py-6">
            <span class="loading loading-spinner"></span>
          </div>

          <div v-else class="max-h-80 overflow-y-auto space-y-3 pr-1">
            <div v-for="module in groupedModules" :key="module.modulo" class="border border-base-300 rounded-xl overflow-hidden">
              <div class="bg-base-200 px-4 py-2 flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider">{{ module.modulo }}</span>
                <button type="button" class="text-xs opacity-60 hover:opacity-100" @click="toggleModule(module)">
                  {{ isModuleFullySelected(module) ? 'Deseleccionar todo' : 'Seleccionar todo' }}
                </button>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-base-200">
                <label
                  v-for="perm in module.permissions" :key="perm.code" class="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-base-200/50 transition-colors">
                  <input type="checkbox" class="checkbox checkbox-sm checkbox-primary mt-0.5 shrink-0" :value="perm.code" v-model="form.permissions"/>
                  <div>
                    <p class="text-sm font-medium leading-tight">{{ perm.nombre }}</p>
                    <p class="text-xs opacity-50 mt-0.5">{{ perm.code }}</p>
                  </div>
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
    if (!grouped[p.modulo]) grouped[p.modulo] = []
    grouped[p.modulo].push(p)
  })
  return Object.keys(grouped).sort().map(modulo => ({ modulo, permissions: grouped[modulo] }))
})

function isModuleFullySelected(module) {
  return module.permissions.every(p => form.value.permissions.includes(p.code))
}

function toggleModule(module) {
  if (isModuleFullySelected(module)) {
    form.value.permissions = form.value.permissions.filter(
      code => !module.permissions.find(p => p.code === code)
    )
  } else {
    const newCodes = module.permissions.map(p => p.code)
    const merged = [...new Set([...form.value.permissions, ...newCodes])]
    form.value.permissions = merged
  }
}

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
    ? { id: selected.id, nombre: selected.nombre, descripcion: selected.descripcion || '', permissions: selected.permissions || [] }
    : { nombre: '', descripcion: '', permissions: [] }
  dialogRef.value.showModal()
  await loadPermissions()
}

function submit() { emit('submit', { ...form.value, mode: mode.value }) }
function cancel() { dialogRef.value.close(); emit('cancel') }

defineExpose({ open, close: () => dialogRef.value.close() })
</script>