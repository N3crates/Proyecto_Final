<template>
  <aside class="w-64 min-h-screen bg-base-200 p-4 flex flex-col">
    <ul class="menu gap-1 flex-1">
      <li v-if="hasPermission('dashboard:read')">
        <RouterLink to="/dashboard" :class="isActive('/dashboard') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">
          <LayoutDashboard class="w-4 h-4" /> Dashboard
        </RouterLink>
      </li>
      <li v-if="hasPermission('users:read')">
        <RouterLink to="/users" :class="isActive('/users') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">
          <Users class="w-4 h-4" /> Usuarios
        </RouterLink>
      </li>
      <li v-if="hasPermission('clients:read')">
        <RouterLink to="/clients" :class="isActive('/clients') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">
          <Building2 class="w-4 h-4" /> Clientes
        </RouterLink>
      </li>
      <li v-if="hasPermission('suppliers:read')">
        <RouterLink to="/suppliers" :class="isActive('/suppliers') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">
          <Truck class="w-4 h-4" /> Proveedores
        </RouterLink>
      </li>
      <li v-if="hasPermission('products:read')">
        <RouterLink to="/products" :class="isActive('/products') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">
          <Package class="w-4 h-4" /> Productos
        </RouterLink>
      </li>
      <li v-if="hasPermission('inventory:read')">
        <RouterLink to="/inventory" :class="isActive('/inventory') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">
          <Warehouse class="w-4 h-4" /> Inventario
        </RouterLink>
      </li>
      <li v-if="hasPermission('recepciones:read')">
        <RouterLink to="/recepciones" :class="isActive('/recepciones') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">
          <ClipboardList class="w-4 h-4" /> Recepciones
        </RouterLink>
      </li>
      <li v-if="hasPermission('audit:read')">
        <RouterLink to="/audit" :class="isActive('/audit') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">
          <ScrollText class="w-4 h-4" /> Auditoría
        </RouterLink>
      </li>
      <li v-if="hasPermission('roles:read')">
        <RouterLink to="/roles" :class="isActive('/roles') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">
          <ShieldCheck class="w-4 h-4" /> Roles
        </RouterLink>
      </li>
      <li v-if="hasPermission('permissions:read')">
        <RouterLink to="/permissions" :class="isActive('/permissions') ? 'bg-base-300 font-semibold' : ''" @click="$emit('close')">
          <KeyRound class="w-4 h-4" /> Permisos
        </RouterLink>
      </li>
    </ul>

    <div class="md:hidden mt-2">
      <button class="btn btn-ghost btn-sm w-full" @click="$emit('close')">✕ Cerrar menú</button>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { hasPermission } from '../utils/permissions'
import {
  LayoutDashboard, Users, Building2, Truck, Package,
  Warehouse, ClipboardList, ScrollText, ShieldCheck, KeyRound
} from 'lucide-vue-next'

defineEmits(['close'])
const route = useRoute()
function isActive(path) { return route.path === path }
</script>