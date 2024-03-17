<template>
  <div class="min-h-screen">
    <div class="mx-auto">
      <div class="shadow-lg bg-white rounded-2xl p-4 sm:p-8">
        <h2 class="text-xl font-semibold text-center text-gray-800">
          Share Your Wisdom
        </h2>
        <p class="text-center text-sm text-gray-500 mt-2">
          Contribute your favorite Somali Proverbs or Poetry
        </p>

        <form class="mt-4">
          <div class="flex justify-center space-x-4">
            <label
              class="flex items-center space-x-2 text-sm font-semibold text-gray-800"
            >
              <input
                type="radio"
                id="Proverb"
                value="Proverb"
                v-model="picked"
                checked
                class="p-3 border border-gray-300 bg-white rounded-xl"
              />
              <span>Proverb</span>
            </label>
            <label
              class="flex items-center space-x-2 text-sm font-semibold text-gray-800"
            >
              <input
                type="radio"
                id="Poetry"
                value="Poetry"
                v-model="picked"
                class="p-3 border border-gray-300 bg-white rounded-xl"
              />
              <span>Poetry</span>
            </label>
          </div>

          <div v-if="picked === 'Poetry'" class="mt-4">
            <input
              type="text"
              id="title"
              v-model="title"
              placeholder="Title of the Poetry"
              required
              class="w-full p-3 border border-gray-300 bg-white rounded-xl"
            />
          </div>

          <div class="mt-4">
            <textarea
              id="content"
              v-model="content"
              :placeholder="
                picked === 'Poetry' ? 'Your Poetry' : 'Your Proverb'
              "
              rows="4"
              required
              class="w-full p-3 border border-gray-300 h-56 max-h-full min-h-28 bg-white rounded-xl"
            ></textarea>
          </div>

          <div class="mt-4">
            <textarea
              id="meaning"
              v-model="meaning"
              :placeholder="picked === 'Poetry' ? 'Interpretation' : 'Meaning'"
              rows="2"
              required
              class="w-full p-3 border border-gray-300 h-56 max-h-full min-h-28 bg-white rounded-xl"
            ></textarea>
          </div>

          <div v-if="future_feature">
            <div
              v-if="picked == 'Poetry' && !isOriginal"
              class="flex flex-col space-y-2 text-sm font-semibold text-gray-800 mb-4"
            >
              <input
                type="text"
                id="author"
                v-model="author"
                placeholder="Author's Name (if known)"
                class="w-full p-3 border border-gray-300 bg-white rounded-xl mt-4"
              />
              <label>
                <input
                  type="checkbox"
                  id="unknownAuthor"
                  v-model="unknownAuthor"
                  class="h-6 w-6 p-3 border border-gray-300 bg-white rounded-xl"
                />
                <span class="text-sm font-semibold text-gray-800 ml-2"
                  >Author Unknown</span
                >
              </label>
            </div>

            <!-- ! Future implement -->

            <div
              v-if="picked == 'Poetry'"
              class="flex items-center space-x-2 text-sm font-semibold text-gray-800 mt-4"
            >
              <label>
                <input
                  type="checkbox"
                  id="original"
                  v-model="isOriginal"
                  class="h-6 w-6 p-3 border border-gray-300 bg-white rounded-xl"
                />
                <span class="text-sm font-semibold text-gray-800 ml-2"
                  >This is my original work</span
                >
              </label>
            </div>
          </div>
        </form>
        <div class="mt-6">
          <button
            type="submit"
            @click="submitForm"
            class="bg-saffron-300 px-4 py-2 rounded-2xl hover:bg-saffron-400 flex items-center cursor-pointer border-b-4 border-saffron-400 text-seashell-800 transition-all duration-300"
          >
            <span v-if="props.isLoading" class="flex items-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="w-8 h-8 animate-spin text-center fill-gray-300"
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
              <span v-if="user">Contribute</span>
              <span v-else @click="login">Sign in</span>
            </span>
          </button>
        </div>
      </div>

      <div
        class="mt-4 bg-white rounded-2xl shadow p-4 sm:p-8 text-gray-800 space-y-4"
      >
        <h3 class="text-lg font-semibold text-gray-800">
          How to Share Your Work
        </h3>
        <p class="text-sm text-gray-500 mt-2">
          Hey there! We're excited to see what you've got. Just a few things to
          keep in mind to make sure everything's cool and respectful.
        </p>
        <ul class="list-disc list-inside mt-4">
          <li class="text-sm text-gray-500">
            Share original content or time-honored Proverbs and poetry.
          </li>
          <li class="text-sm text-gray-500">
            If you're sharing someone else's work, please give credit where it's
            due.
          </li>
          <li class="text-sm text-gray-500">
            Ensure content is respectful and culturally sensitive.
          </li>
          <li class="text-sm text-gray-500">
            Fill out the submission form with all the deets – it helps a lot!
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useAuthStore } from '../../store/authStore' // Import useAuthStore
  const authStore = useAuthStore()

  const picked = ref('Proverb')
  const title = ref('')
  const content = ref('')
  const meaning = ref('')
  const user = ref('')
  const currentUserDB = ref('')

  const isOriginal = ref(false)
  const unknownAuthor = ref(false)

  const future_feature = ref(false)

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
      user_id: currentUserDB.value,
    })
  }

  // this will reset the form by listening an event send by the parent
  const resetForm = () => {
    title.value = ''
    content.value = ''
    meaning.value = ''
    picked.value = 'Proverb'
  }

  const login = () => {
    window.location.href = '/sign-in'
  }

  watch(title, (newTitle) => {
    localStorage.setItem('title', newTitle)
  })

  watch(content, (newContent) => {
    localStorage.setItem('content', newContent)
  })

  watch(meaning, (newMeaning) => {
    localStorage.setItem('meaning', newMeaning)
  })

  onMounted(async () => {
    // Populate fields with localStorage data
    title.value = localStorage.getItem('title') || ''
    content.value = localStorage.getItem('content') || ''
    meaning.value = localStorage.getItem('meaning') || ''
    try {
      // get the current user details
      await authStore.getCurrentUserDetails()

      // set the user value to the user details
      if (authStore.dbUser) {
        user.value = authStore.dbUser.dbData
        currentUserDB.value = authStore.dbUser.dbData._id
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  })

  defineExpose({
    resetForm,
  })
</script>
