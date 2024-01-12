<template>
  <div :class="{ 'h-screen': isLoading }" class="container mx-auto">
    <div v-if="!isLoading">
      <!-- filter and search row -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 px-4 sm:px-5 max-w-full mx-auto sm:max-w-[1500px] py-4"
      >
        <CollectionFilter
          :activeFilter="activeFilter"
          @filterType="filterType"
          class="p-2 rounded-lg outline-none"
        />

        <SearchBarVue
          :searchQuery="searchQuery"
          @update:searchQuery="searchQuery = $event"
          class="p-2 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-custom-purple-400 focus:border-custom-purple-400 transition-all duration-300"
        />
      </div>

      <!-- collections -->
      <DisplayCollections
        :displayedItems="displayedItems"
        :activeFilter="activeFilter"
        @loginRequired="showLoginPopup"
      ></DisplayCollections>

      <!-- Scroll to Top Button -->
      <button
        @click="scrollToTop"
        v-show="showScrollToTopBtn"
        class="fixed bottom-4 right-4 bg-custom-gold-500 text-custom-purple-600 shadow-lg ease-in-out hover:bg-custom-gold-600 focus:outline-none focus:ring-opacity-50 p-2 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-custom-purple-400 focus:border-custom-purple-400 transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>

    <!-- Loader Component -->
    <LoaderVue
      v-if="isLoading"
      class="fixed top-0 left-0 w-full h-full flex justify-center items-center"
    />
  </div>
</template>

<script setup>
  import LoaderVue from '@/assets/app-loader.vue'
  import Swal from 'sweetalert2'

  // Child components
  import SearchBarVue from '@/components/collection_helpers/SearchBar.vue'
  import DisplayCollections from '@/components/collection_helpers/DisplayCollections.vue'
  import CollectionFilter from '@/components/collection_helpers/CollectionFilter.vue'

  // Composable collections function
  import { CollectionsFunctions } from '../Composables/Collections'

  const showLoginPopup = () => {
    Swal.fire({
      title: 'Login Required',
      text: 'You must be logged in to vote on collections!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'flex flex-col space-y-4',
        header: 'flex items-center justify-between w-full',
        closeButton: 'text-gray-400 hover:text-gray-500 ml-auto',
        content: 'text-gray-700 prose',
        actions: 'flex justify-end gap-4 mt-4',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to login page
        window.location.href = '/sign-in'
      }
    })
  }

  const {
    displayedItems,
    activeFilter,
    searchQuery,
    isLoading,
    filterType,
    scrollToTop,
    showScrollToTopBtn,
  } = CollectionsFunctions()
</script>
