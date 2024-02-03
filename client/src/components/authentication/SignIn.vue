<template>
  <div
    class="flex justify-center items-center fixed top-0 left-0 min-h-full min-w-full bg-seashell-50 z-50"
  >
    <!-- Firebase Error Message -->
    <div
      class="flex items-center p-4 mb-4 text-sm text-white rounded-3xl bg-red-500 w-full max-w-md"
      role="alert"
      v-if="firebaseError"
    >
      <svg
        class="flex-shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
        />
      </svg>
      <span class="sr-only">Error</span>
      <div>
        <span>
          {{ firebaseError }}
        </span>
      </div>
    </div>

    <form
      class="flex flex-col space-y-6 p-8 rounded-3xl shadow w-full max-w-md bg-seashell-50"
      @submit.prevent="signin"
    >
      <button
        @click="router.push('/')"
        class="text-seashell-900 hover:text-seashell-700 focus:outline-none"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="text-seashell-900 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </span>
      </button>

      <h1 class="text-2xl font-semibold text-seashell-900">Sign In</h1>
      <p class="text-seashell-600 text-sm">
        {{ options[randomIndex] }}
      </p>
      <input
        type="email"
        v-model="email"
        name="email"
        id="email"
        placeholder="Email"
        class="border border-seashell-300 text-seashell-900 rounded-lg focus:ring-saffron-500 focus:border-saffron-500 block w-full p-2.5"
        required
        aria-required="true"
        autocomplete="email"
      />
      <input
        type="password"
        v-model="password"
        name="password"
        id="password"
        placeholder="Password"
        class="border border-seashell-300 text-seashell-900 rounded-lg focus:ring-saffron-500 focus:border-saffron-500 block w-full p-2.5"
        required
        aria-required="true"
        autocomplete="current-password"
      />
      <button
        type="submit"
        class="bg-carrotOrange-500 border-2 hover:bg-carrotOrange-600 text-white font-bold py-3 px-6 rounded-3xl shadow-lg transition duration-300"
      >
        Sign In
      </button>
      <div class="flex items-center justify-between">
        <hr class="w-full" />
        <span class="p-2 text-seashell-400">OR</span>
        <hr class="w-full" />
      </div>
      <button
        type="button"
        @click="signinGoogle"
        class="w-full flex justify-center items-center gap-2 text-sm text-seashell-600 p-2 rounded-md hover:bg-seashell-50 border border-seashell-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-seashell-200 transition-colors duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="w-4"
          id="google"
        >
          <path
            fill="#fbbb00"
            d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"
          ></path>
          <path
            fill="#518ef8"
            d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"
          ></path>
          <path
            fill="#28b446"
            d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"
          ></path>
          <path
            fill="#f14336"
            d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"
          ></path>
        </svg>
        Sign In with Google
      </button>

      <div class="mt-4 text-sm text-seashell-600 text-center">
        <p>
          Don't have an account?
          <router-link to="/sign-up" class="text-black hover:underline"
            >Sign up here</router-link
          >
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { signinWithEmail, signinWithGoogle } from './Auth'
  import { syncGoogleUserData, UsernameInDB } from './UserDataManager'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const firebaseError = ref('')

  const options = [
    'soo dhawoow / Welcome!',
    'Waan ku xiisaynaa / We missed you!',
    "Discover what's new in the library. Sign in and explore.",
    'Halkeen dib uga bilownaa maanta?',
    'The words are calling... will you answer? Sign in and find out.',
    'Sign up and contribute',
    'Every contribution adds to the richness of our culture. Share yours today.',
  ]

  const randomIndex = ref(
    localStorage.getItem('random-signUp-msg') ||
      Math.floor(Math.random() * options.length),
  )

  const getRandomIndex = () => {
    let newIndex = Math.floor(Math.random() * options.length)
    while (newIndex === randomIndex.value) {
      newIndex = Math.floor(Math.random() * options.length)
    }
    randomIndex.value = newIndex
    localStorage.setItem('random-signUp-msg', newIndex)
  }

  // Change random index every 5 seconds
  setInterval(getRandomIndex, 5000)

  async function signin() {
    try {
      const userCredential = await signinWithEmail(email.value, password.value)
      //    if (userCredential.user.emailVerified) future implements email verification with firebase
      if (userCredential.user) {
        router.push('/') // Redirect to home after successful login
      } else {
        firebaseError.value = 'Please verify your email/password'
      }
    } catch (error) {
      if (error) {
        switch (error.code) {
          case 'auth/invalid-email':
            firebaseError.value = 'Invalid email'
            break
          case 'auth/invalid-credential':
            firebaseError.value = 'Invalid credential'
            break
          case 'auth/user-not-found':
            firebaseError.value = 'User not found'
            break
          case 'auth/wrong-password':
            firebaseError.value = 'Wrong password'
            break
          default:
            firebaseError.value = 'Email or password is incorrect'
            break
        }
      } else {
        firebaseError.value = 'An unknown error occurred'
      }
    }
  }

  async function signinGoogle() {
    try {
      const userCredential = await signinWithGoogle()
      const user = userCredential.user

      // Sync user data with the database first
      await syncGoogleUserData(user)

      // Store user data in localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(user))

      // Check for existing username
      const hasUsername = await UsernameInDB(user.uid)
      if (hasUsername) {
        router.push('/') // Redirect to home if username exists
      } else {
        router.push('/custom-username') // Redirect to username creation page
      }
    } catch (error) {
      console.error('Error during sign-in:', error)

      // Handle specific errors with appropriate messages
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-email':
            firebaseError.value = 'Invalid email'
            break
          case 'auth/user-not-found':
            firebaseError.value = 'User not found'
            break
        }
      } else {
        firebaseError.value = 'An unknown error occurred'
      }
    }
  }
</script>
