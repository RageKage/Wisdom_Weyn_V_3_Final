<template>
  <div
    class="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="flex flex-col items-center justify-center w-full max-w-md">
      <!-- Firebase Error Message -->
      <div
        class="flex items-center p-4 mb-4 text-sm text-white shadow-lg rounded-3xl bg-red-500 w-full max-w-md"
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
        class="flex flex-col space-y-6 p-8 rounded-3xl bg-seashell-50 shadow-lg w-full max-w-md"
        @submit.prevent="signup"
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

        <!-- Be a part of something bigger. Sign up and contribute to the Somali literary landscape. -->
        <h1 class="text-2xl font-semibold text-seashell-900">Sign Up</h1>
        <p class="text-seashell-600 text-sm">
          {{ options[randomIndex] }}
        </p>

        <!-- Name Input -->
        <div>
          <input
            type="text"
            v-model="name"
            name="name"
            id="name"
            placeholder="Full Name or First Name"
            class="border border-seashell-300 text-seashell-900 rounded-lg focus:ring-saffron-500 focus:border-saffron-500 block w-full p-2.5"
            @blur="validateName"
          />
          <p v-if="nameError" class="text-cinnabar-500 text-xs mt-1">
            {{ nameError }}
          </p>
        </div>

        <!-- Email Input -->
        <div>
          <input
            type="email"
            v-model="email"
            name="email"
            id="email"
            placeholder="Email"
            class="border border-seashell-300 text-seashell-900 rounded-lg focus:ring-saffron-500 focus:border-saffron-500 block w-full p-2.5"
            @blur="validateEmail"
          />
          <p v-if="emailError" class="text-cinnabar-500 text-xs mt-1">
            {{ emailError }}
          </p>
        </div>

        <!-- Password Input -->
        <div>
          <input
            type="password"
            v-model="password"
            name="password"
            id="password"
            placeholder="Password"
            class="border border-seashell-300 text-seashell-900 rounded-lg focus:ring-saffron-500 focus:border-saffron-500 block w-full p-2.5"
            @blur="validatePassword"
          />
          <p v-if="passwordError" class="text-cinnabar-500 text-xs mt-1">
            {{ passwordError }}
          </p>
        </div>

        <button
          type="submit"
          @click.prevent="signup"
          class="bg-carrotOrange-500 border-2 hover:bg-carrotOrange-600 text-white font-bold py-3 px-6 rounded-3xl shadow-lg transition duration-300"
        >
          Sign Up
        </button>
        <div class="flex items-center justify-between">
          <hr class="w-full" />
          <span class="p-2 text-seashell-400">OR</span>
          <hr class="w-full" />
        </div>
        <button
          type="button"
          @click="signUpGoogle"
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
          Sign Up with Google
        </button>
        <div class="mt-4 text-sm text-seashell-600 text-center">
          <p>
            Already have an account?
            <router-link to="/sign-in" class="text-black hover:underline"
              >Login here</router-link
            >
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { signupWithEmail, signinWithGoogle } from './Auth'
  import { useRouter } from 'vue-router'

  import AppApiService from '../../service/index.js'

  const service = AppApiService()
  const router = useRouter()
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const nameError = ref('')
  const emailError = ref('')
  const passwordError = ref('')
  const firebaseError = ref('')

  const options = [
    'Help us create the largest collection of Somali poetry. Sign up and contribute!',
    "The library may be small, but it's growing every day. Join us and add your voice.",
    "The collection is expanding, and we're just getting started. Join us on the journey.",
    'Be a part of something bigger. Sign up and contribute to the Somali literary landscape.',
  ]

  // Random index for options to be used in the signup page,
  const randomIndex = Math.floor(Math.random() * options.length)

  const getRandomIndex = () => {
    let newIndex = Math.floor(Math.random() * options.length)
    while (newIndex === randomIndex.value) {
      newIndex = Math.floor(Math.random() * options.length)
    }
    randomIndex.value = newIndex
    localStorage.setItem('random-signIn-msg', newIndex)
  }

  setInterval(getRandomIndex, 5000)

  const validateName = () => {
    // Name validation
    nameError.value =
      name.value.length < 2 ? 'Name must be at least 2 characters long.' : ''
  }

  const validateEmail = () => {
    // email validation
    emailError.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
      ? ''
      : 'Invalid email format.'
  }

  const validatePassword = () => {
    // Password validation
    passwordError.value =
      password.value.length < 6
        ? 'Password must be at least 6 characters long.'
        : ''
  }

  async function signup() {
    // Validate fields before attempting to sign up
    validateName()
    validateEmail()
    validatePassword()

    if (nameError.value || emailError.value || passwordError.value) {
      return // if there are any errors then return the error
    }

    try {
      const userCredential = await signupWithEmail(email.value, password.value)

      const addUsertoDB = await service.addUserToDB(
        userCredential.user,
        name.value,
      )

      // Store user data in localStorage
      localStorage.setItem('isLoggedIn', 'true')

      if (addUsertoDB) {
        const hasUsername = await service.checkUsername()

        if (hasUsername == true) {
          router.push('/') // Redirect to home if username exists
        } else {
          router.push('/custom-username') // Redirect to username creation page
        }
      } else {
        firebaseError.value = 'An unknown error occurred'
      }
    } catch (error) {
      console.log('Error signing in:', error)

      firebaseError.value = error.message // Display Firebase error
      if (error) {
        switch (error.code) {
          case 'auth/invalid-email':
            firebaseError.value = 'Invalid email'
            break
        }
      } else {
        firebaseError.value = 'An unknown error occurred'
      }
    }
  }

  async function signUpGoogle() {
    try {
      const userCredential = await signinWithGoogle()
      const user = userCredential.user

      await user?.reload()

      // Sync google user data with the database first
      await service.syncGoogleUserData(user)

      // Store user data in localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(user))

      // Check for existing username
      const hasUsername = await service.checkUsername()

      if (hasUsername == true) {
        router.push('') // Redirect to home if username exists
      } else {
        router.push('/custom-username') // Redirect to username creation page
      }
    } catch (error) {
      console.log('Error signing in:', error)

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
