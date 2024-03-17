<template>
  <div class="space-x-2 md:space-x-4 flex items-center">
    <input
      type="text"
      id="searchInput"
      placeholder="Search for Proverb or Gabay"
      v-model="searchQuery"
      class="flex-grow px-4 py-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-transparent transition-all duration-300"
    />

    <span
      class="bg-saffron-300 px-4 py-2 rounded-2xl hover:bg-saffron-400 flex items-center cursor-pointer border-b-4 border-saffron-400 text-seashell-800 transition-all duration-300"
      @click="searchItems()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-3.5 h-3.5 mr-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
      <span>Search</span>
    </span>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

  const emit = defineEmits(['update:searchQuery'])
  const searchQuery = ref('')

  const searchItems = () => {
    if (searchQuery.value.length > 0) {
      emit('update:searchQuery', searchQuery.value)
    }
  }
</script>
