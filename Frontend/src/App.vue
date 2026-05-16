<template>
  <div
    v-if="uiStore.loading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/20">  
    <span class="loading loading-spinner loading-lg"></span>
  </div>
  <div>
    <AppNotifications />
    <RouterView />
  </div>
</template>

<script setup>

import { RouterView } from 'vue-router'

import { useUiStore }
from './stores/uiStore'

import AppNotifications
from './components/AppNotifications.vue'

const uiStore = useUiStore()

</script>
