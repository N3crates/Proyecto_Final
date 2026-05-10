<template>
  <AdminLayout>
    <div class="mx-auto max-w-7xl space-y-6">

      <div class="rounded-2xl border border-base-300 bg-gradient-to-br from-base-200/70 to-base-100 p-6 shadow-lg">
        <div>
          <h1 class="text-2xl font-bold">Permisos</h1>
          <p class="text-sm opacity-70">Visualiza los permisos disponibles en el sistema.</p>
        </div>
      </div>

      <div class="rounded-2xl border border-base-300 bg-base-100 shadow-lg overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Permiso</th>
              <th>Recurso</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3" class="text-center opacity-50 py-8">Sin datos por ahora</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '../layouts/AdminLayout.vue'
</script>