import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../utils/helpers'

// 페이지 컴포넌트
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import CountryDetail from '../pages/CountryDetail.vue'
import ContinentView from '../pages/ContinentView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/country/:code',
    name: 'CountryDetail',
    component: CountryDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/continent/:continent',
    name: 'ContinentView',
    component: ContinentView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 내비게이션 가드 - 인증 확인
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !isAuthenticated()) {
    // 인증이 필요하지만 로그인하지 않은 경우
    next('/login')
  } else if (to.path === '/login' && isAuthenticated()) {
    // 이미 로그인한 경우 로그인 페이지 접근 차단
    next('/dashboard')
  } else {
    next()
  }
})

export default router
