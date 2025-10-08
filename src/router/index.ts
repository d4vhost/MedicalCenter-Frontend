// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/portal-empleado',
      name: 'portal-empleado',
      component: () => import('../views/PortalEmpleadoView.vue'),
    },
    {
      path: '/portal-paciente',
      name: 'portal-paciente',
      component: () => import('../views/PortalPacienteView.vue'),
    },
  ],
})

export default router
