import { createRouter, createWebHistory } from "vue-router"
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
import Audit from "../pages/Audit.vue" //Audit
import { Component } from "react"

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
        component: Dashboard
    },
    {
        path: '/users',
        component: Users
    },
    {
        path: '/roles',
        component: Roles
    },
    {
        path: '/permissions',
        component: Permissions
    },
    {
        path: '/clients',
        component: Clients
    },
    {
        path: '/suppliers',
        component: Suppliers
    },
    {
        path: '/products',
        component: Products
    },
    {
        path: '/inventory',
        component: Inventory
    },
    {
        path: '/recepciones',
        component: Recepciones
    },
    {
        path: '/audit',
        component: Audit
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router