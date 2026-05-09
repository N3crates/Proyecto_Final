import { createRouter, createWebHistory } from "vue-router"
import LoginView from "../views/auth/LoginView.vue"
import DashBoardView from "../views/dashboard/DashBoardView.vue"
import UsersView from "../views/users/UsersView.vue"
import RolesView from "../views/roles/RolesView.vue"
import PermissionsView from "../views/permissions/PermissionsView.vue"
import ClientsView from "../views/clients/ClientsView.vue"
import SuppliersView from "../views/suppliers/SuppiersView.vue"
import ProductsView from "../views/products/ProductsView.vue"
import InventoryView from "../views/inventory/InventoryView.vue"
import RecepcionesView from "../views/recepciones/RecepcionesView.vue"
import AuditView from "../views/audit/AuditView.vue"

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        redirect: LoginView
    },
    {
        path: '/dashboard',
        redirect: DashBoardView
    },
    {
        path: '/users',
        redirect: UsersView
    },
    {
        path: '/roles',
        redirect: RolesView
    },
    {
        path: '/permissions',
        redirect: PermissionsView
    },
    {
        path: '/clients',
        redirect: ClientsView
    },
    {
        path: '/suppliers',
        redirect: SuppliersView
    },
    {
        path: '/products',
        redirect: ProductsView
    },
    {
        path: '/inventory',
        redirect: InventoryView
    },
    {
        path: '/recepciones',
        redirect: RecepcionesView
    },
    {
        path: '/audit',
        redirect: AuditView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router