<template>
  <nav class="text-seashell-700" v-if="loading">
    <div class="flex items-center justify-between flex-wrap">
      <Logo />

      <div
        class="relative flex items-center md:order-2 md:space-x-0 rtl:space-x-reverse bg-white p-2 rounded-full"
      >
        <div v-if="user" class="p-1">
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
              class="w-10 h-10 bg-redDamask-600 p-1 rounded-full text-redDamask-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-redDamask-500"
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
          >Log in <span>&rarr;</span></router-link
        >
        <!-- Dropdown menu -->
        <div
          v-show="dropdownOpen"
          class="z-50 absolute mt-2 w-48 bg-seashell-50 divide-y divide-gray-200 rounded-lg shadow-lg"
          id="user-dropdown"
          style="top: 100%; right: 0"
        >
          <div class="px-4 py-3">
            <span class="block text-sm text-seashell-700">{{
              user?.personalName
            }}</span>
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
              <button @click="userdashboard(user?.username)">Dashboard</button>
            </li>
            <li class="px-4 py-2 hover:bg-gray-100">
              <button @click="router.push('/setting')">Settings</button>
            </li>
            <li class="px-4 py-2 text-red-500 hover:text-red-600">
              <button @click="signOutUser">Sign out</button>
            </li>
          </ul>
        </div>

        <div class="lg:hidden flex justify-between p-1">
          <button
            @click="toggleMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-seashell-700"
          >
            <svg
              class="w-4 h-4"
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

      <div class="items-center justify-between hidden w-full md:w-auto lg:flex">
        <div
          class="text-base md:flex-grow items-center justify-end md:flex md:space-x-10 text-seashell-700"
        >
          <span class="rounded-lg md:p-0 router-link-exact-active"
            ><router-link to="/collections"> Wisdoms </router-link></span
          >
          <span class="rounded-lg md:p-0 router-link-exact-active"
            ><router-link to="/submissions/create">
              Contribute
            </router-link></span
          >
        </div>
        <div
          id="slider"
          class="absolute bottom-0 h-1 bg-blue-500 transition-all duration-300"
        ></div>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { onMounted, ref, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import Logo from './Site-Logo.vue'
  import { Actions } from '../Composables/actions'
  import { useAuthStore } from '../../store/authStore' // Import useAuthStore
  const authStore = useAuthStore()

  const dropdownOpen = ref(false)
  const router = useRouter()
  const user = ref(null)

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

  const loading = ref(true)

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
    loading.value = false
    document.addEventListener('click', onClickOutside)

    // get the current user details
    await authStore.getCurrentUserDetails()

    // set the user value to the user details
    if (authStore.dbUser) {
      user.value = authStore.dbUser.dbData
    }

    loading.value = true
  })
  // Sign out user
  const signOutUser = async () => {
    try {
      await authStore.signout()
      router.go()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  onUnmounted(() => {
    document.removeEventListener('click', onClickOutside)
  })

  const { userdashboard } = Actions()
</script>
