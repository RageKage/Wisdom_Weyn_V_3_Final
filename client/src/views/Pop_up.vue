<template>
  <div v-if="showPopup">
    <!--  Please sign in or create an account to contribute. -->
    <div
      @click="showPopup = false"
      class="popup flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"
    >
      <div
        class="popup-content bg-white w-11/12 md:max-w-md mx-auto rounded-xl shadow-lg z-50 overflow-y-auto"
      >
        <!-- close button -->
        <span class="popup-close flex justify-end items-center pr-6 pt-6 pb-2">
          <div
            @click="showPopup = false"
            class="cursor-pointer rounded-full hover:bg-gray-100 p-2 transition duration-300"
          >
            <svg
              class="fill-current text-black"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M9 7.586L2.707 1.293A1 1 0 1 0 1.293 2.707L7.586 9l-6.293 6.293a1 1 0 1 0 1.414 1.414L9 10.414l6.293 6.293a1 1 0 1 0 1.414-1.414L10.414 9l6.293-6.293a1 1 0 0 0-1.414-1.414L9 7.586z"
              />
            </svg>
          </div>
        </span>

        <div class="flex flex-col items-center justify-center gap-4 mb-2 mt-2">
          <h2>Sign in or create an account to contribute.</h2>
          <button
            class="bg-carrotOrange-500 border-2 hover:bg-carrotOrange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
            @click="login"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const showPopup = ref(true)

  const login = () => {
    window.location.href = '/sign-in'
  }
</script>
