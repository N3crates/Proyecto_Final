<template>
  <aside class="w-64 min-h-screen bg-base-200 p-4">
    <div class="flex justify-between items-center mb-2 md:hidden">
      <span class="font-bold text-sm">Menú</span>
      <button class="btn btn-ghost btn-xs" @click="$emit('close')">✕</button>
    </div>
    <ul class="menu gap-1">
      <li v-if="hasPermission('dashboard:read')">
        <RouterLink to="/dashboard" :class="isActive('/dashboard') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">Dashboard</RouterLink>
      </li>
      <li v-if="hasPermission('users:read')">
        <RouterLink to="/users" :class="isActive('/users') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">Usuarios</RouterLink>
      </li>
      <li v-if="hasPermission('clients:read')">
        <RouterLink to="/clients" :class="isActive('/clients') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">Clientes</RouterLink>
      </li>
      <li v-if="hasPermission('suppliers:read')">
        <RouterLink to="/suppliers" :class="isActive('/suppliers') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">Proveedores</RouterLink>
      </li>
      <li v-if="hasPermission('products:read')">
        <RouterLink to="/products" :class="isActive('/products') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">Productos</RouterLink>
      </li>
      <li v-if="hasPermission('inventory:read')">
        <RouterLink to="/inventory" :class="isActive('/inventory') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">Inventario</RouterLink>
      </li>
      <li v-if="hasPermission('recepciones:read')">
        <RouterLink to="/recepciones" :class="isActive('/recepciones') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">Recepciones</RouterLink>
      </li>
      <li v-if="hasPermission('audit:read')">
        <RouterLink to="/audit" :class="isActive('/audit') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">Auditoría</RouterLink>
      </li>
      <li v-if="hasPermission('roles:read')">
        <RouterLink to="/roles" :class="isActive('/roles') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">Roles</RouterLink>
      </li>
      <li v-if="hasPermission('permissions:read')">
        <RouterLink to="/permissions" :class="isActive('/permissions') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">Permisos</RouterLink>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { hasPermission } from '../utils/permissions'

defineEmits(['close'])

const route = useRoute()

function isActive(path) {
  return route.path === path
}
</script>