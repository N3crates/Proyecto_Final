<template>
  <div class="flex flex-col min-h-screen">
    <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="flex flex-1 relative">

      <!-- Overlay oscuro detras del sidebar en celular, cierra al hacer clic -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/50 z-20 md:hidden"
        @click="sidebarOpen = false"
      ></div>

      <!-- Sidebar fijo en celular, estatico en pc -->
      <div
        class="fixed md:static z-30 h-full transition-transform duration-300 md:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      >
        <Sidebar @close="sidebarOpen = false" />
      </div>

      <!-- Area de contenido principal donde se renderizan las paginas -->
      <main class="flex-1 p-6 min-w-0 bg-indigo-300/30">
        <slot />
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'

// Controla la visibilidad del sidebar en celular
const sidebarOpen = ref(false)
</script>