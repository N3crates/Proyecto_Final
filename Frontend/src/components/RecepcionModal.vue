<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-3xl">
      <h3 class="font-bold text-lg">{{ mode === 'create' ? 'Nueva Recepción' : 'Editar Recepción' }}</h3>

      <div class="space-y-3 mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select v-model="form.supplierId" class="select select-bordered w-full">
            <option disabled value="">Selecciona un proveedor</option>
            <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.nombre }}</option>
          </select>
          <input v-model="form.folio" class="input input-bordered w-full" placeholder="Folio (obligatorio)" />
          <input v-model="form.fecha" type="date" class="input input-bordered w-full" />
          <textarea v-model="form.comentarios" class="textarea textarea-bordered w-full md:col-span-2" placeholder="Comentarios"></textarea>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <p class="text-sm font-semibold">Productos</p>
            <button type="button" class="btn btn-sm btn-outline" @click="addItem">+ Agregar producto</button>
          </div>

          <div v-if="form.items.length === 0" class="text-center opacity-50 py-4 text-sm">
            Agrega al menos un producto
          </div>

          <div v-if="form.items.length > 0" class="grid grid-cols-12 gap-2 mb-1 text-xs opacity-50 px-1">
            <span class="col-span-5">Producto</span>
            <span class="col-span-3">Cantidad</span>
            <span class="col-span-3">Costo unitario</span>
          </div>

          <div v-for="(item, index) in form.items" :key="index" class="grid grid-cols-12 gap-2 mb-2 items-center">
            <select v-model="item.productId" class="select select-bordered col-span-5">
              <option disabled value="">Producto</option>
              <option v-for="p in products" :key="p.id" :value="p.id">{{ p.nombre }}</option>
            </select>
            <input v-model="item.cantidad" type="number" class="input input-bordered col-span-3" placeholder="Cantidad" min="1" />
            <input v-model="item.costoUnitario" type="number" class="input input-bordered col-span-3" placeholder="Costo unitario" min="0" />
            <button type="button" class="btn btn-sm btn-error col-span-1" @click="removeItem(index)">✕</button>
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
import { ref } from 'vue'
import { getSuppliers } from '../services/suppliers'
import { getProducts } from '../services/products'

defineProps({ loading: { type: Boolean, default: false } })
const emit = defineEmits(['submit', 'cancel'])
const dialogRef = ref(null)
const mode = ref('create')
const suppliers = ref([])
const products = ref([])

const emptyForm = () => ({
  supplierId: '',
  folio: '',
  fecha: new Date().toISOString().split('T')[0],
  comentarios: '',
  items: []
})

const form = ref(emptyForm())

async function loadData() {
  try {
    const [suppRes, prodRes] = await Promise.all([
      getSuppliers({ limit: 100 }),
      getProducts({ limit: 100 })
    ])
    suppliers.value = suppRes.items || []
    products.value = prodRes.items || []
  } catch (e) {
    console.error(e)
  }
}

function addItem() {
  form.value.items.push({ productId: '', cantidad: 1, costoUnitario: 0 })
}

function removeItem(index) {
  form.value.items.splice(index, 1)
}

async function open(selected = null) {
  mode.value = selected ? 'edit' : 'create'
  form.value = selected
    ? { ...selected, items: selected.items || [] }
    : emptyForm()
  dialogRef.value.showModal()
  await loadData()
}

function submit() { emit('submit', { ...form.value, mode: mode.value }) }
function cancel() { dialogRef.value.close(); emit('cancel') }

defineExpose({ open, close: () => dialogRef.value.close() })
</script>