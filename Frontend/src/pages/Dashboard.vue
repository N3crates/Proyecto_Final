<template>
  <AdminLayout>
    <div>
      <h2 class="text-2xl font-bold mb-6">Dashboard</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card bg-base-200 shadow">
          <div class="card-body">
            <h3 class="text-sm opacity-60">Usuarios</h3>
            <p class="text-3xl font-bold">0</p>
          </div>
        </div>

        <div class="card bg-base-200 shadow">
          <div class="card-body">
            <h3 class="text-sm opacity-60">Clientes</h3>
            <p class="text-3xl font-bold">0</p>
          </div>
        </div>

        <div class="card bg-base-200 shadow">
          <div class="card-body">
            <h3 class="text-sm opacity-60">Proveedores</h3>
            <p class="text-3xl font-bold">0</p>
          </div>
        </div>

        <div class="card bg-base-200 shadow">
          <div class="card-body">
            <h3 class="text-sm opacity-60">Productos</h3>
            <p class="text-3xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '../layouts/AdminLayout.vue'
</script>