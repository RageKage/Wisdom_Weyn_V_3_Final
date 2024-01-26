<template>
  <div data-theme="light" class="scroll-smooth">
    <siteNavigation v-if="showHeader" />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <div v-if="serverStatus !== 'down'">
          <component
            :is="Component"
            class="px-4 sm:px-5 max-w-full mx-auto sm:max-w-[1500px] py-4"
          />
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
              <!-- SVG path here -->
            </svg>

            <h2 class="text-2xl font-semibold mb-4">
              Oops! The server is down.
            </h2>
            <p class="text-gray-700">Please try again later.</p>
            <div class="flex justify-center mt-4">
              <button
                @click="PageReload"
                class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-4"
              >
                Retry
              </button>
              <router-link
                to="/"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Go to Home
              </router-link>
            </div>
          </div>
        </div>
      </transition>
    </router-view>
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
