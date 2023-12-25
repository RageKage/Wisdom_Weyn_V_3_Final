<template>
    <div class="flex space-x-2">
      <button
        :class="['py-2 px-4 rounded transition-colors duration-300 ease-in-out text-lg font-semibold', activeFilter === 'all' ? 'bg-custom-purple-600 text-white' : 'bg-custom-purple-50 text-custom-purple-700']"
        @click="filterType('all')"
      >
        All
      </button>
      <button
        :class="['py-2 px-4 rounded transition-colors duration-300 ease-in-out text-lg font-semibold', activeFilter === 'Poetry' ? 'bg-custom-purple-600 text-white' : 'bg-custom-purple-50 text-custom-purple-700']"
        @click="filterType('Poetry')"
      >
        Poetry
      </button>
      <button
        :class="['py-2 px-4 rounded transition-colors duration-300 ease-in-out text-lg font-semibold', activeFilter === 'proverb' ? 'bg-custom-purple-600 text-white' : 'bg-custom-purple-50 text-custom-purple-700']"
        @click="filterType('proverb')"
      >
        Proverbs
      </button>
    </div>
  </template>
  
  
  
    
    <script setup>
    import { defineProps, defineEmits } from "vue";
    
    const props = defineProps({
      filterType: Function,
      activeFilter: String,
    });
    
    const emits = defineEmits(["filterType", "activeFilter"]);
    
    const filterType = (type) => {
      emits("filterType", type);
      emits("activeFilter", type);
    };
    </script>
    