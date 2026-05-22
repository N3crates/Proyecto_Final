<template>
  <div class="navbar bg-base-100 shadow-md px-4">
    <div class="flex-none md:hidden">
      <button class="btn btn-ghost btn-sm" @click="$emit('toggle-sidebar')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <div class="flex-1">
      <span class="text-xl font-bold">DEMEN ERP</span>
    </div>
    <div class="flex-none gap-2 flex items-center">
      <div class="text-right hidden md:block">
        <p class="text-sm font-semibold leading-tight">{{ authStore.user?.usuario || 'Usuario' }}</p>
        <p class="text-xs opacity-50">Bienvenido</p>
      </div>
      <button class="btn btn-ghost btn-sm" @click="cerrarSesion">Cerrar sesión</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const authStore = useAuthStore()

function cerrarSesion() {
  authStore.logout()
  router.push('/login')
}
</script>