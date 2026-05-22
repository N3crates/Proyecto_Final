<template>
  <aside class="w-64 min-h-screen bg-base-200 p-4">
    <ul class="menu gap-1">
      <li v-if="hasPermission('dashboard:read')">
        <RouterLink to="/dashboard" :class="{ 'active': isActive('/dashboard') }">
          Dashboard
        </RouterLink>
      </li>
      <li v-if="hasPermission('users:read')">
        <RouterLink to="/users" :class="{ 'active': isActive('/users') }">
          Usuarios
        </RouterLink>
      </li>
      <li v-if="hasPermission('clients:read')">
        <RouterLink to="/clients" :class="{ 'active': isActive('/clients') }">
          Clientes
        </RouterLink>
      </li>
      <li v-if="hasPermission('suppliers:read')">
        <RouterLink to="/suppliers" :class="{ 'active': isActive('/suppliers') }">
          Proveedores
        </RouterLink>
      </li>
      <li v-if="hasPermission('products:read')">
        <RouterLink to="/products" :class="{ 'active': isActive('/products') }">
          Productos
        </RouterLink>
      </li>
      <li v-if="hasPermission('inventory:read')">
        <RouterLink to="/inventory" :class="{ 'active': isActive('/inventory') }">
          Inventario
        </RouterLink>
      </li>
      <li v-if="hasPermission('recepciones:read')">
        <RouterLink to="/recepciones" :class="{ 'active': isActive('/recepciones') }">
          Recepciones
        </RouterLink>
      </li>
      <li v-if="hasPermission('audit:read')">
        <RouterLink to="/audit" :class="{ 'active': isActive('/audit') }">
          Auditoría
        </RouterLink>
      </li>
      <li v-if="hasPermission('roles:read')">
        <RouterLink to="/roles" :class="{ 'active': isActive('/roles') }">
          Roles
        </RouterLink>
      </li>
      <li v-if="hasPermission('permissions:read')">
        <RouterLink to="/permissions" :class="{ 'active': isActive('/permissions') }">
          Permisos
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { hasPermission } from '../utils/permissions'

const route = useRoute()

function isActive(path) {
  return route.path === path
}
</script>