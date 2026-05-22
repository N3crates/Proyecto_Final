<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Ajustar Inventario</h3>
      <p class="text-sm opacity-70 mt-1">{{ productName }}</p>

      <div class="space-y-3 mt-4">
        <select v-model="form.tipo" class="select select-bordered w-full">
          <option disabled value="">Tipo de ajuste</option>
          <option value="ENTRADA">Entrada</option>
          <option value="SALIDA">Salida</option>
          <option value="AJUSTE">Ajuste</option>
        </select>
        <input v-model="form.cantidad" type="number" class="input input-bordered w-full" placeholder="Cantidad (mayor a 0)" min="1" />
        <input v-model="form.motivo" class="input input-bordered w-full" placeholder="Motivo (obligatorio, mín. 3 caracteres)" />
        <input v-model="form.referencia" class="input input-bordered w-full" placeholder="Referencia (opcional)" />
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="cancel">Cancelar</button>
        <button class="btn btn-primary" :disabled="loading" @click="submit">
          <span v-if="loading" class="loading loading-spinner"></span>
          Ajustar
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
const productName = ref('')
const productId = ref('')
const form = ref({ tipo: '', cantidad: 1, motivo: '', referencia: '' })

function open(item) {
  productId.value = item.productId
  productName.value = item.productNombre || item.nombre || ''
  form.value = { tipo: '', cantidad: 1, motivo: '', referencia: '' }
  dialogRef.value.showModal()
}

function submit() { emit('submit', { productId: productId.value, ...form.value }) }
function cancel() { dialogRef.value.close(); emit('cancel') }

defineExpose({ open, close: () => dialogRef.value.close() })
</script>