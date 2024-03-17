<template>
  <div
    v-if="errorMsg"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    @click="close"
  >
    <div class="bg-white rounded-lg p-6 shadow-lg flex items-center space-x-3">
      <div class="flex-shrink-0 bg-red-500 rounded-full p-2" id="error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="white"
          class="w-8 h-8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
  //   errorMsg prop and is required

  const props = defineProps({
    errorMsg: {
      type: String,
      required: true,
    },
  })

  const close = () => {
    // emit the close to the parent
    emits('closeError')
  }

  // we will now define what we are emitting to the parent
  const emits = defineEmits(['loginRequired', 'closeError'])
</script>
