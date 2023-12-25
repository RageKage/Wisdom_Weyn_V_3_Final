<template>
    <div class="flex items-center space-x-2" v-if="!isLoading">
      <input
        type="text"
        id="searchInput"
        placeholder="Search for proverb or Gabay"
        :value="searchQuery"
        @input="handleInput"
        class="p-2.5 w-80 text-base outline-none h-11 rounded-l-md  bg-custom-purple-50 focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-custom-purple-500 focus:border-custom-purple-500"
      />
      <button
        @click="fetchCollectionData"
        class="p-2.5 bg-custom-purple-600 text-custom-gold-500 px-4 py-2 rounded-r-md hover:bg-custom-purple-700 transition-colors duration-300 h-11"
      >
        Search
      </button>
    </div>
  </template>
  
  
  
  
  <script setup>
  import { defineProps, defineEmits } from "vue";
  
  const props = defineProps({
    isLoading: Boolean,
    searchQuery: String,
    searchItems: Function,
    fetchCollectionData: Function,
  });
  
  const emits = defineEmits([
    "update:searchQuery",
    "searchItems",
    "fetchCollectionData",
  ]);
  
  // emit event to parent component
  const handleInput = (event) => {
    emits("update:searchQuery", event.target.value);
  };
  </script>
  
  
  