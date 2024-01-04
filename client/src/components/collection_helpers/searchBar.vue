<template>
  <div class="space-x-2 md:space-x-4 flex items-center">
    <input
      type="text"
      id="searchInput"
      placeholder="Search for proverb or Gabay"
      :value="searchQuery"
      @input="handleInput"
      class="flex-grow hover:cursor-pointer placeholder:text-slate-900 rounded-lg outline-none border-custom-purple-100 focus:bg-white focus:ring-2 focus:ring-custom-purple-400 focus:border-custom-purple-400 transition-all duration-300"
    />

    <span
      class="flex items-center hover:cursor-pointer rounded-lg bg-custom-purple-100 text-custom-purple-600 p-2 hover:bg-custom-purple-200 hover:text-custom-purple-700 transition-all duration-300 mr-3"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="rtl:rotate-180 w-3.5 h-3.5 ms-2 mr-4"
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
  const props = defineProps({
    isLoading: Boolean,
    searchQuery: String,
    searchItems: Function,
    fetchCollectionData: Function,
  })

  const emits = defineEmits([
    'update:searchQuery',
    'searchItems',
    'fetchCollectionData',
  ])

  // emit event to parent component
  const handleInput = (event) => {
    emits('update:searchQuery', event.target.value)
  }
</script>
