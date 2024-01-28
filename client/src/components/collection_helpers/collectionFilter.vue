<template>
  <div
    class="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 p-4"
  >
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="[
        ' p-2 rounded-2xl hover:bg-saffron-400 transition-all duration-300',
        ,
        activeFilter === filter.value
          ? 'bg-saffron-300 hover:bg-saffron-400 text-seashell-800 shadow-lg outline-none ring-2 ring-offset-2 ring-saffron-300'
          : 'bg-saffron-300 text-seashell-800',
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
