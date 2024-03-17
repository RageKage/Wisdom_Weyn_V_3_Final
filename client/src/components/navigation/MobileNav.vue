<template>
  <div
    v-show="isMenuOpen"
    class="fixed inset-0 z-40 transition-opacity ease-linear duration-300"
  >
    <div class="navbar-backdrop fixed inset-0" @click="closeMenu"></div>
    <nav
      class="rounded-tr-3xl rounded-br-3xl fixed top-0 left-0 bottom-0 flex z-5 flex-col w-5/6 max-w-sm py-4 px-4 sm:px-5 bg-slate-50 border-r overflow-y-auto ease-in-out duration-300"
      id="menu"
    >
      <div class="flex justify-between items-center">
        <a @click="closeMenu" href="#" class="flex items-center">
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
              @click="closeMenu"
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
  import { useAuthStore } from '../../store/authStore' // Import useAuthStore
  const authStore = useAuthStore()

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
    // get the current user details
    await authStore.getCurrentUserDetails()

    // set the user value to the user details
    if (authStore.dbUser) {
      user.value = authStore.dbUser.dbData
    }
  })
</script>

<style scoped>
  #menu {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
