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
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  {
    path: '/portal-admin',
    name: 'admin',
    component: PortalAdminView,
    meta: { requiresAuth: true },
  },
  {
    path: '/portal-medico',
    name: 'medico',
    component: PortalMedicoView,
    meta: { requiresAuth: true },
  },
  {
    path: '/portal-consultas',
    name: 'consultas',
    component: PortalConsultasView,
    meta: { requiresAuth: false },
  },
]

// --- 3. Crea la instancia del Router ---
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- 4. LA GUARDIA DE NAVEGACIÓN (CON LOGS) ---
router.beforeEach((to, from, next) => {
  // <-- NUEVO CONSOLE.LOG
  console.log(`[Router] Navegando de ${from.path} -> ${to.path}`)

  const rutaEsProtegida = to.matched.some((record) => record.meta.requiresAuth)
  console.log(`[Router] ¿Ruta ${to.path} es protegida? ${rutaEsProtegida}`) // <-- NUEVO CONSOLE.LOG

  // ✅ CAMBIO CRÍTICO: Usar 'authToken' en lugar de 'token'
  const token = localStorage.getItem('authToken') // ← CAMBIO AQUÍ

  if (token) {
    console.log('[Router] Token encontrado en localStorage.') // <-- NUEVO CONSOLE.LOG
  } else {
    console.log('[Router] No se encontró token en localStorage.') // <-- NUEVO CONSOLE.LOG
  }

  if (rutaEsProtegida && !token) {
    console.log(`[Router] Acceso denegado a '${to.path}'. Redirigiendo a /login.`) // <-- NUEVO CONSOLE.LOG
    next({ name: 'login' })
  } else {
    console.log(`[Router] Acceso permitido a '${to.path}'.`) // <-- NUEVO CONSOLE.LOG
    next()
  }
})

// --- 5. Exporta el Router ---
export default router
