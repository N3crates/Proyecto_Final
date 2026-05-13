<template>
  <div class="navbar bg-base-100 shadow-md px-4">
    <div class="flex-1">
      <span class="text-xl font-bold">DEMEN ERP</span>
    </div>
    <div class="flex-none gap-2">
      <span class="text-sm opacity-60 hidden md:block">Bienvenido</span>
      <button class="btn btn-ghost btn-sm" @click="cerrarSesion">
        Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function cerrarSesion() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>