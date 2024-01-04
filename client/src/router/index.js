import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import AOS from 'aos'

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

// // Helper function to get the currently authenticated user
// const getCurrentUser = () => {
//   return new Promise((resolve, reject) => {
//     // Listen for changes in the authentication state
//     const removeListener = onAuthStateChanged(
//       auth,
//       (user) => {
//         removeListener(); // Remove the listener once the user is retrieved
//         resolve(user);
//       },
//       reject
//     );
//   });
// };

// router.beforeEach(async (to, from, next) => {
//   if (to.matched.some((record) => record.meta.requireAuth)) {
//     const user = await currentUser();
//     if (user) {
//       next();
//     } else {
//       alert("You need to sign in to access this page.");
//       next("/signIn"); // Redirect to the sign-in page
//     }
//   } else {
//     next();
//   }
// });

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
