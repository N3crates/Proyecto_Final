<template>
  <div class="navbar bg-base-100 shadow-md px-4">
    <div class="flex-none md:hidden">
      <button class="btn btn-ghost btn-sm" @click="$emit('toggle-sidebar')">
        <Menu class="h-5 w-5" />
      </button>
    </div>

    <div class="flex-1 flex flex-col justify-center">
      <span class="text-xl font-bold leading-tight">DEMEN ERP</span>
      <span class="text-xs opacity-50 hidden md:block">{{ greeting }}, {{ authStore.user?.nombre || authStore.user?.usuario }} — {{ pageDescription }}</span>
    </div>

    <div class="flex-none gap-2 flex items-center">
      <!-- Toggle tema -->
      <button class="btn btn-ghost btn-sm btn-circle" @click="toggleTheme" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
        <Sun v-if="isDark" class="w-4 h-4" />
        <Moon v-else class="w-4 h-4" />
      </button>

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity p-2 rounded-xl">
          <div class="text-right hidden md:block">
            <p class="text-sm font-semibold leading-tight">{{ authStore.user?.nombre || authStore.user?.usuario }}</p>
            <p class="text-xs opacity-50">{{ authStore.user?.usuario }}</p>
          </div>
          <div class="avatar placeholder">
            <div class="bg-primary text-primary-content rounded-full w-9 flex items-center justify-center">
              <span class="text-sm font-bold">{{ initials }}</span>
            </div>
          </div>
        </div>

        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-2xl z-50 w-56 p-2 shadow-lg border border-base-300 mt-1">
          <li class="menu-title px-3 py-2">
            <div>
              <p class="font-semibold text-sm">{{ authStore.user?.nombre }} {{ authStore.user?.apellido }}</p>
              <p class="text-xs opacity-50">{{ authStore.user?.email }}</p>
            </div>
          </li>
          <div class="divider my-1"></div>
          <li>
            <button @click="profileModal.open()">
              <UserCircle class="h-4 w-4" /> Editar perfil
            </button>
          </li>
          <li>
            <button class="text-error" @click="cerrarSesion">
              <LogOut class="h-4 w-4" /> Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <ProfileModal ref="profileModal" :loading="saving" @submit="handleSubmit" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useNotificationStore } from '../stores/notificationStore'
import ProfileModal from './ProfileModal.vue'
import api from '../services/api.js'
import { Menu, Sun, Moon, UserCircle, LogOut } from 'lucide-vue-next'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notifications = useNotificationStore()
const profileModal = ref(null)
const saving = ref(false)
const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark')

const initials = computed(() => {
  const n = authStore.user?.nombre?.[0] || ''
  const a = authStore.user?.apellido?.[0] || ''
  return (n + a).toUpperCase() || '?'
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
})

const pageDescription = computed(() => {
  const descriptions = {
    '/dashboard': 'Resumen general del sistema',
    '/users': 'Gestiona los usuarios del sistema',
    '/clients': 'Administra tus clientes',
    '/suppliers': 'Administra tus proveedores',
    '/products': 'Gestiona el catálogo de productos',
    '/inventory': 'Consulta y ajusta el inventario',
    '/recepciones': 'Registra y confirma recepciones',
    '/audit': 'Consulta el historial de eventos',
    '/roles': 'Gestiona los roles del sistema',
    '/permissions': 'Visualiza los permisos disponibles',
  }
  return descriptions[route.path] || ''
})

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function cerrarSesion() {
  authStore.logout()
  router.push('/login')
}

async function handleSubmit(payload) {
  saving.value = true
  try {
    const cleanPayload = {
      nombre: payload.nombre?.trim(),
      apellido: payload.apellido?.trim(),
      usuario: payload.usuario?.trim(),
    }
    if (payload.password) cleanPayload.password = payload.password
    await api.patch(`/users/${authStore.user.id}`, cleanPayload)
    authStore.user = { ...authStore.user, ...cleanPayload }
    localStorage.setItem('user', JSON.stringify(authStore.user))
    notifications.add('Perfil actualizado correctamente', 'success')
    profileModal.value.close()
  } catch (e) {
    notifications.add('Error al actualizar perfil', 'error')
  } finally {
    saving.value = false
  }
}
</script>