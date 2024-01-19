<template>
  <div
    class="space-x-2 md:space-x-4 flex flex-wrap justify-center md:justify-start"
  >
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="[
        'rounded-lg p-2 hover:bg-cinnabar-300 transition-all duration-300',
        'bg-cinnabar-400 text-seashell-800',
        activeFilter === filter.value
          ? 'bg-saffron-400 hover:bg-saffron-300 text-seashell-800'
          : 'bg-cinnabar-400 text-seashell-800',
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
    { label: 'Maahmaahyo', value: 'proverb' },
  ]

  // emits
  const emits = defineEmits(['filterType', 'activeFilter'])

  // when a filter is clicked, emit the filter type and set the active filter, sending it to the parent component
  const filterType = (type) => {
    emits('filterType', type)
    emits('activeFilter', type)
  }
</script>
