<template>
  <div data-theme="light" class="scroll-smooth">
    <siteNavigation v-if="showHeader" />

    <transition name="fade" mode="out-in">
      <router-view
        v-if="serverStatus !== 'down'"
        class="px-4 sm:px-5 max-w-full mx-auto sm:max-w-[1500px] py-4"
      />
      <div v-else>
        <div v-if="$route.path === '/'">
          <router-view v-slot="{ Component }">
            <component
              :is="Component"
              class="px-4 sm:px-5 max-w-full mx-auto sm:max-w-[1500px] py-4"
            />
          </router-view>
        </div>
        <div v-else class="flex flex-col items-center justify-center h-screen">
          <div class="max-w-md p-4 rounded-lg shadow-md text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-16 h-16 mx-auto mb-4 text-red-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z"
              />
            </svg>

            <h2 class="text-2xl font-semibold mb-4">
              Oops! The server is down.
            </h2>
            <p class="text-gray-700">Please try again later.</p>
            <div class="flex justify-center mt-4">
              <!-- Retry  -->
              <button
                @click="PageReload"
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-4"
              >
                Retry
              </button>
              <router-link
                to="/"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >Go to Home</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import siteNavigation from './components/navigation/SiteNavigation.vue'
  import { showHeader } from '@/router'

  import AppApiService from '@/service/index'
  const service = AppApiService()

  const serverStatus = ref('running')

  // Check server status
  const checkServerStatus = () => {
    service
      .checkServerStatus()
      .then((response) => {
        // if no response it means the server is running
      })
      .catch((error) => {
        serverStatus.value = 'down'
      })
  }

  const PageReload = () => {
    location.reload()
  }

  onMounted(() => {
    checkServerStatus()
  })
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
  body {
    font-family: 'Varela Round', sans-serif;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  /* animation between pages */
  .fade-enter-active,
  .fade-leave-active {
    animation-duration: 0.3s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-to {
    animation-name: fadeIn;
  }

  .fade-leave-from {
    animation-name: fadeOut;
  }
</style>
