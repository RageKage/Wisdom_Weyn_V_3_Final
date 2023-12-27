<template>
  <div :class="{ 'h-screen': isLoading }" class="container mx-auto">
    <div v-if="!isLoading">
      <div class="flex flex-col justify-center">
        <h1 class="text-4xl font-bold text-center mb-10 text-custom-purple-600">
          Collections
        </h1>
      </div>

      <div
        class="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 max-w-full mx-auto sm:max-w-[1200px]"
      >
        <CollectionFilter
          :activeFilter="activeFilter"
          @filterType="filterType"
        />

        <!-- Search Bar Component -->
        <SearchBarVue
          :searchQuery="searchQuery"
          @update:searchQuery="searchQuery = $event"
        />
      </div>

      <!-- Display Collections Component -->
      <DisplayCollections
        :displayedItems="displayedItems"
        :activeFilter="activeFilter"
      ></DisplayCollections>

      <!-- Scroll to Top Button -->
      <button
        @click="scrollToTop"
        v-show="showScrollToTopBtn"
        class="fixed bottom-4 right-4 bg-custom-gold-500 text-custom-purple-600 p-3 rounded-full shadow-lg transition ease-in-out duration-300 hover:bg-custom-gold-600 focus:outline-none focus:ring-2 focus:ring-custom-gold-300 focus:ring-opacity-50"
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
      class="fixed top-0 left-0 w-full h-full flex justify-center items-center "
    />
  </div>
</template>

<script setup>
import LoaderVue from "@/assets/loader.vue";

// Child components
import SearchBarVue from "@/components/collection_helpers/searchBar.vue";
import DisplayCollections from "@/components/collection_helpers/displayCollections.vue";
import CollectionFilter from "@/components/collection_helpers/collectionFilter.vue";

// Composable collections function
import { CollectionsFunctions } from "../Composables/Collections";

const {
  displayedItems,
  activeFilter,
  searchQuery,
  isLoading,
  filterType,
  searchItems,
  fetchCollectionData,
  scrollToTop,
  showScrollToTopBtn,
} = CollectionsFunctions();
</script>
