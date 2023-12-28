<template>
  <div>
    <div>
      <transition name="bounce">
        <div
          class="fixed top-0 inset-x-0 px-4 py-6 pointer-events-none"
          v-if="isSent"
        >
          <div
            class="max-w-md mx-auto rounded-lg bg-white shadow-md overflow-hidden"
          >
            <div
              class="bg-indigo-500 text-white p-4 flex items-center justify-between"
            >
              <p class="text-2xl font-semibold">Posted!</p>
              <div class="bg-green-400 rounded-full p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
              </div>
            </div>
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
import { ref } from "vue";
import { getFunctions, httpsCallable } from "firebase/functions";
import Swal from "sweetalert2";

// import child component
import formVue from "@/components/Views/form.vue";

import { submissionFunctions } from "../Composables/SubmitProverb";

const { formVueRef, isSent, isLoading, submitEntry } = submissionFunctions();
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
