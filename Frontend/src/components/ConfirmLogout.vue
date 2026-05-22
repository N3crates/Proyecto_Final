<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-sm">
      <h3 class="font-bold text-lg">¿Cerrar sesión?</h3>
      <p class="text-sm opacity-60 mt-2">Tu sesión actual se cerrará y tendrás que volver a iniciar sesión.</p>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="cancel">Cancelar</button>
        <button class="btn btn-error" @click="confirm">Cerrar sesión</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop"><button @click="cancel">close</button></form>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['confirm', 'cancel'])
const dialogRef = ref(null)

function open() { dialogRef.value.showModal() }
function confirm() { dialogRef.value.close(); emit('confirm') }
function cancel() { dialogRef.value.close(); emit('cancel') }

defineExpose({ open })
</script>