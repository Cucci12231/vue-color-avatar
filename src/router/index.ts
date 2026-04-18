import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { getCookie } from '@/utils/cookie'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '头像生成器',
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      title: '个人信息',
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Color Avatar` : 'Color Avatar'

  const userInfo = getCookie('userInfo')
  const isLoggedIn = userInfo !== null

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/home')
  } else {
    next()
  }
})

export default router
