<template>
  <div data-theme="light" class="scroll-smooth">
    <div
      v-if="serverStatus === 'down'"
      class="bg-red-100 text-red-800 font-medium rounded-3xl px-4 py-3 shadow-md my-4 w-full sm:w-1/2 mx-auto"
      role="alert"
    >
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="w-6 h-6 mr-4 animate-bounce"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z"
            />
          </svg>
          <p class="font-bold">Server Down</p>
        </div>
        <button
          @click="PageReload()"
          class="bg-red-500 text-white rounded-full mr-3 flex items-center justify-center py-2 px-4 transition-all duration-300 ease-in-out"
        >
          Try Again
        </button>
      </div>
      <p class="text-sm mt-1">
        <!-- server is down msg -->
        The server is currently down. Please try again later.
      </p>
    </div>

    <!-- Show navigation only when data is loaded -->
    <siteNavigation
      v-if="showHeader && isDataLoaded"
      class="px-4 sm:px-5 max-w-full mx-auto sm:max-w-[1500px] py-4"
    />

    <!-- Check if server status is not down and data is loaded -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <div v-if="isDataLoaded">
          <component
            :is="Component"
            class="px-4 sm:px-5 max-w-full mx-auto sm:max-w-[1500px] py-4"
          />
        </div>
        <div v-else class="loading-state">
          <loaderIcon />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import siteNavigation from './components/navigation/SiteNavigation.vue'
  import { showHeader } from '@/router'
  import loaderIcon from './assets/app-loader.vue'

  import AppApiService from '@/service/index'
  const service = AppApiService()

  const serverStatus = ref('running')
  const isDataLoaded = ref(false) // Set loading state to false by default

  // Check server status
  const checkServerStatus = () => {
    isDataLoaded.value = false // Set loading state to false before checking server status
    service
      .checkServerStatus()
      .then(() => {
        serverStatus.value = 'running'
        isDataLoaded.value = true
      })
      .catch(() => {
        serverStatus.value = 'down'
        isDataLoaded.value = true
      })
  }

  const PageReload = () => {
    location.reload()
  }

  let intervalId

  const timer = 30 * 60 * 1000 // 30 minutes

  onMounted(() => {
    checkServerStatus()
    intervalId = setInterval(checkServerStatus, timer) // Check server status every  30 minutes
  })

  onUnmounted(() => {
    clearInterval(intervalId) // Clear the interval when the component is unmounted
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