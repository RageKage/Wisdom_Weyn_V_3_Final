import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";

// firebase import
import { getAuth, onAuthStateChanged } from "firebase/auth";

// import view
const Home = () => import("@/views/HomeView.vue");
const signIn = () => import("@/components/auth/SignIn.vue")
const signUp = () => import("@/components/auth/SignUp.vue")

const collections = import("@/components/Views/collections.vue")


export const showHeader = ref(true);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: { title: "Home" },
    },
    {
      path: "/signIn",
      name: "signIn",
      component: signIn,
      meta: { title: "sign In" },
    },
    {
      path: "/signUp",
      name: "signUp",
      component: signUp,
      meta: { title: "sign Up" },
    },
    {
      path: "/collections",
      name: "collections",
      component: collections,
      meta: { title: "collections" },
    },
  ],
  // Change the active class name for <router-link> instances
  linkActiveClass: "active",
});

router.afterEach(() => {
  AOS.refresh();
});


// // Get the currently signed-in user
// const getCurrentUser = () => {
//   return new Promise((resolve, reject) => {
//     const removeListener = onAuthStateChanged(
//       getAuth(),
//       (user) => {
//         removeListener();
//         resolve(user);
//       },
//       reject
//     );
//   });
// };

// // Check for authentication before navigating to protected routes
// router.beforeEach(async (to, from, next) => {
//   showHeader.value = to.name !== "not-found";

//   const user = await getCurrentUser();
//   const adminUid = import.meta.env.VITE_ADMIN_UID;

//   if (to.matched.some((record) => record.meta.requireAuth)) {
//     if (user && user.uid === adminUid) {
//       next();
//     } else {
//       next("/sign-in");
//     }
//   } else {
//     next();
//   }
// });

// Update the document title using the meta information from the route definition
router.afterEach((to) => {
  document.title = to.meta.title || "Admin";
  
});

// Use beforeEach guard to toggle navbar visibility
router.beforeEach((to, from, next) => {
  // Hide the navbar for signIn and signUp routes
  showHeader.value = !['signIn', 'signUp'].includes(to.name);
  next();
});


export default router; // Export the router instance for use in other parts of the application
