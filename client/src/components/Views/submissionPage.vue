<template>
  <div>
    <div>
      <transition name="fade">
        <div
          v-if="isSent"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div
            class="bg-white rounded-lg p-6 shadow-lg flex items-center space-x-3"
          >
            <div class="flex-shrink-0 bg-green-500 rounded-full p-2">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p class="text-lg font-semibold">Successfully Posted!</p>
          </div>
        </div>
      </transition>
    </div>

    <div>
      <formVue @submit="submitEntry" ref="formVueRef" :is-loading="isLoading" />
    </div>
  </div>
</template>

<script setup>
  // import child component
  import formVue from '@/components/Views/submission-form.vue'

  import { submissionFunctions } from '../Composables/FormSubmission'

  const { formVueRef, isSent, isLoading, submitEntry } = submissionFunctions()
</script>
