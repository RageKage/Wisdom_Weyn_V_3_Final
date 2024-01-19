<template>
  <div
    v-show="isMenuOpen"
    class="navbar-menu relative z-50 lg:hidden bg-saffron-500"
  >
    <div class="navbar-backdrop fixed inset-0" @click="closeMenu"></div>
    <nav
      class="fixed top-0 left-0 bottom-0 flex z-5 flex-col w-5/6 max-w-sm py-6 px-6 bg-redDamask-500 border-r overflow-y-auto"
    >
      <div class="flex items-center mb-8">
        <a
          class="mr-auto text-3xl font-bold leading-none px-2 py-4 md:py-3 text-seashell-900"
          href="#"
        >
          <Logo class="text-cinnabar-700 pb-4"></Logo>
        </a>
        <button class="navbar-close" @click="closeMenu">
          <svg
            class="h-6 w-6 text-seashell-900 cursor-pointer hover:text-cinnabar-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
        <ul class="space-y-4">
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
