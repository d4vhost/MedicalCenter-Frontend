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
    // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    // Cambiamos '/admin' por '/portal-admin' para que coincida con tu URL
    path: '/portal-admin',
    name: 'admin',
    component: PortalAdminView,
    meta: {
      requiresAuth: true, // <-- Marcamos esta ruta como protegida
    },
  },
  {
    path: '/medico', // Si esta URL también es '/portal-medico', cámbiala también
    name: 'medico',
    component: PortalMedicoView,
    meta: {
      requiresAuth: true, // <-- Marcamos esta ruta como protegida
    },
  },
  {
    path: '/consultas', // Lo mismo aquí
    name: 'consultas',
    component: PortalConsultasView,
    meta: {
      requiresAuth: true,
    },
  },
  // ... (añade cualquier otra ruta que tengas)
]

// --- 3. Crea la instancia del Router ---
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- 4. LA GUARDIA DE NAVEGACIÓN (LA SOLUCIÓN PRINCIPAL) ---
router.beforeEach((to, from, next) => {
  const rutaEsProtegida = to.matched.some((record) => record.meta.requiresAuth)
  const token = localStorage.getItem('token')

  if (rutaEsProtegida && !token) {
    // --- CASO 1: La ruta ES protegida PERO NO hay token ---
    console.log(`Acceso denegado a '${to.path}'. Se requiere autenticación. Redirigiendo a /login.`)
    next({ name: 'login' })
  } else {
    // --- CASO 2: La ruta NO es protegida, O SÍ es protegida y SÍ hay token ---
    next()
  }
})

// --- 5. Exporta el Router ---
export default router
