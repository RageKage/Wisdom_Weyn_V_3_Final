<template>
  <div
    class="min-h-screen w-screen flex items-center justify-center"
    v-if="user"
  >
    <div class="p-8 rounded-3xl shadow-md w-full max-w-md bg-seashell-50">
      <h2 class="text-2xl font-semibold text-seashell-900 mb-4">
        Welcome,
        <span class="text-seashell-600">
          {{ user?.personalName }}
        </span>
      </h2>

      <p class="text-seashell-700 mb-6">
        To continue, please choose a username:
      </p>

      <div class="mb-4">
        <input
          type="text"
          v-model="chosenUsername"
          name="chosenUsername"
          id="chosenUsername"
          placeholder="Username"
          class="border border-seashell-300 text-seashell-900 rounded-lg focus:ring-saffron-500 focus:border-saffron-500 block w-full p-2.5"
          @blur="validateUsername"
        />
        <p v-if="usernameError" class="text-cinnabar-600 text-sm">
          {{ usernameError }}
        </p>
      </div>

      <button
        @click="submitUsername"
        class="w-full px-4 py-2 bg-carrotOrange-500 text-white font-bold rounded-md hover:bg-carrotOrange-600 transition-all duration-300"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  import { useRouter } from 'vue-router'
  import AppApiService from '../../service/index.js'
  import { useAuthStore } from '../../store/authStore' // Import useAuthStore
  const authStore = useAuthStore()

  const service = AppApiService()
  const router = useRouter()
  const user = ref(null)
  const chosenUsername = ref('')
  const usernameError = ref('')

  const validateUsername = () => {
    const username = chosenUsername.value

    if (username.length < 4) {
      usernameError.value = 'Username must be at least 4 characters long.'
    } else if (username.length > 20) {
      usernameError.value = 'Username must be no more than 20 characters long.'
    } else if (username.startsWith(' ') || username.endsWith(' ')) {
      usernameError.value = 'Username cannot start or end with a space.'
    } // check if the username contains spaces or not
    else if (username.includes(' ')) {
      usernameError.value = 'Username cannot contain spaces.'
    } else {
      usernameError.value = ''
    }
  }

  onMounted(async () => {
    try {
      // get the current user details
      await authStore.getCurrentUserDetails()

      // set the user value to the user details
      if (authStore.dbUser) {
        user.value = authStore.dbUser.dbData
      }
    } catch (error) {
      console.error('Error getting current user:', error.message)
    }
  })

  const submitUsername = async () => {
    validateUsername()
    if (usernameError.value) {
      return
    }

    const username = chosenUsername.value

    try {
      await service.addUsernameToDB(username)
      router.push('/')
    } catch (error) {
      usernameError.value = error
    }
  }
</script>
