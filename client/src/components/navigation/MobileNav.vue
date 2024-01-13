<template>
  <div v-show="isMenuOpen" class="navbar-menu relative z-50 lg:hidden">
    <div class="navbar-backdrop fixed inset-0" @click="closeMenu"></div>
    <nav
      class="fixed top-0 left-0 bottom-0 flex z-5 flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto"
    >
      <div class="flex items-center mb-8">
        <a
          class="mr-auto text-3xl font-bold leading-none px-2 py-4 md:py-3"
          href="#"
        >
          <Logo></Logo>
        </a>
        <button class="navbar-close" @click="closeMenu">
          <svg
            class="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
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
              class="block text-lg font-medium text-gray-700 hover:text-gray-900"
              >Home</router-link
            >
          </li>
          <li>
            <router-link
              to="/collections"
              @click="closeMenu"
              class="block text-lg font-medium text-gray-700 hover:text-gray-900"
              >Wisdoms</router-link
            >
          </li>
          <li>
            <router-link
              to="/submissions/create"
              @click="closeMenu"
              class="block text-lg font-medium text-gray-700 hover:text-gray-900"
              >Contribute</router-link
            >
          </li>
          <li>
            <router-link
              to="/sign-in"
              class="hidden lg:inline text-gray-900 hover:text-custom-purple-700"
            >
              Log in <span>&rarr;</span>
            </router-link>
          </li>
          <li>
            <!-- <router-link to="/admin" @click="closeMenu" class="block text-lg font-medium text-gray-700 hover:text-gray-900">Admin</router-link> -->
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup>
  import Logo from './Site-Logo.vue'

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
</script>
