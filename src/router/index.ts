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
      path: '/portal-admin',
      name: 'portal-admin',
      component: () => import('../views/PortalAdminView.vue'),
    },
    {
      path: '/portal-medico',
      name: 'portal-medico',
      component: () => import('../views/PortalMedicoView.vue'),
    },
    {
      path: '/portal-consultas',
      name: 'portal-consultas',
      component: () => import('../views/PortalConsultasView.vue'),
    },
  ],
})

export default router
