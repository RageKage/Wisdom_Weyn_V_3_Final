<template>
  <div class="flex items-center justify-between">
    <input
      type="text"
      id="searchInput"
      placeholder="Search for proverb or Gabay"
      :value="searchQuery"
      @input="handleInput"
      class="w-full md:w-60 focus:max-w-full p-2 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-custom-purple-400 focus:border-custom-purple-400 transition-all duration-300"
    />

    <button
      @click="fetchCollectionData"
      class="p-2 bg-custom-purple-600 text-white px-4 py-2 rounded-lg hover:bg-custom-purple-700 transition-colors duration-300"
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
