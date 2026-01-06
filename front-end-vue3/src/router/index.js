import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layouts/Layout.vue'
import Dashboard from '../pages/Dashboard.vue'
import CountryDetail from '../pages/CountryDetail.vue'
import Login from '../pages/Login.vue'

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'Login'
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        component: Dashboard,
        name: 'Dashboard'
      },
      {
        path: 'country/:countryCode',
        component: CountryDetail,
        name: 'CountryDetail'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
