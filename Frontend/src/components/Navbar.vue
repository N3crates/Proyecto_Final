<template>
  <div class="navbar bg-base-100 shadow-md px-4">
    <div class="flex-1">
      <span class="text-xl font-bold">DEMEN ERP</span>
    </div>
    <div class="flex-none gap-2">
      <div class="text-right">
        <p class="font-semibold text-sm">
          {{ authStore.user?.nombre }}
        </p>
        <p class="text-xs opacity-60">
          {{ authStore.user?.role }}
        </p>
      </div>
      <span class="text-sm opacity-60 hidden md:block">Bienvenido</span>
      <button class="btn btn-ghost btn-sm" @click="logout">
        Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>