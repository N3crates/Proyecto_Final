<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="text-2xl font-bold text-center">DEMEN ERP</h1>
        <p class="text-center text-sm opacity-60 mb-2">Inicia sesión para continuar</p>

        <form class="mt-4 space-y-3" @submit.prevent="onSubmit">
          <input
            v-model="usuario"
            class="input input-bordered w-full"
            placeholder="Usuario"
          />

          <input
            v-model="password"
            type="password"
            class="input input-bordered w-full"
            placeholder="Contraseña"
          />

          <button class="btn btn-primary w-full" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner"></span>
            Entrar
          </button>

          <p v-if="error" class="text-sm text-error text-center">
            {{ error }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { loginRequest } from '../services/authService'
import { getErrorMessage } from '../utils/errorHandler'

const router = useRouter()
const authStore = useAuthStore()
const usuario = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function onSubmit() {
  error.value = null
  if(!usuario.value){
    error.value = 'El usuario es obligatorio'
    return
  }
  if(!password.value){
    error.value = 'El password es obligatorio'
    return
  }
  loading.value = true

  try {
    const credentials = {
      usuario: usuario.value.trim(),
      password: password.value
    }
    const data = await loginRequest(credentials)
    authStore.setAuth(data)
    router.push('/dashboard')
  } catch (e) {
    console.error(e)
    error.value = getErrorMessage(e, 'Error al iniciar sesión')
  } finally {
    loading.value = false
  }
}
</script>