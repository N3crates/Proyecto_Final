import { createRouter, createWebHistory } from "vue-router"
import {useAuthStore} from "../stores/authStore"
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
        component: login,
        meta:{
            requiresAuth: true
        }
    },
    {
        path: '/dashboard',
        component: Dashboard,
        meta:{
            requiresAuth: true
        }
    },
    {
        path: '/users',
        component: Users,
        meta:{
            requiresAuth: true
        }
    },
    {
        path: '/roles',
        component: Roles,
        meta:{
            requiresAuth: true
        }
    },
    {
        path: '/permissions',
        component: Permissions,
        meta:{
            requiresAuth: true
        }
    },
    {
        path: '/clients',
        component: Clients,
        meta:{
            requiresAuth: true
        }
    },
    {
        path: '/suppliers',
        component: Suppliers,
        meta:{
            requiresAuth: true
        }
    },
    {
        path: '/products',
        component: Products,
        meta:{
            requiresAuth: true
        }
    },
    {
        path: '/inventory',
        component: Inventory,
        meta:{
            requiresAuth: true
        }
    },
    {
        path: '/recepciones',
        component: Recepciones,
        meta:{
            requiresAuth: true
        }
    },
    {
        path: '/audit',
        component: Audit,
        meta:{
            requiresAuth: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if(to.meta.requiresAuth && !authStore.isAuthenticated){
        next('/login')
        return
    }
    next()
})

export default router