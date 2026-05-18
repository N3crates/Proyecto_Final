import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/authStore"
import login from "../pages/login.vue"
import Dashboard from "../pages/Dashboard.vue"
import Users from "../pages/Users.vue"
import Roles from "../pages/Roles.vue"
import Permissions from "../pages/Permissions.vue"
import Clients from "../pages/Clients.vue"
import Suppliers from "../pages/Suppliers.vue"
import Products from "../pages/Products.vue"
import Inventory from "../pages/Inventory.vue"
import Recepciones from "../pages/Recepciones.vue"
import Audit from "../pages/Audit.vue"

const routes = [

  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/login',
    component: login
  },

  {
    path: '/dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      permission: 'dashboard:read'
    }
  },

  {
    path: '/users',
    component: Users,
    meta: {
      requiresAuth: true,
      permission: 'users:read'
    }
  },

  {
    path: '/roles',
    component: Roles,
    meta: {
      requiresAuth: true,
      permission: 'roles:read'
    }
  },

  {
    path: '/permissions',
    component: Permissions,
    meta: {
      requiresAuth: true,
      permission: 'permissions:read'
    }
  },

  {
    path: '/clients',
    component: Clients,
    meta: {
      requiresAuth: true,
      permission: 'clients:read'
    }
  },

  {
    path: '/suppliers',
    component: Suppliers,
    meta: {
      requiresAuth: true,
      permission: 'suppliers:read'
    }
  },

  {
    path: '/products',
    component: Products,
    meta: {
      requiresAuth: true,
      permission: 'products:read'
    }
  },

  {
    path: '/inventory',
    component: Inventory,
    meta: {
      requiresAuth: true,
      permission: 'inventory:read'
    }
  },

  {
    path: '/recepciones',
    component: Recepciones,
    meta: {
      requiresAuth: true,
      permission: 'recepciones:read'
    }
  },

  {
    path: '/audit',
    component: Audit,
    meta: {
      requiresAuth: true,
      permission: 'audit:read'
    }
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  const roleName = authStore.user?.role?.nombre || authStore.user?.role?.name || authStore.user?.roleId || ''
  
  if (
    roleName === 'ADMIN' ||
    roleName === 'role_admin'
  ) {
    return true
  }

  const requiredPermission = to.meta.permission

  if (requiredPermission) {
  const hasPermission = authStore.permissions.includes(requiredPermission)
    if (!hasPermission) {
      if (to.path !== '/login') {
        return '/login'
      }
      return true
    }
  }
  return true
})
export default router