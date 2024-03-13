import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'

import AOS from 'aos'
import { useAuthStore } from '../store/authStore' // Import useAuthStore
import AppApiService from '../service/index'

// Import views dynamically to improve code-splitting
const Home = () => import('@/views/HomeView.vue')
const SignIn = () => import('@/components/authentication/SignIn.vue')
const SignUp = () => import('@/components/authentication/SignUp.vue')
const ErrorPage = () => import('@/views/ErrorPage.vue')
const Collections = () => import('@/components/Views/collections-view.vue')
const SubmissionPage = () => import('@/components/Views/submissionPage.vue')
const ExpandedView = () => import('@/components/Views/ExpandedView.vue')
const Dashboard = () => import('@/components/features/dashboard-view.vue')
const CustomUsername = () =>
  import('@/components/authentication/custom-username.vue')
const Setting = () => import('@/components/features/settings-view.vue')

export const isLoading = ref(false)
export const showHeader = ref(true)

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Home' } },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn,
    meta: { title: 'Sign In' },
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    meta: { title: 'Sign Up' },
  },
  {
    path: '/collections',
    name: 'Collections',
    component: Collections,
    meta: { title: 'Collections' },
  },
  {
    path: '/submissions/create',
    name: 'CreateSubmission',
    component: SubmissionPage,
    meta: { title: 'Create Submission' },
  },
  {
    path: '/submission/:id',
    name: 'SubmissionDetails',
    component: ExpandedView,
    meta: { title: 'Submission Details' },
  },
  {
    path: '/user/:username',
    name: 'UserDashboard',
    component: Dashboard,
    meta: { title: 'User Dashboard' },
  },
  {
    path: '/custom-username',
    name: 'CustomUsername',
    component: CustomUsername,
    props: true,
    meta: { title: 'Custom Username' },
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta: { requireAuth: true, title: 'Setting' },
  },
  { path: '/:pathMatch(.*)*', component: ErrorPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
})

const handleNavigation = async (to, from, next) => {
  isLoading.value = true

  const isAuthenticated = await useAuthStore().getAuthHeaders()
  showHeader.value = !['SignIn', 'SignUp', 'CustomUsername'].includes(to.name)

  // Use Optional Chaining (?.) to safely access user property
  if (to.meta.requireAuth && !isAuthenticated?.user) {
    isLoading.value = false
    return next('/sign-in')
  }

  if ((to.name === 'SignIn' || to.name === 'SignUp') && isAuthenticated?.user) {
    return next('/collections')
  }

  if (to.name === 'CustomUsername' && isAuthenticated?.user) {
    // Here, no need to call getCurrentUserDetails() again since you already have isAuthenticated
    if (isAuthenticated.dbData?.username) {
      return next('/collections')
    }
  }

  next()
}

// Combine beforeEach and afterEach hooks for better organization
router.beforeEach(handleNavigation)
router.afterEach((to) => {
  AOS.refresh()
  isLoading.value = false
  if (to.meta.title && to.meta.title !== document.title) {
    document.title = `${to.meta.title} | Wisdom Weyn`
  }
})

// server down
export const serverDown = ref(false)

// Server status checker setup
const service = AppApiService()
const checkServerStatus = async () => {
  try {
    const status = await service.checkServerStatus()
    serverDown.value = status === 'down'
  } catch {
    serverDown.value = true
  }
}

checkServerStatus()
setInterval(checkServerStatus, 1800000)

export default router
