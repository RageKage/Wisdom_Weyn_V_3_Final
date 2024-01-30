<template>
  <div :class="{ 'h-screen': isLoading }" class="mx-auto">
    <div v-if="!isLoading">
      <!-- filter and search row -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start justify-between mb-6"
      >
        <CollectionFilter
          :activeFilter="activeFilter"
          @filterType="filterType"
          v-if="updateSearchQuery"
        />

        <SearchBarVue @update:searchQuery="updateSearchQuery" />
      </div>

      <!-- collections -->

      <DisplayCollections
        :errorMessage="errorMessage"
        :displayedItems="displayedItems"
        :activeFilter="activeFilter"
        @loginRequired="showLoginPopup"
        @closeErrorMessage="closeError"
      ></DisplayCollections>

      <div
        class="flex flex-row justify-between md:justify-evenly m-6 items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse rtl:space-x-0"
      >
        <button
          @click="goBack"
          class="transform hover:scale-110 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-seashell-900 transform hover:scale-110 transition-all duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          @click="goForward"
          class="transform hover:scale-110 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-seashell-900 hover:scale-110 transition-all duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
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
    errorMessage,
    updateSearchQuery,
    displayedItems,
    activeFilter,
    searchQuery,
    isLoading,
    filterType,
    closeError,
    goForward,
    goBack,
  } = CollectionsFunctions()
</script>
