<template>
  <div
    class="space-x-2 md:space-x-4 flex flex-wrap justify-center md:justify-start"
  >
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="[
        'rounded-lg p-2 hover:bg-custom-purple-200 hover:text-custom-purple-700 transition-all duration-300',
        'bg-custom-purple-100 text-custom-purple-600',
        activeFilter === filter.value
        ? 'bg-custom-purple-600 text-white'
        : 'bg-custom-purple-50 text-custom-purple-700 ',
      ]"
      @click="filterType(filter.value)"
    >
    <!--           ? 'bg-custom-gold-600 text-black'
          : 'text-custom-gold-600 hover:text-custom-gold-700 transition rounded-full bg-custom-gold-10', -->

          <!--           ? 'bg-custom-purple-600 text-white'
          : 'bg-custom-purple-50 text-custom-purple-700', -->
      {{ filter.label }}
    </button>
  </div>
</template>

<script setup>
// props 
const props = defineProps({
  activeFilter: String,
});


// filter types
const filters = [
  { label: "All", value: "all" },
  { label: "Poetry", value: "Poetry" },
  { label: "Proverb", value: "proverb" },
];

// emits 
const emits = defineEmits(["filterType", "activeFilter"]);

// when a filter is clicked, emit the filter type and set the active filter, sending it to the parent component
const filterType = (type) => {
  emits("filterType", type);
  emits("activeFilter", type);
};
</script>
