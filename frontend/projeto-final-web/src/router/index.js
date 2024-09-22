import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '@/pages/Admin/LoginPage.vue'
import RegisterPage from '@/pages/Admin/RegisterPage.vue'
import NotFound from '@/pages/NotFound.vue'
import Registrations from '@/pages/Registrations.vue'
import ManterEventos from '@/pages/Admin/ManterEventos.vue'
import { useUserStore } from '@/stores/userStore'
import ManterCategorias from '@/pages/Admin/ManterCategorias.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/registrations',
      name: 'registrations',
      component: Registrations,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin/eventos',
      name: 'admin eventos',
      component: ManterEventos,
      meta: {
        requiresAuth: true,
        requiresRole: 'Admin'
      }
    },
    {
      path: '/admin/categorias',
      name: 'admin categorias',
      component: ManterCategorias,
      meta: {
        requiresAuth: true,
        requiresRole: 'Admin'
      }
    },
    { 
      path: '/:pathMatch(.*)*', 
      component: NotFound 
    },
  ]
})

export default router

router.beforeEach((to, _) => {
  const userStore = useUserStore()
  // console.log(to.meta.requiresAuth, userStore.isAuthenticated)
  if(to.meta.requiresAuth && !userStore.isAuthenticated) {
    return '/login'
  }
  if(to.meta.requiresRole && to.meta.requiresRole !== userStore.role) {
    return '/'
  }
})