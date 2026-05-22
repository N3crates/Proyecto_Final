<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 relative overflow-hidden">

    <!-- Fondo decorativo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
    </div>

    <div class="flex w-full max-w-4xl mx-4 shadow-2xl rounded-3xl overflow-hidden relative z-10">

      <!-- Panel izquierdo -->
      <div class="hidden md:flex flex-col justify-between w-1/2 bg-primary p-10 text-primary-content">
        <div>
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-primary-content/20 rounded-xl flex items-center justify-center">
              <span class="text-xl font-black">D</span>
            </div>
            <span class="text-2xl font-black tracking-tight">DEMEN ERP</span>
          </div>
          <h2 class="text-3xl font-bold leading-tight mb-4">
            Gestiona tu empresa de forma inteligente
          </h2>
          <p class="opacity-80 text-sm leading-relaxed">
            Sistema integrado de gestión empresarial. Controla inventario, clientes, proveedores y más desde un solo lugar.
          </p>
        </div>

        <div class="space-y-3">
          <div class="flex items-center gap-3 bg-primary-content/10 rounded-xl p-3">
            <span class="text-lg">📦</span>
            <span class="text-sm">Control de inventario en tiempo real</span>
          </div>
          <div class="flex items-center gap-3 bg-primary-content/10 rounded-xl p-3">
            <span class="text-lg">👥</span>
            <span class="text-sm">Gestión de clientes y proveedores</span>
          </div>
          <div class="flex items-center gap-3 bg-primary-content/10 rounded-xl p-3">
            <span class="text-lg">🔐</span>
            <span class="text-sm">Control de accesos por roles</span>
          </div>
        </div>
      </div>

      <!-- Panel derecho - formulario -->
      <div class="flex-1 bg-base-100 flex flex-col justify-center p-10">
        <div class="max-w-sm mx-auto w-full">

          <div class="mb-8">
            <h1 class="text-2xl font-bold mb-1">Bienvenido</h1>
            <p class="text-sm opacity-50">Ingresa tus credenciales para continuar</p>
          </div>

          <form class="space-y-4" @submit.prevent="onSubmit">
            <div class="form-control">
              <label class="label pb-1">
                <span class="label-text text-xs font-semibold uppercase tracking-wider opacity-60">Usuario</span>
              </label>
              <input
                v-model="usuario"
                class="input input-bordered w-full"
                placeholder="Ingresa tu usuario"
                autocomplete="username"
              />
            </div>

            <div class="form-control">
              <label class="label pb-1">
                <span class="label-text text-xs font-semibold uppercase tracking-wider opacity-60">Contraseña</span>
              </label>
              <input
                v-model="password"
                type="password"
                class="input input-bordered w-full"
                placeholder="Ingresa tu contraseña"
                autocomplete="current-password"
              />
            </div>

            <div v-if="error" class="alert alert-error py-2">
              <span class="text-sm">{{ error }}</span>
            </div>

            <button class="btn btn-primary w-full mt-2" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner"></span>
              {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
            </button>
          </form>

          <p class="text-center text-xs opacity-30 mt-8">DEMEN ERP © 2026</p>
        </div>
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
  if (!usuario.value) { error.value = 'El usuario es obligatorio'; return }
  if (!password.value) { error.value = 'El password es obligatorio'; return }
  loading.value = true
  try {
    const data = await loginRequest({ usuario: usuario.value.trim(), password: password.value })
    authStore.setAuth(data)
    router.push('/dashboard')
  } catch (e) {
    error.value = getErrorMessage(e, 'Error al iniciar sesión')
  } finally {
    loading.value = false
  }
}
</script>