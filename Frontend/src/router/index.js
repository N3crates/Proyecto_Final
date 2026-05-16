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
      permission: 'dashboard:view'
    }
  },

  {
    path: '/users',
    component: Users,
    meta: {
      requiresAuth: true,
      permission: 'users:view'
    }
  },

  {
    path: '/roles',
    component: Roles,
    meta: {
      requiresAuth: true,
      permission: 'roles:view'
    }
  },

  {
    path: '/permissions',
    component: Permissions,
    meta: {
      requiresAuth: true,
      permission: 'permissions:view'
    }
  },

  {
    path: '/clients',
    component: Clients,
    meta: {
      requiresAuth: true,
      permission: 'clients:view'
    }
  },

  {
    path: '/suppliers',
    component: Suppliers,
    meta: {
      requiresAuth: true,
      permission: 'suppliers:view'
    }
  },

  {
    path: '/products',
    component: Products,
    meta: {
      requiresAuth: true,
      permission: 'products:view'
    }
  },

  {
    path: '/inventory',
    component: Inventory,
    meta: {
      requiresAuth: true,
      permission: 'inventory:view'
    }
  },

  {
    path: '/recepciones',
    component: Recepciones,
    meta: {
      requiresAuth: true,
      permission: 'recepciones:view'
    }
  },

  {
    path: '/audit',
    component: Audit,
    meta: {
      requiresAuth: true,
      permission: 'audit:view'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (
    to.meta.requiresAuth &&
    !authStore.isAuthenticated
  ) {
    next('/login')
    return
  }
  if (
    authStore.user?.role === 'ADMIN'
  ) {
    next()
    return
  }

  const requiredPermission =
    to.meta.permission

  if (requiredPermission) {
    const hasPermission =
      authStore.permissions.includes(
        requiredPermission
      )

    if (!hasPermission) {
      next('/dashboard')
      return
    }
  }
  next()
})

export default router