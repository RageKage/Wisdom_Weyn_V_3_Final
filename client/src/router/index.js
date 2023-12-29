import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import AOS from 'aos';

// firebase import
import { getAuth, onAuthStateChanged } from "firebase/auth";

// import view
const Home = () => import("@/views/HomeView.vue");
const signIn = () => import("@/components/auth/SignIn.vue");
const signUp = () => import("@/components/auth/SignUp.vue");

const collections  = () => import("@/components/Views/collections.vue");
const submissionPage  = () => import("@/components/Views/submissionPage.vue");
const DisplayPoetry  = ()  => import("@/components/Views/DisplayPoetry.vue");

// submitProverb

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
    {
      path: "/submission",
      name: "submission",
      component: submissionPage,
      meta: { title: "submission" },
    },
    {
      path: "/displayPoetry/:id",
      name: "displayPoetry",
      component: DisplayPoetry,
      meta: { title: "Display Poetry" },
    },
  ],
  // Change the active class name for <router-link> instances
  linkActiveClass: "active",
});

router.afterEach(() => {
  AOS.refresh();
});

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

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    const user = await currentUser(); 
    if (user) {
      next();
    } else {
      alert("You need to sign in to access this page.");
      next("/signIn"); // Redirect to the sign-in page
    }
  } else {
    next();
  }
});


// Use beforeEach guard to toggle navbar visibility
router.beforeEach((to, from, next) => {
  // Hide the navbar for signIn and signUp routes
  showHeader.value = !["signIn", "signUp"].includes(to.name);
  next();
});

// Update the document title using the meta information from the route definition
router.afterEach((to) => {
  if (to.meta.title !== document.title) {
    document.title = `${to.meta.title} | Wisdom Weyn`;
  }
});

export default router; // Export the router instance for use in other parts of the application
