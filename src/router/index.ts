// Archivo: src/router/index.ts

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// --- 1. Importa tus Vistas (Views) ---
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PortalAdminView from '../views/PortalAdminView.vue'
import PortalMedicoView from '../views/PortalMedicoView.vue'
import PortalConsultasView from '../views/PortalConsultasView.vue'

// --- 2. Define tus Rutas ---
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/portal-admin',
    name: 'admin',
    component: PortalAdminView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/portal-medico',
    name: 'medico',
    component: PortalMedicoView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/portal-consultas',
    name: 'consultas',
    component: PortalConsultasView,
    meta: {
      requiresAuth: true,
    },
  },
]

// --- 3. Crea la instancia del Router ---
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- 4. LA GUARDIA DE NAVEGACIÓN (CORREGIDA) ---
router.beforeEach((to, from, next) => {
  const rutaEsProtegida = to.matched.some((record) => record.meta.requiresAuth)

  // ✅ CAMBIO CRÍTICO: Usar 'authToken' en lugar de 'token'
  const token = localStorage.getItem('authToken') // ← CAMBIO AQUÍ

  if (rutaEsProtegida && !token) {
    console.log(`Acceso denegado a '${to.path}'. Se requiere autenticación. Redirigiendo a /login.`)
    next({ name: 'login' })
  } else {
    next()
  }
})

// --- 5. Exporta el Router ---
export default router
