<template>
  <aside class="w-64 min-h-screen bg-base-200 p-4">
    <ul class="menu gap-1">
      <li v-if="hasPermission('dashboard:read')">
        <RouterLink to="/dashboard">
          Dashboard
        </RouterLink>
      </li>
      <li v-if="hasPermission('users:read')">
        <RouterLink to="/users">
          Usuarios
        </RouterLink>
      </li>
      <li v-if="hasPermission('clients:read')">
        <RouterLink to="/clients">
          Clientes
        </RouterLink>
      </li>
      <li v-if="hasPermission('suppliers:read')">
        <RouterLink to="/suppliers">
          Proveedores
        </RouterLink>
      </li>
      <li v-if="hasPermission('products:read')">
        <RouterLink to="/products">
          Productos
        </RouterLink>
      </li>
      <li v-if="hasPermission('inventory:read')">
        <RouterLink to="/inventory">
          Inventario
        </RouterLink>
      </li>
      <li v-if="hasPermission('recepciones:read')">
        <RouterLink to="/recepciones">
          Recepciones
        </RouterLink>
      </li>
      <li v-if="hasPermission('audit:read')">
        <RouterLink to="/audit">
          Auditoría
        </RouterLink>
      </li>
      <li v-if="hasPermission('roles:read')">
        <RouterLink to="/roles">
          Roles
        </RouterLink>
      </li>
      <li v-if="hasPermission('permissions:read')">
        <RouterLink to="/permissions">
          Permisos
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { hasPermission } from '../utils/permissions'

</script>