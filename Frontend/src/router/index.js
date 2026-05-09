import { createRouter, createWebHistory } from "vue-router"
import login from "../pages/login.vue"
import Dashboard from "../pages/Dashboard.vue"
import Users from "../pages/Users.vue"
import Roles from "../pages/Roles.vue" //Roles
import Permissions from "../pages/Permissions.vue" //Permissions
import Clients from "../pages/Clients.vue"
import Suppliers from "../pages/Suppliers.vue"
import Products from "../pages/Products.vue"
import Inventory from "../pages/Inventory.vue" //Inventario
import Recepciones from "../pages/Recepciones.vue" //Recepciones
import Audit from "../pages/Audit.vue" //Audit

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        redirect: login
    },
    {
        path: '/dashboard',
        redirect: Dashboard
    },
    {
        path: '/users',
        redirect: Users
    },
    {
        path: '/roles',
        redirect: Roles
    },
    {
        path: '/permissions',
        redirect: Permissions
    },
    {
        path: '/clients',
        redirect: Clients
    },
    {
        path: '/suppliers',
        redirect: Suppliers
    },
    {
        path: '/products',
        redirect: Products
    },
    {
        path: '/inventory',
        redirect: Inventory
    },
    {
        path: '/recepciones',
        redirect: Recepciones
    },
    {
        path: '/audit',
        redirect: Audit
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router