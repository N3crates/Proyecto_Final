<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <div class="flex flex-1">
      <Sidebar />
      <main class="flex-1 p-6 bg-base-100">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
</script>