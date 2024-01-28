<template>
  <nav class="text-seashell-700">
    <div class="flex items-center justify-between flex-wrap py-6 px-1">
      <Logo class="rounded-3xl sm:rounded-3xl" />

      <div
        class="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
      >
        <div
          v-if="loading"
          class="flex items-center space-x-3 sm:pr-4 md:pr-4 lg:pr-0"
        >
          <button
            type="button"
            class="bg-redDamask-600 p-1 rounded-2xl text-redDamask-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-redDamask-500"
            id="user-menu-button"
          >
            <span class="sr-only">Open user menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 animate-spin text-redDamask-200 text-center"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
        </div>
        <div
          v-else-if="user"
          class="flex items-center space-x-3 sm:pr-4 md:pr-4 lg:pr-0"
        >
          <button
            @click="toggleDropdown"
            type="button"
            class="flex items-center focus:outline-none"
            id="user-menu-button"
          >
            <span class="sr-only">Open user menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-10 h-10 ml-1 bg-redDamask-600 p-1 rounded-2xl text-redDamask-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-redDamask-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
        </div>
        <router-link
          v-else
          to="/sign-in"
          class="hidden lg:inline text-gray-900 hover:-700"
        >
          Log in <span>&rarr;</span>
        </router-link>
        <!-- Dropdown menu -->
        <div
          v-show="dropdownOpen"
          class="z-50 absolute mt-2 w-48 bg-seashell-50 divide-y divide-gray-200 rounded-lg shadow-lg"
          id="user-dropdown"
          style="top: 100%; right: 0"
        >
          <div class="px-4 py-3">
            <span class="block text-sm text-seashell-700">
              {{ user?.realName }}</span
            >
            <span class="block text-sm text-seashell-500 truncate">{{
              user?.email
            }}</span>
          </div>
          <ul
            class="py-2"
            aria-labelledby="user-menu-button"
            @click="closeDropdown"
          >
            <li class="px-4 py-2 hover:bg-gray-100">
              <button @click="userdashboard(user?.email)">Dashboard</button>
            </li>
            <li class="px-4 py-2 hover:bg-gray-100">
              <button @click="router.push('/setting')">Settings</button>
            </li>
            <li class="px-4 py-2 text-red-500 hover:text-red-600">
              <button @click="signOutUser">Sign out</button>
            </li>
          </ul>
        </div>

        <div class="lg:hidden flex justify-between">
          <button
            @click="toggleMenu"
            class="inline-flex items-center rounded-2xl p-2 w-10 h-10 justify-center text-seashell-700 hover:text-seashell-900 bg-seashell-200 md:inline-flex lg:hidden hover:bg-seashell-300 focus:outline-none focus:ring-2 focus:ring-seashell-400"
          >
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-user"
      >
        <ul
          v-show="isMenuOpen || isLargeScreen"
          class="sm:hidden md:hidden lg:flex items-center space-x-6"
        >
          <li class="p-2 rounded-lg">
            <router-link
              to="/collections"
              class="block py-2 px-3 rounded md:p-0 router-link-exact-active"
              >Wisdoms</router-link
            >
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li class="p-2 rounded-lg">
            <router-link
              to="/submissions/create"
              class="block py-2 px-3 rounded md:p-0 router-link-exact-active"
              >Contribute</router-link
            >
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { onMounted, ref, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import Logo from './Site-Logo.vue'
  import {
    currentUser,
    getCurrentUser,
    signout,
  } from '@/service/authService.js'

  import { Actions } from '../Composables/actions'

  const user = ref(null)
  const dropdownOpen = ref(false)
  const router = useRouter()

  // Props and Emits
  const props = defineProps({
    isMenuOpen: Boolean,
    isLargeScreen: Boolean,
  })
  const emit = defineEmits(['toggleMenu']) // this emmits the toggle menu

  // show the dropdown menu
  const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
  }

  // close the dropdown menu
  const closeDropdown = () => {
    dropdownOpen.value = false
  }
  const toggleMenu = () => {
    emit('toggleMenu')
  }

  const loading = ref(false)

  // this closes the dropdown menu when users clicks outside the dropdown menu
  const onClickOutside = (event) => {
    if (
      !event.target.closest('#user-menu-button') &&
      !event.target.closest('#user-dropdown')
    ) {
      closeDropdown() // Reuse closeDropdown for consistent behavior.
    }
  }

  onMounted(async () => {
    loading.value = true
    document.addEventListener('click', onClickOutside)

    try {
      const authUser = await currentUser()

      if (authUser) {
        // get user data from local storage
        const localUserData = localStorage.getItem('user-data')

        if (localUserData) {
          console.log('Getting current user via local storage')
          user.value = JSON.parse(localUserData)
        } else {
          console.log('Getting current user via API')
          const dbUser = await getCurrentUser(authUser.uid)

          // Save the data to local storage for future use
          localStorage.setItem('user-data', JSON.stringify(dbUser))

          user.value = dbUser
        }
      }
      loading.value = false
    } catch (error) {
      console.error('Error getting current user:', error.message)
    }
  })

  // Sign out user
  const signOutUser = async () => {
    try {
      await signout()
      localStorage.clear()

      dropdownOpen.value = false
      user.value = null
      router.push('/') // Redirect to home after successful login
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  onUnmounted(() => {
    document.removeEventListener('click', onClickOutside)
  })

  const { userdashboard } = Actions()
</script>
