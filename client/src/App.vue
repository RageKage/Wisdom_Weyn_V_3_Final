<template>
  <div id="app">
    <div
      v-if="serverDown"
      class="bg-red-100 text-red-800 font-medium rounded-3xl px-4 py-3 shadow-md my-4 w-full sm:w-1/2 mx-auto"
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
          <div class="flex flex-col items-start justify-center">
            <p class="font-bold">Server Down</p>
            <p class="text-sm mt-1">
              <!-- server is down msg -->
              The server is currently down. Please try again later.
            </p>
          </div>
        </div>
        <button
          @click="PageReload()"
          class="bg-red-500 text-white rounded-full mr-3 flex items-center justify-center py-2 px-4 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 hover:bg-red-600 hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
    </div>
    <loading-spinner v-if="isLoading" />
    <siteNavigation
      v-if="showHeader"
      class="px-4 sm:px-5 max-w-full mx-auto sm:max-w-[1500px] py-4"
    />
    <router-view
      class="px-4 sm:px-5 max-w-full mx-auto sm:max-w-[1500px] py-4"
    />
  </div>
</template>

<script setup>
  import LoadingSpinner from './assets/app-loader.vue'
  import { showHeader, isLoading, serverDown } from './router/index'

  import siteNavigation from './components/navigation/SiteNavigation.vue'

  const PageReload = () => {
    window.location.reload()
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
  body {
    font-family: 'Varela Round', sans-serif;
  }
</style>
