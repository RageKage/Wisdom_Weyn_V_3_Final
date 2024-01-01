<template>
  <div>
    <Popup v-if="showPopup" />

    <div
      class="rounded-lg bg-white-100 text-grey-600 p-4 transition-all duration-300 mx-auto max-w-[1200px]"
    >
      <h2 class="text-2xl font-bold mb-4">Contribute a Proverb or Poetry</h2>

      <div class="mb-4">
        <div class="container">
          <form>
            <div class="flex flex-row">
              <label>
                <input
                  type="radio"
                  id="proverb"
                  value="proverb"
                  v-model="picked"
                  checked
                />
                <span>Proverb</span>
              </label>
              <label>
                <input
                  type="radio"
                  id="Poetry"
                  value="Poetry"
                  v-model="picked"
                />
                <span>Poetry</span>
              </label>
            </div>
          </form>
        </div>
      </div>

      <div class="flex flex-col mb-4">
        <label for="username" class="label">
          <span class="label-text"
            >Your Name (for credit): {{ currentUserDB?.displayName }}</span
          >
        </label>
      </div>

      <!-- Conditional Title Field for Poetry -->
      <div v-if="picked === 'Poetry'" class="flex flex-col mb-4">
        <!-- <label for="title" class="label">
          <span class="label-text">Title (for Poetry)</span>
        </label> -->
        <input
          type="text"
          id="title"
          v-model="title"
          placeholder="Title of the Poetry"
          required
          class="form-input px-4 py-3 rounded-2xl"
        />
      </div>

      <!-- Content and Meaning Textareas -->
      <div class="flex flex-col mb-4">
        <!-- <label for="content" class="label">
          <span class="label-text">Proverb or Poetry Text</span>
        </label> -->
        <textarea
          id="content"
          v-model="content"
          :placeholder="
            picked === 'poetry' ? 'Share the Poetry' : 'Share the Proverb'
          "
          rows="4"
          required
          class="form-textarea px-4 py-3 rounded-2xl h-44 max-h-72"
        ></textarea>
      </div>

      <div class="flex flex-col mb-6">
        <!-- <label for="meaning" class="label">
          <span class="label-text">Proverb or Poetry Explanation</span>
        </label> -->
        <textarea
          id="meaning"
          v-model="meaning"
          :placeholder="
            picked === 'Poetry'
              ? 'Meaning or Interpretation of the Gabay'
              : 'Meaning or Interpretation of the Proverb'
          "
          rows="4"
          required
          class="form-textarea px-4 py-3 rounded-2xl h-44 max-h-72"
        ></textarea>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        @click="submitForm"
        class="relative inline-flex text-sm sm:text-base rounded-full font-medium border-2 border-transparent transition-colors outline-transparent focus:outline-transparent disabled:pointer-events-none disabled:opacity-40 disabled:hover:opacity-40 disabled:cursor-not-allowed disabled:shadow-none text-white bg-[#4040F2] hover:bg-[#3333D1] focus:border-[#B3B3FD] focus:bg-[#4040F2] px-4 py-1 sm:py-1.5 sm:px-5"
      >
        <span v-if="props.isLoading">
          <!-- Loading Icon -->
          <div role="status" class="animate-spin">
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-200 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </span>
        <span v-else>
          <span v-if="user"> Contribute </span>
          <span v-else @click="login">Sign in</span></span
        >
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { currentUser, getCurrentUser } from '@/service/authService.js'
  import Popup from '../../views/Pop_up.vue'

  const picked = ref('proverb')
  const title = ref('')
  const content = ref('')
  const meaning = ref('')
  const user = ref('')
  const currentUserDB = ref('')

  // prop
  const props = defineProps({
    isLoading: Boolean,
  })

  // emit
  const emit = defineEmits(['submit', 'reset'])

  const submitForm = () => {
    // before emitting, check if user is logged in
    if (!user.value) {
      return
    }
    emit('submit', {
      title: title.value,
      content: content.value,
      meaning: meaning.value,
      picked: picked.value,
      user_id: user.value,
    })
  }

  // this will reset the form by listening an event send by the parent
  const resetForm = () => {
    title.value = ''
    content.value = ''
    meaning.value = ''
    picked.value = 'proverb'
  }

  const login = () => {
    window.location.href = '/sign-in'
  }

  const showPopup = ref(false)

  onMounted(async () => {
  try {
    const storedUser = localStorage.getItem('user')
    const hasVisited = localStorage.getItem('visited')

    // If user data is found in localStorage, set it
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    } else {
      // If user data is not found in localStorage, and the user hasn't visited before, show the popup
      if (!hasVisited) {
        const authUser = await currentUser()

        // If authUser exists, set user.value and fetch userDB
        if (authUser) {
          user.value = authUser.uid
          const userDB = await getCurrentUser(authUser.uid)
          currentUserDB.value = userDB
        } else {
          // Show the popup and mark the user as visited
          showPopup.value = true
          localStorage.setItem('visited', 'true')
        }
      }
    }
  } catch (error) {
    console.error('Error getting current user:', error)
  }
})

  defineExpose({
    resetForm,
  })
</script>

<style scoped>
  .container form {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }

  .container label {
    display: flex;
    cursor: pointer;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    margin-bottom: 0.375em;
  }

  .container label input {
    position: absolute;
    left: -9999px;
  }

  .container label input:checked + span {
    background-color: #ab49ff;
    color: white;
  }

  .container label input:checked + span:before {
    box-shadow: inset 0 0 0 0.4375em #ffd700;
  }

  .container label span {
    display: flex;
    align-items: center;
    padding: 0.375em 0.75em 0.375em 0.375em;
    border-radius: 99em;
    transition: 0.25s ease;
    color: #ab49ff;
  }

  .container label span:hover {
    background-color: #ead2ff;
  }

  .container label span:before {
    display: flex;
    flex-shrink: 0;
    content: '';
    background-color: #fff;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    margin-right: 0.375em;
    transition: 0.25s ease;
    box-shadow: inset 0 0 0 0.125em #ab49ff;
  }
</style>
