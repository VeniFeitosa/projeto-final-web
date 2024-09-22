import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '@/pages/Admin/LoginPage.vue'
import RegisterPage from '@/pages/Admin/RegisterPage.vue'
import NotFound from '@/pages/NotFound.vue'
import Registrations from '@/pages/Registrations.vue'
import { useUserStore } from '@/stores/userStore'

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