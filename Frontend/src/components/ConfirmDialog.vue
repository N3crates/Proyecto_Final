<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ title }}</h3>
      <p class="py-4 opacity-70">{{ message }}</p>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="cancel">Cancelar</button>
        <button class="btn btn-error" :disabled="loading" @click="confirm">
          <span v-if="loading" class="loading loading-spinner"></span>
          Eliminar
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
  title: { type: String, default: '¿Estás seguro?' },
  message: { type: String, default: 'Esta acción no se puede deshacer.' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['confirm', 'cancel'])

const dialogRef = ref(null)

function open() {
  dialogRef.value.showModal()
}

function confirm() {
  emit('confirm')
}

function cancel() {
  dialogRef.value.close()
  emit('cancel')
}

defineExpose({ open, close: () => dialogRef.value.close() })
</script>