# DEMEN ERP

Sistema ERP empresarial fullstack desarrollado con Node.js, Express, Firebase Firestore y Vue 3 + Vite.

Proyecto realizado para la materia de Computo en la Nube.

---

# Tecnologías utilizadas

## Backend
- Node.js
- Express
- Firebase Admin SDK
- Cloud Firestore
- JWT
- bcrypt
- dotenv
- cors
- helmet
- morgan

## Frontend
- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- TailwindCSS
- DaisyUI
- Lucide Vue Next
- Lodash

---

# Estructura del proyecto

```txt
Proyecto_Final/
│
├── Backend/
│
├── Frontend/
│
├── .gitignore
│
└── README.md
```

---

# Estructura Backend

```txt
Backend/
│
├── src/
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   ├── routes/
│   ├── utils/
│   └── app.js
│
├── .env
├── package.json
├── package-lock.json
└── server.js
```

---

# Estructura Frontend

```txt
Frontend/
│
├── public/
│
├── src/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   ├── router/
│   ├── services/
│   ├── stores/
│   ├── utils/
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── package.json
├── vite.config.js
└── index.html
```

---

# Clonar repositorio

```bash
git clone https://github.com/N3crates/Proyecto_Final.git
```

---

# Instalación Backend

## Entrar a backend

```bash
cd Backend
```

## Instalar dependencias

```bash
npm install
```

## Dependencias utilizadas

```bash
npm install express firebase-admin dotenv cors bcrypt jsonwebtoken helmet morgan
```

## Dependencias de desarrollo

```bash
npm install -D nodemon
```

---

# Variables de entorno Backend

Crear archivo `.env`

Ejemplo:

```env
PORT=3001
JWT_SECRET=your_secret_key
```

---

# Ejecutar Backend

## Modo desarrollo

```bash
npm run dev
```

## Modo producción

```bash
npm start
```

---

# Instalación Frontend

## Entrar a frontend

```bash
cd Frontend
```

## Instalar dependencias

```bash
npm install
```

## Dependencias utilizadas

```bash
npm install vue-router pinia axios lodash lucide-vue-next tailwindcss daisyui @tailwindcss/vite
```

---

# Ejecutar Frontend

```bash
npm run dev
```

---

# Funcionalidades principales

- Autenticación JWT
- Roles y permisos por modulo
- CRUD de usuarios
- CRUD de clientes
- CRUD de proveedores
- CRUD de productos
- Control de inventario con movimientos
- Recepciones de productos con confirmacion
- Dashboard con metricas en tiempo real
- Auditoria de eventos del sistema
- Proteccion de rutas por permiso
- Tema claro y oscuro persistente
- Diseño responsive

---

# APIs principales

## Auth

```http
POST /api/auth/login
GET  /api/auth/me
```

## Usuarios

```http
GET    /api/users
POST   /api/users
PATCH  /api/users/:id
PATCH  /api/users/:id/toggle-active
DELETE /api/users/:id
```

## Clientes

```http
GET    /api/clients
POST   /api/clients
PATCH  /api/clients/:id
PATCH  /api/clients/:id/toggle-active
DELETE /api/clients/:id
```

## Proveedores

```http
GET    /api/suppliers
POST   /api/suppliers
PATCH  /api/suppliers/:id
PATCH  /api/suppliers/:id/toggle-active
DELETE /api/suppliers/:id
```

## Productos

```http
GET    /api/products
POST   /api/products
PATCH  /api/products/:id
PATCH  /api/products/:id/toggle-active
DELETE /api/products/:id
```

## Inventario

```http
GET   /api/inventory
PATCH /api/inventory/:productId/adjust
GET   /api/inventory/movements
```

## Recepciones

```http
GET    /api/recepciones
POST   /api/recepciones
PATCH  /api/recepciones/:id
PATCH  /api/recepciones/:id/confirm
DELETE /api/recepciones/:id
```

## Roles y Permisos

```http
GET    /api/roles
POST   /api/roles
PATCH  /api/roles/:id
DELETE /api/roles/:id
GET    /api/permissions
```

## Dashboard y Auditoria

```http
GET /api/dashboard/summary
GET /api/dashboard/recent-activity
GET /api/audit
```

---

# Seguridad implementada

- JWT Authentication
- Password hashing con bcrypt
- Middleware de autenticacion
- Middleware de roles y permisos
- Rutas protegidas por permiso especifico
- Variables de entorno
- Helmet
- CORS
- Manejo de errores
- Auditoria de acciones
- Toggle activo — usuarios inactivos bloqueados en login

---

# Scripts disponibles

## Backend

```bash
npm run dev
npm start
```

## Frontend

```bash
npm run dev
npm run build
```

---

# Git Ignore

El proyecto ignora automaticamente:

- node_modules
- variables de entorno
- builds
- logs
- credenciales Firebase

---

# Integrantes

## Integrante 1 — Auth, Seguridad, Roles y Administración
- Firebase y configuracion del proyecto
- JWT y autenticacion
- Roles, permisos y rutas protegidas
- Auditoria
- Dashboard
- Usuarios

## Integrante 2 — UI, Servicios y Composables
- Diseño y componentes de interfaz
- Layout responsive con sidebar colapsable
- Servicios de comunicacion con la API
- Composables de estado y paginacion
- Clientes, Proveedores, Productos, Inventario, Recepciones
- Tema claro/oscuro



# Estado del proyecto

✅ Completado

---

# Licencia

Proyecto académico.