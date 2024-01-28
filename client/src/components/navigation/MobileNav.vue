<template>
  <div
    v-show="isMenuOpen"
    class="fixed inset-0 z-40 transition-opacity ease-linear duration-300"
  >
    <div class="navbar-backdrop fixed inset-0" @click="closeMenu"></div>
    <nav
      class="rounded-2xl fixed top-0 left-0 bottom-0 flex z-5 flex-col w-5/6 max-w-sm py-5 px-5 sm:py-6 sm:px-6 bg-slate-50 border-r overflow-y-auto ease-in-out duration-300"
    >
      <div class="flex justify-between items-center py-5 sm:py-4">
        <a href="#" class="flex items-center">
          <Logo class="mr-2"></Logo>
          <span class="font-semibold text-lg">Wisdom Weyn</span>
        </a>
        <button @click="closeMenu" class="text-gray-700 focus:outline-none">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div>
        <ul class="space-y-4 mt-4">
          <li>
            <router-link
              to="/"
              @click="closeMenu"
              class="block text-2xl font-medium text-seashell-900"
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link
              to="/collections"
              @click="closeMenu"
              class="block text-2xl font-medium text-seashell-900"
            >
              Wisdoms
            </router-link>
          </li>
          <li>
            <router-link
              to="/submissions/create"
              @click="closeMenu"
              class="block text-2xl font-medium text-seashell-900"
            >
              Contribute
            </router-link>
          </li>
          <li v-if="!user">
            <router-link
              to="/sign-in"
              class="block text-2xl font-medium text-seashell-900"
            >
              Log in <span>&rarr;</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup>
  import Logo from './Site-Logo.vue'
  import { onMounted, ref } from 'vue'
  import { currentUser, getCurrentUser } from '@/service/authService.js'

  const props = defineProps({
    isMenuOpen: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['updateMenu'])

  const closeMenu = () => {
    emit('updateMenu', false)
  }

  const user = ref(null)

  onMounted(async () => {
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
    } catch (error) {
      console.error('Error getting current user:', error.message)
    }
  })
</script>
