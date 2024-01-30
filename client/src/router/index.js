import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import AOS from 'aos'

import { currentUser, getCurrentUser } from '../service/authService.js'

// firebase import

// import view
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

export const showHeader = ref(true)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { title: 'Home' },
    },
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
      path: '/users/:id/dashboard',
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
    {
      path: '/:pathMatch(.*)*',
      name: '',
      component: ErrorPage,
      meta: { title: '' },
    },
  ],

  // Change the active class name for <router-link> instances
  linkActiveClass: 'active',
})

router.afterEach(() => {
  AOS.refresh()
})

// Before each navigation, check if the user is authenticated and has access to the requested route
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (await currentUser()) {
      next()
    } else {
      alert("You don't have access.")
      next('/sign-in') // Redirect to the Login page if not authenticated
    }
  } else {
    next()
  }
})

// ! next update add logic to check that if the user some how got past this that the server checks that the if the user doesn't have a username it allows them to create one else if they do res should be 404 with the message " to update your username do it through the settings page"
// block auth users from accessing the CustomUsername page if they already have a username, also first we wanna check the localStorage named user-data to see if the user has a username, if they do then we redirect them to the collections
router.beforeEach(async (to, from, next) => {
  const userDataStr = localStorage.getItem('user-data')
  let userData

  if (userDataStr) {
    userData = JSON.parse(userDataStr) // Parse stored json string to object
  }

  // Redirect to collections if user is already authenticated
  if (userData && ['SignIn', 'SignUp', 'CustomUsername'].includes(to.name)) {
    next('/collections') // Redirect to collections or a default authenticated user page
    return
  }

  // CustomUsername page access logic
  if (to.name === 'CustomUsername') {
    if (userData && userData.username) {
      alert(
        'Please use setting to change username. Remember you can only change your username once.',
      )
      next('/collections')
    } else {
      const authUser = await currentUser()

      if (authUser) {
        const dbUser = await getCurrentUser(authUser.uid)
        if (dbUser.username) {
          next('/setting')
        } else {
          next()
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

// Use beforeEach guard to toggle navbar visibility
router.beforeEach((to, from, next) => {
  // Hide the navbar for signIn and signUp routes
  showHeader.value = !['SignIn', 'SignUp', 'CustomUsername'].includes(to.name)
  next()
})

// Update the document title using the meta information from the route definition
router.afterEach((to) => {
  if (to.meta.title !== document.title) {
    document.title = `${to.meta.title} | Wisdom Weyn`
  }
})

export default router // Export the router instance for use in other parts of the application
