<template>
  <div class="navbar bg-base-100 shadow-md px-4">
    <div class="flex-1">
      <span class="text-xl font-bold">DEMEN ERP</span>
    </div>
    <div class="flex-none">
      <span class="font-medium text-sm opacity-70">{{ usuario }}</span>
      <button class="btn btn-ghost btn-sm" @click="handleLogout">
        Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/authStore';
  const router = useRouter()
  const authStore = useAuthStore()

  const usuario = computed(() => {
    return localStorage.getItem('usuario') || 'Usuario'
  })

  const handleLogout = () => {
    authStore.logout()
    localStorage.removeItem('usuario')
    router.push('/login')
  }
</script>