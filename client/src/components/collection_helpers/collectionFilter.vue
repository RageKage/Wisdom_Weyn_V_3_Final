<template>
  <div class="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4">
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="[
        ' px-4 py-2 rounded-2xl hover:bg-saffron-400 transition-all duration-300 flex items-center cursor-pointer',
        ,
        activeFilter === filter.value
          ? 'bg-saffron-400 text-seashell-800'
          : 'bg-saffron-300  px-4 py-2 rounded-2xl hover:bg-saffron-400  flex items-center cursor-pointer border-b-4 border-saffron-400  text-seashell-800 transition-all duration-300',
      ]"
      @click="filterType(filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<script setup>
  // props
  const props = defineProps({
    activeFilter: String,
  })

  // filter types
  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Gabay', value: 'Poetry' },
    { label: 'Maahmaahyo', value: 'Proverb' },
  ]

  // emits
  const emits = defineEmits(['filterType', 'activeFilter'])

  // when a filter is clicked, emit the filter type and set the active filter, sending it to the parent component
  const filterType = (type) => {
    emits('filterType', type)
    emits('activeFilter', type)
  }
</script>
