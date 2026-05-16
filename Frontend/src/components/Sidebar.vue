<template>
  <aside class="w-64 min-h-screen bg-base-200 p-4">
    <ul class="menu gap-1">
      <li v-if="hasPermission('dashboard:view')">
        <RouterLink to="/dashboard">
          Dashboard
        </RouterLink>
      </li>
      <li v-if="hasPermission('users:view')">
        <RouterLink to="/users">
          Usuarios
        </RouterLink>
      </li>
      <li v-if="hasPermission('clients:view')">
        <RouterLink to="/clients">
          Clientes
        </RouterLink>
      </li>
      <li v-if="hasPermission('suppliers:view')">
        <RouterLink to="/suppliers">
          Proveedores
        </RouterLink>
      </li>
      <li v-if="hasPermission('products:view')">
        <RouterLink to="/products">
          Productos
        </RouterLink>
      </li>
      <li v-if="hasPermission('inventory:view')">
        <RouterLink to="/inventory">
          Inventario
        </RouterLink>
      </li>
      <li v-if="hasPermission('recepciones:view')">
        <RouterLink to="/recepciones">
          Recepciones
        </RouterLink>
      </li>
      <li v-if="hasPermission('audit:view')">
        <RouterLink to="/audit">
          Auditoría
        </RouterLink>
      </li>
      <li v-if="hasPermission('roles:view')">
        <RouterLink to="/roles">
          Roles
        </RouterLink>
      </li>
      <li v-if="hasPermission('permissions:view')">
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